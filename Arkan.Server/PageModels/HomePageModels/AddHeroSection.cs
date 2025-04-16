using System.ComponentModel.DataAnnotations.Schema;

namespace Arkan.Server.PageModels.HomePageModels
{
    public class AddHeroSection
    {
        public string HeaderText { get; set; }
        public string Description { get; set; }
        public IFormFile Image { get; set; }
    }
}
