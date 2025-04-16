import { getImageFullPath } from '@utils/image-path';

export function MessageUser({ message }) {
  return (
    <div className="flex items-end">
      <img
        src={getImageFullPath(message.senderProfileImage)}
        alt={message.senderName}
        className="w-8 h-8 rounded-full p-0.5 shadow-md"
      />
    </div>
  );
}
