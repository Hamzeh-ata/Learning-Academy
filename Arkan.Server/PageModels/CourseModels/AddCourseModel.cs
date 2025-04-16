using Arkan.Server.Enums;
using Arkan.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.CourseModels
{
    public class AddCourseModel
    {
        [Required]
        public string Name { get; set; }
        public string? Description { get; set; }
        [Required]
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public int? EnrollmentLimit { get; set; }
        public CourseStatus Status { get; set; }
        public string? InstructorId { get; set; }
        public string? OverViewUrl {  get; set; }
        public IFormFile? CoverImage { get; set; }
        public IFormFile? Image { get; set; }
        public List<int>? CategoryIds { get; set; }
        public List<int>? UniversitiesIds { get; set; }
    }
}
