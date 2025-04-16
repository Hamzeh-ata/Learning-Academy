using Arkan.Server.Enums;
using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.PageModels.CategoriesModels
{
    public class GetCategories
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public int CoursesCount { get; set; }
        public CategoryStatus Status { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
    }
}
