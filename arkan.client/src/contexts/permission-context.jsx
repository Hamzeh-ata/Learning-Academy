import { createContext, useContext, useState } from 'react';

const PermissionsContext = createContext();

export const usePermissions = () => useContext(PermissionsContext);

export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState({});

  const updatePermissions = (newPermissions) => {
    setPermissions(newPermissions);
  };

  const getPermissionsForPage = (pageName) => {
    const pagePermissions = permissions?.pages?.find(
      (page) => page.componentName?.toLowerCase() === pageName?.toLowerCase()
    )?.permissions[0];
    return pagePermissions || {};
  };

  return (
    <PermissionsContext.Provider value={{ permissions, updatePermissions, getPermissionsForPage }}>
      {children}
    </PermissionsContext.Provider>
  );
};
