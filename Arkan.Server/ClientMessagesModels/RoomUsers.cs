namespace Arkan.Server.ClientMessagesModels
{
    public class RoomUsers
    {
        public string UserId {  get; set; }
        public string UserName {  get; set; }
        public string? ProfileImage {  get; set; }
        public bool IsMuted {  get; set; }
        public bool IsOnline { get; set; }
    }

}
