import { ReceivedMessage } from './received-message';
import { SentMessage } from './sent-message';
import { MessageDeleted } from './shared/message-deleted';

export function Message({ message, type, onReply, getParentMessage, onScrollTo }) {
  if (message.isDeleted) {
    return <MessageDeleted message={message} />;
  }

  if (type === 'received') {
    return (
      <ReceivedMessage
        message={message}
        onReply={onReply}
        getParentMessage={getParentMessage}
        onScrollTo={onScrollTo}
      />
    );
  }

  return <SentMessage message={message} getParentMessage={getParentMessage} onScrollTo={onScrollTo} />;
}
