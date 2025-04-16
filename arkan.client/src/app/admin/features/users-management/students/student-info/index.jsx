import { getImageFullPath } from '@utils/image-path';

export const StudentInfo = ({ student }) => {
  if (!student?.firstName) {
    return null;
  }
  return (
    <div className="text-white flex flex-col ">
      <div className="flex items-center gap-10 flex-col">
        {student && (
          <img
            className="rounded-xl shadow-xl w-24 h-24 object-fill"
            src={getImageFullPath(student.image)}
            alt="Student"
          />
        )}
        <div className="">
          <p className="w-fit break-all text-lg p-4">
            <strong className="underline">First Name:</strong> {student.firstName}
          </p>
          <p className="w-fit break-all text-lg p-4">
            <strong>Last Name: </strong>
            {student.lastName}
          </p>
          <p className="w-fit break-all text-lg p-4">
            <strong>Email:</strong> {student.email}
          </p>
          <p className="w-fit break-all text-lg p-4">
            <strong>Phone Number:</strong> {student.phoneNumber}
          </p>
          <p className="w-fit break-all text-lg p-4">
            <strong>Birth Date:</strong> {new Date(student.birthDate).toISOString().split('T')[0]}
          </p>

          <p className="w-fit break-all text-lg p-4">
            <strong>Gender:</strong> {student.sex}
          </p>
          <p className="w-fit break-all text-lg p-4">
            <strong>University:</strong> {student.university}
          </p>
        </div>
      </div>
    </div>
  );
};
