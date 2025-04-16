import { Tooltip } from 'primereact/tooltip';
import { FeatherIcon } from '@shared/components';
import userCover from '@assets/images/user-cover.png';
import { getImageFullPath } from '@utils/image-path';

export const InstructorHeader = ({ profile }) => (
  <>
    <div>
      <img className="w-full h-48 object-cover rounded-4xl" src={userCover} alt="user cover" />
    </div>
    <div className="flex items-center justify-center lg:justify-normal lg:absolute top-48 gap-4 w-full flex-wrap lg:flex-nowrap">
      <div>
        <img
          src={getImageFullPath(profile?.image)}
          className="rounded-full w-20 h-20 md:w-32 md:h-32 mobile:w-32 mobile:h-32 shadow drop-shadow border border-blue-grey-300"
          alt={profile?.name}
        />
      </div>
      <div className="mt-4 lg:w-[66%] space-y-2">
        <div className="font-semibold text-lg items-center flex flex-wrap gap-2 xs:justify-center">
          <h3>{profile.name}</h3>
          <div className="flex gap-2">
            {renderProfileSocialLinks(profile?.facebook, 'Facebook')}
            {renderProfileSocialLinks(profile?.twitter, 'Twitter')}
            {renderProfileSocialLinks(profile?.instagram, 'Instagram', 'purple')}
            {renderProfileSocialLinks(profile?.linkedin, 'Linkedin', 'cyan')}
          </div>
        </div>
        {profile.bio && <p className="text-blue-grey-500 line-clamp-2">{profile?.bio}</p>}
      </div>
    </div>
  </>
);

const renderProfileSocialLinks = (value, icon, color = 'blue') =>
  value &&
  icon && (
    <>
      <Tooltip target={`.social-${icon}`}>{icon}</Tooltip>
      <a target="_blank" href={value}>
        {
          <FeatherIcon
            size={24}
            className={`social-${icon} transition-transform duration-300 ease-in-out text-${color}-500 hover:text-${color}-400 hover:scale-110`}
            name={icon}
          />
        }
      </a>
    </>
  );
