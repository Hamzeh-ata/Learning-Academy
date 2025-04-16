using Arkan.Server.BaseRepository;
using Arkan.Server.Data;
using Arkan.Server.Enums;
using Arkan.Server.Helpers;
using Arkan.Server.ImagesHelper;
using Arkan.Server.Interfaces;
using Arkan.Server.Models;
using Arkan.Server.PageModels.UnviersitesModels;
using Microsoft.EntityFrameworkCore;

namespace Arkan.Server.Repository
{
    public class UniversityRepository : IUniversityInterFace
    {
        private readonly ApplicationDBContext _context;
        private readonly IBaseRepository _IBaseRepository;
        private readonly ImageHelperInterface _ImageHelper;
        public UniversityRepository(ApplicationDBContext context, IBaseRepository IBaseRepository, ImageHelperInterface ImageHelper)
        {
            _context = context;
            _IBaseRepository = IBaseRepository;
            _ImageHelper = ImageHelper;
        }
        public async Task<GetAddedUnviersity> AddUniversity(AddUnvierstyDto model)
        {
            var isNameExists = await _context.Unviersites.AnyAsync(University => University.Name == model.Name);
            if (isNameExists)
            {
                return new GetAddedUnviersity
                {
                    Key = ResponseKeys.NameExists.ToString()
                };
            }

            var university = new University
            {
                Name = model.Name.Trim(),
                ShortName = model.ShortName.Trim()
            };

            if (model.Image != null)
            {
                var imageTask = await _ImageHelper.AddImage(model.Image, ImagesFiles.unviersites.ToString());
                university.Image = imageTask;
            }

            await _IBaseRepository.AddAsync(university);

            var addedUniversity = await _IBaseRepository.FindByIdAsync<University>(university.Id);

            return new GetAddedUnviersity
            {
                Id = addedUniversity.Id,
                Name = addedUniversity.Name,
                ShortName = addedUniversity.ShortName,
                Image = addedUniversity.Image,
                Key = ResponseKeys.Success.ToString(),
            };

        }

        public async Task<GetUpdatedUnviersty> UpdateUniversity(UpdateUnvierstyDto model)
        {
            var isNameExists = await _context.Unviersites.AnyAsync(University => University.Name == model.Name && University.Id != model.Id);

            if (isNameExists)
            {
                return new GetUpdatedUnviersty
                {
                    Key = ResponseKeys.NameExists.ToString()
                };
            }


            var university = await _IBaseRepository.FindByIdAsync<University>(model.Id);

            if (university is null)
            {
                return new GetUpdatedUnviersty
                {
                    Key = ResponseKeys.UnvierstyNotFound.ToString()
                };
            }


            if (model.Image != null && !(model.Image is string))
            {
                if (!string.IsNullOrEmpty(university.Image))
                {
                    await _ImageHelper.DeleteImage(university.Image);
                }

                university.Image = await _ImageHelper.AddImage(model.Image, ImagesFiles.unviersites.ToString());
            }

            university.Name = model.Name.Trim();

            university.ShortName = model.ShortName.Trim();

            var isUpdated = _IBaseRepository.Update(university);

            if (!isUpdated)
            {

                return new GetUpdatedUnviersty
                {
                    Key = ResponseKeys.Failed.ToString()
                };

            }

            return new GetUpdatedUnviersty
            {
                Id = university.Id,
                Name = university.Name,
                ShortName = university.ShortName,
                Image = university.Image,
                Key = ResponseKeys.Success.ToString(),
            };

        }

        public async Task<string> RemoveUniversity(int universityId)
        {
            var universityExists = await _IBaseRepository.AnyByIdAsync<University>(universityId);

            if (!universityExists)
            {
                return ResponseKeys.PackageNotFound.ToString();
            }

            var university = await _IBaseRepository.FindByIdAsync<University>(universityId);

            _IBaseRepository.Remove(university);

            if (!string.IsNullOrEmpty(university.Image))
            {
                await _ImageHelper.DeleteImage(university.Image);
            }
            return ResponseKeys.Success.ToString();
        }

        public async Task<PaginationResult<GetUnviersties>> GetUniversities(int pageNumber, int pageSize)
        {
            var query = _context.Unviersites
            .Select(University => new GetUnviersties
            {
                Id = University.Id,
                Image = University.Image,
                Name = University.Name,
                ShortName = University.ShortName,
                CoursesCount = University.CoursesUnviersites.Count(),
            }).AsQueryable();

            var paginationResult = await PaginationHelper.PaginateAsync(query, pageNumber, pageSize);

            return paginationResult;

        }

        public async Task<GetUnviersty> GetUniversity(int universityId)
        {

            var isUniversityExists = await _IBaseRepository.AnyByIdAsync<University>(universityId);

            if (!isUniversityExists)
            {
                return new GetUnviersty
                {
                    Key = ResponseKeys.UnvierstyNotFound.ToString()
                };
            }

            var university = await _IBaseRepository.FindByIdAsync<University>(universityId);

            return new GetUnviersty
            {
                Id = university.Id,
                Name = university.Name,
                ShortName = university.ShortName,
                Image = university.Image,
                Key = ResponseKeys.Success.ToString(),
            };

        }

    }
}
