import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import { useClickAway } from '@uidotdev/usehooks';
import { getDateAgo } from '@utils/date-format';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { MessageBody, MessageUser, ReplyMessage, MessageReaction, ReactionsDisplay } from './shared';

export function ReceivedMessage({ message, onReply, getParentMessage, onScrollTo }) {
  const [showReactions, setShowReactions] = useState(false);
  const userProfile = useSelector(selectUserProfile);

  const ref = useClickAway(() => {
    setShowReactions(false);
  });

  const hideAddEmoji = message.reactions?.some((reaction) => reaction.userId === userProfile.userId);
  return (
    <div
      className="flex gap-2 justify-end p-2 animate-fade-right animate-delay-300 group flex-row-reverse"
      ref={ref}
      id={message.id}
    >
      <ReplyMessage message={message} onReply={onReply} />

      <div className="self-end flex gap-2 items-center relative">
        <ReactionsDisplay reactions={message.reactions} messageId={message.id} />
        {!hideAddEmoji && (
          <MessageReaction message={message} showReactions={showReactions} setShowReactions={setShowReactions} />
        )}

        <span className="text-md text-gray-500 self-end">{getDateAgo(message.timestamp) || '12:00 AM'}</span>
      </div>

      <MessageBody
        message={message}
        onScrollTo={onScrollTo}
        getParentMessage={getParentMessage}
        className={'rounded-bl-none'}
      />

      <MessageUser message={message} />
    </div>
  );
}
