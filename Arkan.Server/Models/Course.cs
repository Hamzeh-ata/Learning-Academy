using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class Course : BaseModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public float? DirectPrice { get; set; }
        public int? EnrollmentLimit { get; set; }
        public CourseStatus Status { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public bool? IsCompleted { get; set; }
        public bool? IsFeatured { get; set; }
        public int? InstructorId { get; set; }
        public string? Image { get; set; }
        public string? VideoOverView { get; set; }
        public string? OverViewImage { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public Instructor? Instructor { get; set; }
        public ICollection<Enrollment> Enrollments { get; set; }
        public ICollection<CoursesCategories> CoursesCategories { get; set; }
        public ICollection<Chapter> Chapters { get; set; }
        public ICollection<CoursesPackages> CoursesPackages { get; set; }
        public ICollection<CoursesUnviersites> CoursesUnviersites { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? ModifiedAt { get; set; }
        public string? ModifiedBy { get; set; }

    }
}
