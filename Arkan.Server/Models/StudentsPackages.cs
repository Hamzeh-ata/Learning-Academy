namespace Arkan.Server.Models
{
    public class StudentsPackages : BaseModel
    {
        public int StudentId {  get; set; }
        public Student Student { get; set; }
        public int PackageId { get; set; }
        public Package Package { get; set; }

    }
}
