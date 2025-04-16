using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.ProfileModels;
using Arkan.Server.RoleServices;
using Microsoft.AspNetCore.Identity;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class ProfileRepository : IProfileInterFace
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IRoles _IRoles;

        public ProfileRepository(ApplicationDBContext context
            , IBaseRepository IBaseRepository
            , ImageHelperInterface ImageHelper
            , UserManager<ApplicationUser> userManager 
            , IRoles IRoles
            )
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
            _userManager = userManager;
            _IRoles = IRoles;
        }

        public async Task<GetAdminProfileInfo> GetAdminProfileInfo(string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user is null)
            {
                return new GetAdminProfileInfo
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            return new GetAdminProfileInfo
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Image = user.ProfileImage,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetUserProfileInfo> GetUserProfileInfo(string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user is null)
            {
                return new GetUserProfileInfo
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            var userRole = await _IRoles.FindUserRole(UserId);

            if (userRole is null || (userRole != Roles.Student.ToString() && userRole != Roles.Instructor.ToString()))
            {
                return new GetUserProfileInfo
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }


            if (userRole == Roles.Student.ToString())
            {
                var student = await GetStudentByUserID(UserId);

                if (student is null)
                {
                    return new GetUserProfileInfo
                    {
                        Key = ResponseKeys.UserNotFound.ToString()
                    };
                }
                return new GetUserProfileInfo
                {
                    UserId = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Image = user.ProfileImage,
                    BirthDate = student.BirthDate,
                    Sex = student.Sex,
                    University = student.University,
                    Key = ResponseKeys.Success.ToString()
                };

            }

            var instructor = await GetInstructorByUserID(UserId);

            return new GetUserProfileInfo
            {
                UserId = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Image = user.ProfileImage,
                Sex = instructor.Sex,
                Bio = instructor.Bio,
                Location = instructor.Location,
                LinkedIn = instructor.LinkedIn,
                Facebook = instructor.Facebook,
                Twitter = instructor.Twitter,
                Instagram = instructor.Instagram,
                OfficeHours = instructor.OfficeHours,
                Specialization = instructor.Specialization,
                Experience = instructor.Experience,
                ShowStudentsCount = instructor.showStudentsCount,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetAdminProfileInfo> UpdateAdminProfileInfo(UpdateAdminProfileInfo model, string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user is null)
            {
                return new GetAdminProfileInfo
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }


            user.FirstName = model.FirstName;
            user.LastName = model.LastName;
            user.PhoneNumber = model.PhoneNumber;
            user.NormalizedUserName = model.Email.ToUpper();
            user.NormalizedEmail = model.Email.ToUpper();
            user.Email = model.Email;

            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(user.ProfileImage))
                {
                    await _ImageHelper.DeleteImage(user.ProfileImage);
                }
                user.ProfileImage = await _ImageHelper.AddImage(model.Image, ImagesFiles.admins.ToString());
            }

            if (model.Image == null)
            {
                if (!string.IsNullOrEmpty(user.ProfileImage))
                {
                    await _ImageHelper.DeleteImage(user.ProfileImage);
                }
                user.ProfileImage = null;
            }


            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                return new GetAdminProfileInfo { Key = ResponseKeys.Failed.ToString() };
            }

            return new GetAdminProfileInfo
            {
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Image = user.ProfileImage,
                Key = ResponseKeys.Success.ToString()
            };
        }
        public async Task<GetUserProfileInfo> UpdateUserProfileInfo(UpdateUserProfileInfo model, string UserId)
        {
            var user = await _userManager.FindByIdAsync(UserId);

            if (user is null)
            {
                return new GetUserProfileInfo
                {
                    Key = ResponseKeys.UserNotFound.ToString()
                };
            }

            if (model.Email is null)
            {
                return new GetUserProfileInfo { Key = ResponseKeys.EmptyEmail.ToString() };
            }

            var userByEmail = await _userManager.FindByEmailAsync(model.Email);

            if (userByEmail != null && userByEmail.Id != user.Id)
            {
                return new GetUserProfileInfo { Key = ResponseKeys.EmailExists.ToString() };
            }

            if (model.FirstName is null)
            {
                return new GetUserProfileInfo { Key = ResponseKeys.EmptyFirstName.ToString() };
            }
            if (model.LastName is null)
            {
                return new GetUserProfileInfo { Key = ResponseKeys.EmptyLastName.ToString() };
            }
            if (model.PhoneNumber is null)
            {
                return new GetUserProfileInfo { Key = ResponseKeys.EmptyPhone.ToString() };
            }

            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    var userRole = await _IRoles.FindUserRole(UserId);

                    if (userRole is null || (userRole != Roles.Student.ToString() && userRole != Roles.Instructor.ToString()))
                    {
                        return new GetUserProfileInfo
                        {
                            Key = ResponseKeys.UserNotFound.ToString()
                        };
                    }

                    user.Email = model.Email;
                    user.FirstName = model.FirstName;
                    user.LastName = model.LastName;
                    user.PhoneNumber = model.PhoneNumber;
                    user.UserName = model.Email;
                    user.NormalizedUserName = model.Email.ToUpper();
                    user.NormalizedEmail = model.Email.ToUpper();

                    if (model.Image != null && !(model.Image is string))
                    {
                        if (!string.IsNullOrEmpty(user.ProfileImage))
                        {
                            await _ImageHelper.DeleteImage(user.ProfileImage);
                        }

                        if (userRole == Roles.Student.ToString())
                        {
                            user.ProfileImage = await _ImageHelper.AddImage(model.Image, ImagesFiles.students.ToString());
                        }
                        else if (userRole == Roles.Instructor.ToString())
                        {
                            user.ProfileImage = await _ImageHelper.AddImage(model.Image, ImagesFiles.instructors.ToString());
                        }

                    }

                    if (userRole == Roles.Student.ToString())
                    {
                        var student = await GetStudentByUserID(UserId);

                        if (student is null)
                        {
                            return new GetUserProfileInfo
                            {
                                Key = ResponseKeys.UserNotFound.ToString()
                            };
                        }

                        student.BirthDate = model.BirthDate;
                        student.Sex = model.Sex;
                        student.University = model.University?.Trim();

                        await _userManager.UpdateAsync(user);

                        _IBaseRepository.Update(student);

                        await transaction.CommitAsync();

                        return new GetUserProfileInfo
                        {
                            UserId = user.Id,
                            Email = user.Email,
                            FirstName = user.FirstName,
                            LastName = user.LastName,
                            PhoneNumber = user.PhoneNumber,
                            Image = user.ProfileImage,
                            BirthDate = student.BirthDate,
                            Sex = student.Sex,
                            University = student.University,
                            Key = ResponseKeys.Success.ToString()
                        };

                    }

                    var instructor = await GetInstructorByUserID(UserId);

                    instructor.Sex = model.Sex;
                    instructor.Bio = model.Bio.Trim();
                    instructor.Location = model.Location?.Trim();
                    instructor.LinkedIn = model.LinkedIn?.Trim();
                    instructor.Facebook = model.Facebook?.Trim();
                    instructor.Twitter = model.Twitter?.Trim();
                    instructor.Instagram = model.Instagram?.Trim();
                    instructor.OfficeHours = model.OfficeHours?.Trim();
                    instructor.Specialization = model.Specialization?.Trim();
                    instructor.Experience = model.Experience?.Trim();
                    instructor.showStudentsCount = model.ShowStudentsCount;

                    await _userManager.UpdateAsync(user);

                    _IBaseRepository.Update(instructor);

                    await transaction.CommitAsync();

                    return new GetUserProfileInfo
                    {
                        UserId = user.Id,
                        Email = user.Email,
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        PhoneNumber = user.PhoneNumber,
                        Image = user.ProfileImage,
                        Sex = instructor.Sex,
                        Bio = instructor.Bio,
                        Location = instructor.Location,
                        LinkedIn = instructor.LinkedIn,
                        Facebook = instructor.Facebook,
                        Twitter = instructor.Twitter,
                        Instagram = instructor.Instagram,
                        OfficeHours = instructor.OfficeHours,
                        Specialization = instructor.Specialization,
                        Experience = instructor.Experience,
                        ShowStudentsCount = instructor.showStudentsCount,
                        Key = ResponseKeys.Success.ToString()
                    };


                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();

                    return new GetUserProfileInfo
                    {
                        Key = "An error occurred while updating student information: " + ex.Message
                    };
                }
            }

        }
        private async Task<Student> GetStudentByUserID(string userId)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.UserId == userId);
            return student;
        }
        private async Task<Instructor> GetInstructorByUserID(string userId)
        {
            var Instructor = await _context.Instructors.FirstOrDefaultAsync(s => s.UserId == userId);
            return Instructor;
        }
    }
}
