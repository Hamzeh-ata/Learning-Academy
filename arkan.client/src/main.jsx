import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.jsx';
import { ErrorBoundary } from './app/public/pages/error-boundary/index';
import './i18n/i18n';
import './index.css';
import store from './store.js';
import 'primereact/resources/themes/mira/theme.css';
import SplashScreen from './app/public/pages/splash-screen/index.jsx';

const Root = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Provider store={store}>
          <PrimeReactProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
            </BrowserRouter>
          </PrimeReactProvider>
        </Provider>
      </Suspense>
    </ErrorBoundary>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
