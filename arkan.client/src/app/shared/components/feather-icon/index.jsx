import classNames from 'classnames';
import * as feather from 'react-feather';
import './feather-icon.css';

export const FeatherIcon = ({ name, color, size, onClick, className, disabled }) => {
  const Icon = feather[name] || feather.Info;
  return (
    Icon && (
      <Icon
        className={classNames('sb-icon', className, {
          'sb-icon--clickable': Boolean(onClick),
          'sb-icon--disabled': disabled
        })}
        color={color}
        size={size}
        onClick={onClick}
      />
    )
  );
};
