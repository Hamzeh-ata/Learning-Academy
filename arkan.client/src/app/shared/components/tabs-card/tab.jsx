import './tabs-card.css';

// eslint-disable-next-line no-unused-vars
export const TabComponent = ({ title, active, children, tabTitle }) => (
  <>
    {active && (
      <div className={`card ${active ? 'active' : ''}`}>
        {title && <div className="mb-6 text-lg font-semibold text-gray-200">{title}</div>}
        {active && children}
      </div>
    )}
  </>
);
