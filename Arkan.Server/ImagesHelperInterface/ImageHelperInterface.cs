namespace Arkan.Server.ImagesHelper
{
    public interface ImageHelperInterface
    {
       Task<string> AddImage (IFormFile Image, string url);
       Task<string> UpdateImage(IFormFile Image, string FolderName);
       Task DeleteImage(string Image);
       Task<string> AddMaterial(IFormFile material);
       Task DeleteMaterial(string material);
       Task<string> AddChatFile(IFormFile chatFile);
       Task DeleteChatFile(string chatFile);
    }
}
