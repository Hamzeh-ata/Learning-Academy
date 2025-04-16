import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllQuestions } from '@services/admin-services/frequently-questions.service';
import { selectAllFrequentlyQuestions } from '@slices/admin-slices/frequently-questions.slice';

export const useFetchFrequentlyQuestions = () => {
  const dispatch = useDispatch();
  const requests = useSelector(selectAllFrequentlyQuestions);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (!requests.length && !fetchAttempted) {
      dispatch(getAllQuestions());
      setFetchAttempted(true);
    }
  }, [requests, dispatch, fetchAttempted]);

  return requests;
};
