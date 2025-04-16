export const NavbarUserInfo = ({ userInfo }) => (
  <div className="bg-gray-900 px-4 py-4 rounded-lg bg-opacity-50">
    <div className="flex items-center">
      <div className="bg-gray-800 rounded-full w-14 h-14 border-2 border-gray-600 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-10 h-10 stroke-current text-gray-300"
          width="44"
          height="44"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#2c3e50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="12" cy="7" r="4" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
        </svg>
      </div>
      <div className="px-2 flex flex-col">
        <div className="flex items-center">
          <span className="text-gray-200 font-semibold leading-none">
            {userInfo.firstName} {userInfo.lastName}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            title="Verified"
            className="ml-2 w-6 h-6 stroke-current text-green-500"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#2c3e50"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2l4 -4" />
          </svg>
        </div>
        <span className="text-gray-400 text-sm font-semibold">{userInfo.roles.join(', ')}</span>
      </div>
    </div>
  </div>
);
