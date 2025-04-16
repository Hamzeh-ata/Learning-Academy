using Microsoft.AspNetCore.SignalR;

namespace Arkan.Server
{
    public class NotificationHub : Hub
    {
        public async Task SendNotificationToUser(string userId, string message)
        {
            await Clients.User(userId).SendAsync("ReceiveNotification", message);
        }

        public async Task SubscribeToTopic(string topic)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, topic);
        }

        public async Task UnsubscribeFromTopic(string topic)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, topic);
        }

        public async Task SendUserTypingNotification(string groupId, UserTyping user)
        {
            await Clients.Group(groupId).SendAsync("UserTyping", user);
        }
    }
    public class UserTyping
    {
        public string Name { get; set; }
        public string Image { get; set; }
    }
}

