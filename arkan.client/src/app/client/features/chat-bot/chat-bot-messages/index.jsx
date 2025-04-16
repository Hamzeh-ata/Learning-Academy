import { ImagePreview, ShowMore } from '@/app/shared/components';
import classNames from 'classnames';

export function ChatBotMessages({ message, type }) {
  const messageClassNames = classNames('flex gap-2  p-2 animate-delay-300 group', {
    'justify-start animate-fade-right': type === 'bot',
    'justify-end animate-fade-left': type !== 'bot'
  });
  return (
    <div className={messageClassNames}>
      <div className="text-md bg-white py-2 px-4 rounded-2xl max-w-[80%] break-words drop-shadow-md hover:drop-shadow-xl">
        {message.file && (
          <ImagePreview
            src={message.file}
            className="max-h-52 object-cover rounded-2xl shadow-sm animate-delay-200 animate-fade-down"
          />
        )}
        <p>
          <ShowMore>{message.content}</ShowMore>
        </p>
      </div>
    </div>
  );
}
