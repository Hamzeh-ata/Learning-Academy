/* eslint-disable react/no-unescaped-entities */
export const NotFoundPage = () => (
  <div className="flex items-center justify-center w-full h-screen bg-gray-100">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-xl font-semibold text-gray-600">Page Not Found</p>
      <p className="mt-4 text-gray-500">We can't find the page you're looking for.</p>
      <a
        href="/"
        className="mt-6 inline-block px-6 py-3 text-md font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600"
      >
        Go Home
      </a>
    </div>
  </div>
);
