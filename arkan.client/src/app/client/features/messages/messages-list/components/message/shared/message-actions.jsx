import { FeatherIcon } from '@/app/shared/components';
import alertService from '@/services/alert/alert.service';
import { Button } from 'primereact/button';
import { useDispatch } from 'react-redux';
import { useChatRoomThunk } from '../../../../hooks/useChatRoomThunk';

export function DeleteMessage({ message }) {
  const dispatch = useDispatch();
  const { chatThunks } = useChatRoomThunk();

  const handleDelete = (id) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want to delete this Message',
      callback: () => dispatch(chatThunks.deleteMessage(id))
    });
  };

  return (
    <Button
      onClick={() => {
        handleDelete(message.id);
      }}
      className="cursor-pointer text-gray-500 hover:text-red-400 text-md"
      tooltip="Delete message"
      tooltipOptions={{
        position: 'left'
      }}
    >
      <FeatherIcon name="XCircle" size={16} />
    </Button>
  );
}

export function ReplyMessage({ message, onReply }) {
  return (
    <div className="hidden group-hover:flex">
      <Button className="cursor-pointer text-gray-500 hover:text-arkan text-md" onClick={() => onReply(message)}>
        <FeatherIcon name="CornerUpLeft" size={16} />
      </Button>
    </div>
  );
}
