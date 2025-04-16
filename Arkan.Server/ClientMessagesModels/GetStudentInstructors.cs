namespace Arkan.Server.ClientMessagesModels
{
    public class GetStudentInstructors
    {
        public string UserId { get; set; }
        public int? InstructorId { get; set; }
        public string Name {  get; set; }
        public string Image { get; set; }

    }
}
