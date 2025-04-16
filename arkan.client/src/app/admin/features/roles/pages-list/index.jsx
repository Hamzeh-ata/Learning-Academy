import { useSelector } from 'react-redux';
import { selectPagePermissions } from '@slices/auth/auth.slice';

export const PagesList = () => {
  const pagePermissions = useSelector(selectPagePermissions);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Component Name</th>
        </tr>
      </thead>
      <tbody>
        {pagePermissions?.pages?.map((page) => (
          <tr key={page.id}>
            <td>{page.name}</td>
            <td>{page.componentName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
