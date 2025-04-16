import { FeatherIcon } from '@/app/shared/components';
import { selectUserProfile } from '@/slices/client-slices/user-profile.slice';
import EmojiPicker from 'emoji-picker-react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'primereact/tooltip';
import { useChatRoomThunk } from '../../../../hooks/useChatRoomThunk';

function groupReactions(reactions) {
  const groupedReactions = reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = { ...reaction, count: 0 };
    }
    acc[reaction.emoji].count += 1;
    return acc;
  }, {});
  return Object.values(groupedReactions);
}

export function ReactionsDisplay({ reactions, messageId }) {
  const userProfile = useSelector(selectUserProfile);
  const dispatch = useDispatch();
  const { chatThunks } = useChatRoomThunk();

  if (!reactions?.length) {
    return null;
  }

  const groupedReactions = groupReactions(reactions);

  const handleReactionClick = (reaction) => {
    if (userProfile.userId === reaction.userId) {
      dispatch(chatThunks.deleteReaction(reaction.id));
    } else {
      dispatch(chatThunks.addReaction({ messageId, emoji: reaction.emoji }));
    }
  };

  return (
    <div className="flex items-center space-x-1 self-end bg-white/10 rounded-full">
      {groupedReactions.map((reaction, index) => (
        <div
          key={index}
          className="flex items-end hover:scale-110 transition-transform cursor-pointer"
          onClick={() => handleReactionClick(reaction)}
        >
          <Tooltip target={`.reaction-${reaction.id}`}>
            <div className="flex text-left max-w-48">{reaction.userName}</div>
          </Tooltip>
          <span className={`text-md reaction-${reaction.id}`}>{reaction.emoji}</span>
          <span className="text-xs text-gray-600 font-semibold">{reaction.count}</span>
        </div>
      ))}
    </div>
  );
}

export function MessageReaction({ message, showReactions, setShowReactions }) {
  const dispatch = useDispatch();
  const { chatThunks } = useChatRoomThunk();

  function handleAddReaction(message) {
    dispatch(chatThunks.addReaction(message));
  }

  return (
    <>
      <p
        className="cursor-pointer text-gray-500 hover:text-black text-md"
        onClick={() => setShowReactions(!showReactions)}
      >
        <FeatherIcon name="Smile" size={16} />
      </p>
      {showReactions && (
        <div className="absolute bottom-0 left-4 z-10">
          <EmojiPicker
            reactionsDefaultOpen={true}
            allowExpandReactions={false}
            onReactionClick={(e) => {
              handleAddReaction({ messageId: message.id, emoji: e.emoji });
              setShowReactions(false);
            }}
          />
        </div>
      )}
    </>
  );
}
