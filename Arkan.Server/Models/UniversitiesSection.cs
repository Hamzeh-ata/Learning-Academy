using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.Models
{
    public class UniversitiesSection : BaseModel
    {
        public int Order { get; set; }
        public int UniversityId { get; set; }
        [ForeignKey("UniversityId")]
        public University University { get; set; }

    }
}
