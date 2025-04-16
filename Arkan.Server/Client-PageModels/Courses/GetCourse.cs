namespace Arkan.Server.Client_PageModels.Courses
{
    public class GetCourse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int InstructorId { get; set; }
        public string? InstructorName { get; set; }
        public string? InstructorImage {  get; set; }
        public float Price { get; set; }
        public float? DiscountPrice { get; set; }
        public float? DirectPrice { get; set; }
        public string Image { get; set; }
        public int LessonsCount { get; set; }
        public string? VideoOverView {  get; set; }
        public string ImageOverView { get; set; }
        public bool EditAble {  get; set; }
        public bool IsEnroll {  get; set; }
        public bool IsPending {  get; set; }
        public bool IsInCart {  get; set; }
        public List<string>? Universities { get; set; }
        public List<string>? Categories { get; set; }
        public int EnrollmentsCount {  get; set; }
        public string Key {  get; set; }

    }
}
