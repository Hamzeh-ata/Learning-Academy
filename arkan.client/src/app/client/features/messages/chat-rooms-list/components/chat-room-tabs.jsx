import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';

export function ChatRoomTabs({ activeIndex, tabs, isTabDisabled }) {
  const activeTabClassName = classNames('border-b border-arkan text-gray-950 font-semibold');
  const [, setSearchParams] = useSearchParams();

  function handleTabClick(tab, index) {
    tab.command(index);
    setSearchParams({ tab: tabs.find((e) => e.label === tabs[index].label).label });
  }

  return (
    <div className="w-full py-4">
      <ul className="flex gap-4 w-full justify-center">
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={classNames('cursor-pointer text-gray-600 transition-all animate-delay-200 hover:text-gray-700', {
              [activeTabClassName]: activeIndex === index,
              'opacity-50 pointer-events-none': isTabDisabled(index)
            })}
          >
            <a onClick={() => handleTabClick(tab, index)}>{tab.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
