import { useCountAnimation } from '@hooks';

export const StatisticSection = ({ label, count, iconPaths }) => {
  const animatedCount = useCountAnimation(count, 2000);

  return (
    <div className="flex flex-col items-center gap-2">
      <span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-user-heart"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#ffffff"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          {iconPaths.map((path, index) => (
            <path key={index} d={path} />
          ))}
        </svg>
      </span>
      <p className="text-2xl">{animatedCount}+</p>
      <p>{label}</p>
    </div>
  );
};
