namespace Arkan.Server.PageModels.PackageModels
{
    public class AddStudentPackagesDto
    {
        public string UserId { get; set; }
        public List<int> PackagesId { get; set; }    
    }
}
