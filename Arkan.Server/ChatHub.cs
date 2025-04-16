using Arkan.Server.ClientMessagesModels;
using Microsoft.AspNetCore.SignalR;

namespace Arkan.Server
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string receiverId, GetAddedClientMessage message)
        {
            await Clients.User(receiverId).SendAsync("ReceiveMessage", message);
        }
    }
}
