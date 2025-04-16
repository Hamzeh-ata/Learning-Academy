import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getDropDownData } from '../services/shared/dropdowns.service';
import { selectDropdownItems } from '../slices/shared/dropdown.slice';
import { DROP_DOWN_TYPES } from '../constants';

export const useDropdownData = (typesToFetch) => {
  const dispatch = useDispatch();

  const fetchedRef = useRef(new Set());

  const data = {
    [DROP_DOWN_TYPES.Universities]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Universities)),
    [DROP_DOWN_TYPES.Categories]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Categories)),
    [DROP_DOWN_TYPES.Packages]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Packages)),
    [DROP_DOWN_TYPES.Instructors]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Instructors)),
    [DROP_DOWN_TYPES.Courses]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Courses)),
    [DROP_DOWN_TYPES.Students]: useSelector((state) => selectDropdownItems(state, DROP_DOWN_TYPES.Students))
  };

  useEffect(() => {
    typesToFetch.forEach((typeKey) => {
      const type = DROP_DOWN_TYPES[typeKey];
      if (!fetchedRef.current.has(type) && (!data[type] || data[type].length === 0)) {
        dispatch(getDropDownData({ type }));
        fetchedRef.current.add(type);
      }
    });
  }, [typesToFetch, dispatch]);

  return { ...keysToLowerCase(data) };
};

function keysToLowerCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map((item) => keysToLowerCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key.toLowerCase()] = keysToLowerCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}
