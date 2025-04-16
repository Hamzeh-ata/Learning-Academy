using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class CategoriesSection : BaseModel
    {
        public int Order { get; set; }
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }
    }
}
