namespace Arkan.Server.ClientMessagesModels
{
    public class StartChatModel
    {
        public string ReceiverName {  get; set; }
        public string? ReceiverImage { get; set; }
        public List<GetClientRoomMessages>? Messages { get; set; }
    }
}
