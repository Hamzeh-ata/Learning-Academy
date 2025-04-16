using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.Notifications;
using Arkan.Server.PageModels.OrdersModels;
using Arkan.Server.PageModels.Payments;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;

namespace Arkan.Server.Repository
{
    public class OrdersRepository : IOrdersInterface
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly INotificationService _NotificationService;
        private readonly UserManager<ApplicationUser> _userManager;
        public OrdersRepository(ApplicationDBContext context
        , IBaseRepository IBaseRepository
        , INotificationService NotificationService
        , UserManager<ApplicationUser> userManager
        )
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _NotificationService = NotificationService;
            _userManager = userManager;
        }
        public async Task<PaginationResult<GetPendingOrders>> GetOrders(int pageNumber, int pageSize)
        {
            var query = _context.UserOrder
                .Where(uo => !uo.IsConfirmed)
                .Include(uo => uo.OrderItems)
                .Select(uo => new GetPendingOrders
                {
                    Id = uo.Id,
                    UserName = $"{uo.User.FirstName} {uo.User.LastName}",
                    UserPhone = uo.User.PhoneNumber,
                    OrderDate = uo.OrderDate,
                    Items = uo.OrderItems.Select(oi => new OrdersItems
                    {
                        Id = oi.Id,
                        Name = oi.Type == ItemTypes.Course ? _context.Courses.Where(c => c.Id == oi.ItemId).Select(c => c.Name).FirstOrDefault() ?? "Unknown Course" :
                               oi.Type == ItemTypes.Package ? _context.Package.Where(p => p.Id == oi.ItemId).Select(p => p.Name).FirstOrDefault() ?? "Unknown Package" :
                              "Unknown Item Type",
                        Price = oi.Price,
                        Type = oi.Type.ToString(),
                        Code = oi.Code
                        
                    }).ToList(),
                    Amount = uo.Amount,
                    DiscountAmount = uo.DiscountAmount,
                    PromoCode = uo.PromoCode
                })
                .OrderByDescending(uo => uo.OrderDate)
                .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<List<GetPendingOrders>> GetOrders()
        {
            var totalPayments = await _context.OrderPayments
                .GroupBy(op => op.OrderId)
                .Select(g => new { OrderId = g.Key, TotalPayments = g.Sum(op => op.AmountPaid) })
                .ToDictionaryAsync(g => g.OrderId, g => g.TotalPayments);

            var courseNames = await _context.Courses.ToDictionaryAsync(c => c.Id, c => c.Name);
            var packageNames = await _context.Package.ToDictionaryAsync(p => p.Id, p => p.Name);

            var query = await _context.UserOrder
               .Where(uo => !uo.IsConfirmed)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetPendingOrders
               {
                   Id = uo.Id,
                   UserName = uo.User.FirstName + " " + uo.User.LastName,
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? courseNames.ContainsKey(oi.ItemId) ? courseNames[oi.ItemId] : "Unknown Course" :
                        oi.Type == ItemTypes.Package ? packageNames.ContainsKey(oi.ItemId) ? packageNames[oi.ItemId] : "Unknown Package" :
                        "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code
                   }).ToList(),
                   Amount = uo.DiscountAmount > 0 ? uo.DiscountAmount : uo.Amount,
                   DiscountAmount = uo.DiscountAmount > 0 ? (uo.DiscountAmount / uo.Amount) * 100 : 0,
                   PromoCode = uo.PromoCode
               })
               .ToListAsync();

            return query;
        }
        public async Task<string> ConfirmOrders(List<int> Ids,string userId)
        {
            var orders = await _context.UserOrder
                .Where(uo => Ids.Contains(uo.Id))
                .Include(o => o.OrderItems)
                .ToListAsync();

            List<int> CoursesToEnroll = orders
             .SelectMany(o => o.OrderItems
             .Where(oi => oi.Type == ItemTypes.Course)
             .Select(oi => oi.ItemId))
             .ToList();

            bool hasPackagesInOrders = orders.Any(o => o.OrderItems.Any(oi => oi.Type == ItemTypes.Package));

            if (hasPackagesInOrders)
            {
                List<int> packageIdsInOrders = orders
                    .SelectMany(o => o.OrderItems
                        .Where(oi => oi.Type == ItemTypes.Package)
                        .Select(oi => oi.ItemId))
                    .ToList();

                var coursesInPackages = await GetPackageCourses(packageIdsInOrders);

                CoursesToEnroll.AddRange(coursesInPackages);
                CoursesToEnroll = CoursesToEnroll.Distinct().ToList();
            }
            var isCompleted = false;

            foreach (var order in orders)
            {
                order.IsConfirmed = true;
                order.ConfirmedDate = _IBaseRepository.GetJordanTime();
                order.ConfirmedBy = userId;
                isCompleted = await EnrollStudentToCourses(order.UserId, CoursesToEnroll);

                if (!isCompleted)
                {
                    return ResponseKeys.Failed.ToString();
                }
            }
            return ResponseKeys.Success.ToString();
        }
        public async Task<string> DeleteOrders(List<int> Ids)
        {
            var orders = await _context.UserOrder
              .Where(uo => Ids.Contains(uo.Id))
              .ToListAsync();

            var isRemoved = _IBaseRepository.RemoveRange<UserOrder>(orders);

            if (!isRemoved)
            {
                return ResponseKeys.Failed.ToString();

            }
            return ResponseKeys.Success.ToString();
        }
        public async Task<PaginationResult<GetConfirmedOrders>> GetConfirmedOrders(int pageNumber, int pageSize){

            var totalPayments = await _context.OrderPayments
             .GroupBy(op => op.OrderId)
             .Select(g => new { OrderId = g.Key, TotalPayments = g.Sum(op => op.AmountPaid) })
             .ToDictionaryAsync(g => g.OrderId, g => g.TotalPayments);

            var query = _context.UserOrder
               .Where(uo => uo.IsConfirmed)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetConfirmedOrders
               {
                   Id = uo.Id,
                   UserName = $"{uo.User.FirstName} {uo.User.LastName}",
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? _context.Courses.Where(c => c.Id == oi.ItemId).Select(c => c.Name).FirstOrDefault() ?? "Unknown Course" :
                              oi.Type == ItemTypes.Package ? _context.Package.Where(p => p.Id == oi.ItemId).Select(p => p.Name).FirstOrDefault() ?? "Unknown Package" :
                             "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code,
                   }).ToList(),
                   Amount = uo.Amount,
                   DiscountAmount = uo.DiscountAmount,
                   PromoCode = uo.PromoCode,
                   TotalPayments = totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0,
                   RemainingAmount = uo.DiscountAmount > 0 ?
                   (uo.DiscountAmount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0)) :
                   (uo.Amount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0))
               })
               .OrderByDescending(uo => uo.OrderDate)
               .AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<List<GetConfirmedOrders>> GetConfirmedOrders()
        {

            var totalPayments = await _context.OrderPayments
              .GroupBy(op => op.OrderId)
              .Select(g => new { OrderId = g.Key, TotalPayments = g.Sum(op => op.AmountPaid) })
              .ToDictionaryAsync(g => g.OrderId, g => g.TotalPayments);


            var courseNames = await _context.Courses.ToDictionaryAsync(c => c.Id, c => c.Name);
            var packageNames = await _context.Package.ToDictionaryAsync(p => p.Id, p => p.Name);

            var query = await _context.UserOrder
               .Where(uo => uo.IsConfirmed)
               .Include(uo => uo.OrderItems)
               .Select(uo => new GetConfirmedOrders
               {
                   Id = uo.Id,
                   UserName = uo.User.FirstName + " " + uo.User.LastName,
                   UserPhone = uo.User.PhoneNumber,
                   OrderDate = uo.OrderDate,
                   Items = uo.OrderItems.Select(oi => new OrdersItems
                   {
                       Id = oi.Id,
                       Name = oi.Type == ItemTypes.Course ? courseNames.ContainsKey(oi.ItemId) ? courseNames[oi.ItemId] : "Unknown Course" :
                        oi.Type == ItemTypes.Package ? packageNames.ContainsKey(oi.ItemId) ? packageNames[oi.ItemId] : "Unknown Package" :
                        "Unknown Item Type",
                       Price = oi.Price,
                       Type = oi.Type.ToString(),
                       Code = oi.Code,
                   }).ToList(),
                   Amount = uo.DiscountAmount > 0 ? uo.DiscountAmount : uo.Amount,
                   DiscountAmount = uo.DiscountAmount > 0 ? (uo.DiscountAmount / uo.Amount) * 100 : 0,
                   PromoCode = uo.PromoCode,
                   TotalPayments = totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0,
                   RemainingAmount = uo.DiscountAmount > 0 ?
                    (uo.DiscountAmount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0)) :
                    (uo.Amount - (totalPayments.ContainsKey(uo.Id) ? totalPayments[uo.Id] : 0))
               })
               .ToListAsync();

            return query;
        }
        public byte[] GeneratePendingOrdersExcelFile(List<GetPendingOrders> orders)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Pending Orders");
                int row = 1;

                // Add headers
                worksheet.Cells[row, 1].Value = "User Name";
                worksheet.Cells[row, 2].Value = "User Phone";
                worksheet.Cells[row, 3].Value = "Order Date";
                worksheet.Cells[row, 4].Value = "Amount";
                worksheet.Cells[row, 5].Value = "Discount Amount";
                // Add more headers for other fields as needed

                // Fill data
                foreach (var order in orders)
                {
                    row++;
                    worksheet.Cells[row, 1].Value = order.UserName;
                    worksheet.Cells[row, 2].Value = order.UserPhone;
                    worksheet.Cells[row, 3].Value = order.OrderDate.ToString("yyyy-MM-dd");
                    worksheet.Cells[row, 4].Value = order.Amount;
                    worksheet.Cells[row, 5].Value = order.DiscountAmount;
                }

                // Auto-fit columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Convert package to a byte array
                return package.GetAsByteArray();
            }
        }
        public byte[] GenerateConfirmedOrdersExcelFile(List<GetConfirmedOrders> orders)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Confirmed Orders");
                int row = 1;

                // Add headers
                worksheet.Cells[row, 1].Value = "User Name";
                worksheet.Cells[row, 2].Value = "User Phone";
                worksheet.Cells[row, 3].Value = "Order Date";
                worksheet.Cells[row, 4].Value = "Amount";
                worksheet.Cells[row, 5].Value = "Discount %";
                worksheet.Cells[row, 6].Value = "Total Payments";
                worksheet.Cells[row, 7].Value = "Remaining Amount";

                // Fill data
                foreach (var order in orders)
                {
                    row++;
                    worksheet.Cells[row, 1].Value = order.UserName;
                    worksheet.Cells[row, 2].Value = order.UserPhone;
                    worksheet.Cells[row, 3].Value = order.OrderDate.ToString("yyyy-MM-dd"); 
                    worksheet.Cells[row, 4].Value = order.Amount;
                    worksheet.Cells[row, 5].Value = order.DiscountAmount;
                    worksheet.Cells[row, 6].Value = order.TotalPayments;
                    worksheet.Cells[row, 7].Value = order.RemainingAmount;
                }

                // Auto-fit columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Convert package to a byte array
                return package.GetAsByteArray();
            }
        }
        public GetExcelFile GenerateOrderPaymentsExcelFile(int orderId)
        {
            var userPayments = _context.OrderPayments
                .Where(op => op.OrderId == orderId)
                .Include(op => op.Order)
                .ThenInclude(o => o.User)
                .ToList();


            if(userPayments.Count == 0) {

                return new GetExcelFile
                {
                    Key = "No payments were found"
                };
            }

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add($"{userPayments.Select(up => $"{up.Order.User.FirstName}{up.Order.User.LastName}").FirstOrDefault()}Payments");

                int row = 1;
                double amountPaid = 0;
                // Add headers
                worksheet.Cells[row, 1].Value = "Payment Date";
                worksheet.Cells[row, 2].Value = "Amount";
                worksheet.Cells[row, 3].Value = "Discount %";
                worksheet.Cells[row, 4].Value = "Amount Paid";
                worksheet.Cells[row, 5].Value = "Remaining Amount";
                // Add more headers for other fields as needed

                // Fill data
                foreach (var payment in userPayments)
                {
                    amountPaid += payment.AmountPaid;

                    row++;
                    worksheet.Cells[row, 1].Value = payment.PaymentDate.ToString("yyyy-MM-dd");
                    worksheet.Cells[row, 2].Value = payment.Order.DiscountAmount > 0 ? payment.Order.DiscountAmount : payment.Order.Amount;
                    worksheet.Cells[row, 3].Value = payment.Order.DiscountAmount > 0 ? (payment.Order.DiscountAmount / payment.Order.Amount) * 100 : 0;
                    worksheet.Cells[row, 4].Value = payment.AmountPaid;
                    worksheet.Cells[row, 5].Value = payment.Order.DiscountAmount > 0 ?
                        payment.Order.DiscountAmount - amountPaid
                        : 
                        payment.Order.Amount - amountPaid;
                }

                // Auto-fit columns
                worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                // Convert package to a byte array

                return new GetExcelFile
                {
                    FileName = $"{userPayments.Select(up => $"{up.Order.User.FirstName}{up.Order.User.LastName}").FirstOrDefault()}Payments.xlsx",
                    Excel = package.GetAsByteArray(),
                    Key = ResponseKeys.Success.ToString()
                };
            }
        }
        private async Task<bool> EnrollStudentToCourses(string userId, List<int> courseIds)
        {
            // Get the current UTC time
            DateTime utcNow = DateTime.UtcNow;

            // Convert UTC time to Jordan time
            TimeZoneInfo jordanTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Jordan Standard Time");

            DateTime jordanTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, jordanTimeZone);

            var studentId = await _IBaseRepository.GetStudentIdByUserId(userId);

            var user = await _userManager.FindByIdAsync(userId);

            string studentName = user.FirstName + " " + user.LastName;

            var studentCourses = await _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Select(e => e.CourseId)
                .ToListAsync();

            var filteredCourses = courseIds.Except(studentCourses).ToList();

            var enrollments = filteredCourses.Select(courseId => new Enrollment { StudentId = studentId, CourseId = courseId , EnrollmentDate = jordanTime }).ToList();

            var isAdded = await _IBaseRepository.AddRangeAsync<Enrollment>(enrollments);

            if (isAdded)
            {
                foreach (var courseId in filteredCourses)
                {
                    var (instructorId, courseName) = await GetCourseNameAndInstructorId(courseId);

                    if (instructorId.HasValue && !string.IsNullOrEmpty(courseName))
                    {
                        var instructorUserId = await GetInstructorUserId(instructorId);

                        await CreateStudentInstructorRoom(userId, instructorUserId);

                        string notificationMessage = $"{studentName} has enrolled in the course \"{courseName}\".";

                        await _NotificationService.Notify("client", notificationMessage, instructorUserId);
                    }
                }
            }

            return isAdded;
        }
        private async Task<List<int>> GetPackageCourses(List<int> packageIds)
        {
            var coursesIds = await _context.CoursesPackages
             .Where(cp => packageIds.Contains(cp.PackageId))
             .Select(cp => cp.CourseId)
             .ToListAsync();

            return coursesIds;
        }
        private async Task<string> GetInstructorUserId(int? id)
        {
            return await _context.Instructors
                .Where(i => i.Id == id)
                .Select(i => i.UserId)
                .FirstAsync();
        }
        private async Task<(int? InstructorId, string CourseName)> GetCourseNameAndInstructorId(int courseId)
        {
            var result = await _context.Courses
                .Where(c => c.Id == courseId)
                .Select(c => new { c.InstructorId, c.Name })
                .FirstOrDefaultAsync();

            return (result?.InstructorId, result?.Name);
        }
        private async Task CreateStudentInstructorRoom(string studentId, string instructorId)
        {
            var chatRoom = new ClientChatRoom
            {
                Participant1Id = studentId,
                Participant2Id = instructorId,
                DateCreated = _IBaseRepository.GetJordanTime()
            };

            await _IBaseRepository.AddAsync<ClientChatRoom>(chatRoom);
        }

    }
}
