using Arkan.Server.BaseRepository;
using Arkan.Server.Client_Interfaces;
using Arkan.Server.Client_PageModels.Chapters;
using Arkan.Server.Client_PageModels.Instrctors;
using Arkan.Server.Client_PageModels.Instructors;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.Models;
using Microsoft.EntityFrameworkCore;
using System.Drawing.Printing;

namespace Arkan.Server.Client_Repositories
{
    public class ClientInstructorRepository : IInstructors
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        public ClientInstructorRepository(ApplicationDBContext context, IBaseRepository IBaseRepository)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
        }
        public async Task<PaginationResult<GetAllInstrcutors>> GetAllInstructors(int pageNumber,int pageSize,string name)
        {
            var query = _context.Instructors
                .Include(i => i.User)
                .WhereIf(name !=null , i => i.User.FirstName.ToLower().Contains(name.Trim().ToLower()) || i.User.LastName.ToLower().Contains(name.Trim().ToLower()))
                .Select(i => new GetAllInstrcutors
                {
                    Id = i.Id,
                    FaceBook = i.Facebook,
                    Linkedin = i.LinkedIn,
                    Name = i.User.FirstName + " " + i.User.LastName,
                    Bio = i.Bio,
                    Image= i.User.ProfileImage,
                    PhoneNumber = i.User.PhoneNumber
                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;
        }
        public async Task<PaginationResult<InstructorCourses>> GetInstructorCourses(string userId, int pageNumber, int pageSize)
       {
            var instructorId = await _IBaseRepository.GetInstructorIdByUserID(userId);

            var query = _context.Courses
                .Where(c => c.InstructorId == instructorId)
                .Select(c => new InstructorCourses
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description,
                    Image = c.Image

                }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;

        }

    }
}
