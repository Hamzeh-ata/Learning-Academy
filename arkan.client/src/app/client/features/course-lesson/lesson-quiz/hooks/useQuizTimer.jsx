import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { startQuizAttempt } from '@services/client-services/student-quiz.service';

export const useQuizTimer = (quizStarted, initialTime, lessonId, setQuizStarted, cancelQuizAction) => {
  const dispatch = useDispatch();
  const [timeLimit, setTimeLimit] = useState(initialTime);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (quizStarted) {
      intervalIdRef.current = setInterval(() => {
        setTimeLimit((currentLimit) => {
          if (currentLimit <= 1) {
            clearInterval(intervalIdRef.current);
            setQuizStarted(false);
            return 0;
          }
          return currentLimit - 1;
        });
      }, 1000);
    } else {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    }

    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [quizStarted, timeLimit]);

  const handleStartQuiz = () => {
    dispatch(startQuizAttempt(lessonId));
    setQuizStarted(true);
  };

  const handleCancelQuiz = () => {
    cancelQuizAction();
  };

  return { timeLimit, handleStartQuiz, handleCancelQuiz };
};
