using System.ComponentModel.DataAnnotations;

namespace Arkan.Server.Models
{
    public class BaseModel
    {
        [Key]
        public int Id { get; set; }
    }
}
