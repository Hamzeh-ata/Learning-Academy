import { useState } from 'react';
import parse from 'html-react-parser';
import { Button } from 'primereact/button';

export const ShowMore = ({ children, maxLength = 250 }) => {
  const text = children;
  const [isReadMore, setIsReadMore] = useState(true);

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      {text && text.length > maxLength && (
        <>
          {isReadMore ? parse(text.slice(0, maxLength)) : parse(text)}
          <Button className="flex mt-2 text-green-600 hover:text-green-800" onClick={toggleReadMore}>
            {isReadMore ? 'show more...' : 'show less'}
          </Button>
        </>
      )}
      {text && text.length < maxLength && parse(text)}
    </>
  );
};
