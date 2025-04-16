import { useSelector, useDispatch } from 'react-redux';
import { selectLoading } from '@/slices/admin-slices/catalog-management-slices/category.slice';
import { Loader } from '@shared/components';
import alertService from '@services/alert/alert.service';
import { deleteCategory } from '@/services/admin-services/catalog-management-services/category.service';
import { CategoryStatus } from '../components/category-status';
import { CategoryDescription } from '../components/category-description';
import { CategoryTitle } from '../components/category-title';
import { CategoryActions } from '../components/category-actions';

export const CategoriesList = ({ setSelectedCategory, viewCategoryCourses, categories }) => {
  const isLoading = useSelector(selectLoading);
  const dispatch = useDispatch();

  const handleDelete = (category) => {
    alertService.showConfirmation({
      title: 'Confirm Delete',
      body: 'Are you sure you want delete this category',
      callback: () => dispatch(deleteCategory(category))
    });
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {isLoading && categories.length === 0 && (
          <tr>
            <td colSpan="4" className="text-center p-10 h-28">
              <Loader />
            </td>
          </tr>
        )}
        {!isLoading &&
          categories.length !== 0 &&
          categories?.map((category) => (
            <tr key={category.id}>
              <td>
                <CategoryTitle title={category.name} image={category.image} id={category.id} />
              </td>
              <td className="text-center">
                <CategoryStatus id={category.id} status={category.status} />
              </td>
              <td>
                <CategoryDescription id={category.id} description={category.description} />
              </td>
              <td>
                <CategoryActions
                  viewCategoryCourses={viewCategoryCourses}
                  setSelectedCategory={setSelectedCategory}
                  handleDelete={handleDelete}
                  category={category}
                  coursesCount={category.coursesCount}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
