namespace Arkan.Server.PageModels.HomePageModels
{
    public class GetCategorySection
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CoursesCount { get; set; }
        public int Order { get; set; }
        public string Image {  get; set; }
        public string Key {  get; set; }
    }
}
