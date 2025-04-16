import { statusClasses } from '@/app/shared/constants';

export const CourseStatus = ({ status }) => <span className={`${statusClasses[status]}`}>{status}</span>;
