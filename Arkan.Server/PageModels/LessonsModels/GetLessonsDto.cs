namespace Arkan.Server.PageModels.LessonsModels
{
    public class GetLessonsDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string VideoUrl { get; set; }
        public bool IsFree { get; set; }
        public string Material { get; set; }

    }
}
