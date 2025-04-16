using Arkan.Server.Enums;

namespace Arkan.Server.PageModels.CategoriesModels
{
    public class GetAddedCategory
    {
        public int Id { get; set; } 
        public string Name { get; set; }
        public string? Description { get; set; }
        public CategoryStatus Status { get; set; }
        public string Image { get; set; }
        public string Key {  get; set; }

    }
}
