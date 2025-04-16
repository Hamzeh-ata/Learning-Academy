namespace Arkan.Server.Models
{
    public class Lesson : BaseModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public int ChapterId { get; set; }
        public Chapter Chapter { get; set; }
        public bool IsFree { get; set; }
        public string? Material {  get; set; }
        public double? Duration {  get; set; }
        public Quiz Quiz { get; set; }
        public ICollection<StudentCompletedLessons> StudentCompletedLessons { get; set; }
    }
}
