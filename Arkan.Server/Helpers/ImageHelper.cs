using Arkan.Server.ImagesHelper;
using Arkan.Server.Models;
using Microsoft.AspNetCore.Hosting;

namespace Arkan.Server.Helpers
{
    public class ImageHelper : ImageHelperInterface
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ImageHelper(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }
        public async Task<string> AddImage(IFormFile Image,string FolderName)
        {
            string originalFileName = Path.GetFileNameWithoutExtension(Image.FileName);
            string fileExtension = Path.GetExtension(Image.FileName);
            string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
            string photoName = $"{Guid.NewGuid():N}{shortenedFileName}{fileExtension}";
            var photoRoot = Path.Combine(_webHostEnvironment.WebRootPath, "images/" + FolderName + "/", photoName);
            using (var fileStream = new FileStream(photoRoot, FileMode.Create))
            {
                Image.CopyTo(fileStream);
            }
            return $"/images/{FolderName}/{photoName}";

        } 

        public async Task <string> UpdateImage(IFormFile Image,string FolderName)
        {
            string originalFileName = Path.GetFileNameWithoutExtension(Image.FileName);
            string fileExtension = Path.GetExtension(Image.FileName);
            string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
            string photoName = $"{Guid.NewGuid():N}{shortenedFileName}{fileExtension}";
            var photoRoot = Path.Combine(_webHostEnvironment.WebRootPath, "images/" + FolderName + "/", photoName);
            using (var fileStream = new FileStream(photoRoot, FileMode.Create))
            {
                Image.CopyTo(fileStream);
            }
            return $"/images/{FolderName}/{photoName}";
        }

        public async Task DeleteImage(string Image) {

            var existingImagePath = Path.Combine(_webHostEnvironment.WebRootPath, Image.TrimStart('/'));
            if (File.Exists(existingImagePath))
            {
                File.Delete(existingImagePath);
            }
      
        }

        public async Task<string> AddMaterial(IFormFile material)
        {
            string originalFileName = Path.GetFileNameWithoutExtension(material.FileName);
            string fileExtension = Path.GetExtension(material.FileName);
            string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
            string materialName = $"{Guid.NewGuid():N}{shortenedFileName}{fileExtension}";
            var materialRoot = Path.Combine(_webHostEnvironment.WebRootPath, "lessonsMaterial/" + materialName);
            using (var fileStream = new FileStream(materialRoot, FileMode.Create))
            {
                material.CopyTo(fileStream);
            }
            return $"/lessonsMaterial/{materialName}";
        }

        public async Task DeleteMaterial(string material)
        {

            var existingMaterialPath = Path.Combine(_webHostEnvironment.WebRootPath, material.TrimStart('/'));
            if (File.Exists(existingMaterialPath))
            {
                File.Delete(existingMaterialPath);
            }

        }

        public async Task<string> AddChatFile(IFormFile chatFile)
        {
            string originalFileName = Path.GetFileNameWithoutExtension(chatFile.FileName);
            string fileExtension = Path.GetExtension(chatFile.FileName);
            string shortenedFileName = originalFileName[..Math.Min(10, originalFileName.Length)];
            string chatFileName = $"{Guid.NewGuid():N}{shortenedFileName}{fileExtension}";
            var chatFileRoot = Path.Combine(_webHostEnvironment.WebRootPath, "chatFiles/" + chatFileName);
            using (var fileStream = new FileStream(chatFileRoot, FileMode.Create))
            {
                chatFile.CopyTo(fileStream);
            }
            return $"/chatFiles/{chatFileName}";
        }

        public async Task DeleteChatFile(string chatFile)
        {
            var existingChatFilePath = Path.Combine(_webHostEnvironment.WebRootPath, chatFile.TrimStart('/'));

            if (File.Exists(existingChatFilePath))
            {
                File.Delete(existingChatFilePath);
            }
        }


    }
}
