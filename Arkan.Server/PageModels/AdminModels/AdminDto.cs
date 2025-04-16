namespace Arkan.Server.PageModels.AdminModels
{
    public class AdminDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string FirstName {  get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string? Image { get; set; }
        public List<Dictionary<string, object>> Roles { get; set; }
    }
}
