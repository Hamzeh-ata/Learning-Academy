namespace Arkan.Server.PageModels.HomePageModels
{
    public class UpdateHeroSection
    {
        public int Id { get; set; }
        public string HeaderText { get; set; }
        public string Description { get; set; }
        public IFormFile? Image { get; set; }
    }
}
