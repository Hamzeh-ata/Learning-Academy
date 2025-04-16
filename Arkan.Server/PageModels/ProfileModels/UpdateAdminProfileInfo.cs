namespace Arkan.Server.PageModels.ProfileModels
{
    public class UpdateAdminProfileInfo
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? PhoneNumber { get; set; }
        public string Email { get; set; }
        public IFormFile? Image { get; set; }
    }
}
