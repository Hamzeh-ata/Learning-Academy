namespace Arkan.Server.PageModels.HomePageModels
{
    public class UpdateCompanyInfo
    {
        public int Id { get; set; }
        public string? AboutUs { get; set; }
        public IFormFile? Image { get; set; }
        public string? FacebookUrl { get; set; }
        public string? InstagramUrl { get; set; }
        public string? TikTokUrl { get; set; }
        public string? SnapchatUrl { get; set; }
        public string? Phonenumber { get; set; }
    }
}
