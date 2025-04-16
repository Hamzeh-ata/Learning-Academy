namespace Arkan.Server.PageModels.PackageModels
{
    public class RemoveStudentPackagesDto
    {
        public string UserId { get; set; }
        public List<int> PackagesId { get; set; }
    }
}
