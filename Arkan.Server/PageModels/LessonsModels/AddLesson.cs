using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.LessonsModels
{
    public class AddLesson
    {
        [Required]
        public int ChapterId {  get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public IFormFile? Material {  get; set; }
        public bool IsFree { get; set; }


    }
}
