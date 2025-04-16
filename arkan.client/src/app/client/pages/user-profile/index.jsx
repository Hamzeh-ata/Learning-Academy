import userCover from '@assets/images/user-cover.png';
import { useIsStudent } from '@hooks';
import { FeatherIcon, Modal, SidebarPanel } from '@shared/components';
import { selectUserProfile } from '@slices/client-slices/user-profile.slice';
import { formatDate } from '@utils/date-format';
import { getImageFullPath } from '@utils/image-path';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { UserProfileEntry, ChangePassword } from '@(client)/features/user-profile';
import './user-profile.css';

const UserProfile = () => {
  const userProfile = useSelector(selectUserProfile);
  const [userObject, setUserObject] = useState();
  const isStudent = useIsStudent();

  const [isEditMode, setIsEditMode] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const resetForm = () => {
    setUserObject(null);
    setIsEditMode(false);
    setShowChangePassword(false);
  };

  return (
    <div className="flex justify-center items-center px-4 md:px-26 xl:px-40 py-4 xl:py-8 flex-1 user-profile">
      <div className="flex flex-col bg-white rounded-4xl px-10 w-full py-6 relative gap-8 overflow-hidden xl:w-2/3">
        <div>
          <img className="w-full h-48 object-cover rounded-4xl" src={userCover} alt="user cover" />
        </div>
        <div className="flex items-center justify-center lg:justify-normal lg:absolute top-48 gap-4 w-full flex-wrap lg:flex-nowrap">
          <div>
            <img
              src={getImageFullPath(userProfile.image)}
              className="rounded-full w-20 h-20 md:w-32 md:h-32 mobile:w-32 mobile:h-32 shadow drop-shadow border border-blue-grey-300"
              alt={userProfile?.firstName}
            />
          </div>
          <div className="mt-4 lg:w-[66%] space-y-2">
            <div className="font-semibold text-lg items-center flex flex-wrap gap-2 xs:justify-center">
              <h3 className="text-center">
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <div className="flex gap-2">
                {renderProfileSocialLinks(userProfile?.facebook, 'Facebook')}
                {renderProfileSocialLinks(userProfile?.twitter, 'Twitter')}
                {renderProfileSocialLinks(userProfile?.instagram, 'Instagram', 'purple')}
                {renderProfileSocialLinks(userProfile?.linkedIn, 'Linkedin', 'cyan')}
              </div>
            </div>
            {userProfile.bio && <p className="text-blue-grey-500 line-clamp-2">{userProfile.bio}</p>}
          </div>
        </div>
        <div className="lg:mt-28 mt-2 ps-2 justify-center flex flex-col">
          <div className="flex justify-between items-center flex-wrap">
            <div>
              <h3 className="font-semibold text-lg">Personal Information</h3>
              <p className="text-blue-grey-500">Update Your Personal Information</p>
            </div>
            <div>
              <Button
                tooltip="Edit"
                onClick={() => {
                  setIsEditMode(true);
                  setUserObject(userProfile);
                }}
                className="text-cyan-700 hover:text-cyan-800"
              >
                <FeatherIcon name="Edit" />
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6  px-4 py-2">
            {renderProfileInfo('Name', `${userProfile?.firstName} ${userProfile?.lastName}`)}
            {renderProfileInfo('Email', userProfile?.email)}
            {renderProfileInfo('Phone Number', userProfile?.phoneNumber)}
            {renderProfileInfo('Gender', userProfile?.sex)}
            {isStudent && (
              <>
                {renderProfileInfo('University', userProfile?.university)}
                {renderProfileInfo('Birth Date', formatDate(userProfile?.birthDate))}
              </>
            )}
            {!isStudent && (
              <>
                {renderProfileInfo('Specialization', userProfile?.specialization)}
                {renderProfileInfo('Experience', userProfile?.experience)}
                {renderProfileInfo('Office Hours', userProfile?.officeHours)}
                {renderProfileInfo('Location', userProfile?.location)}
              </>
            )}
          </div>

          <div className="flex items-center flex-wrap mt-2 border-t py-4 gap-4">
            <h3 className="font-semibold text-base">Change Password</h3>
            <Button
              tooltip="Change Password"
              onClick={() => {
                setShowChangePassword(true);
              }}
              className="text-cyan-700 hover:text-cyan-800"
            >
              <FeatherIcon name="Lock" />
            </Button>
          </div>
        </div>
      </div>

      <SidebarPanel
        isVisible={isEditMode}
        onHide={resetForm}
        position={'right'}
        isDismissible
        title={`Edit Profile`}
        className={'user-profile'}
      >
        <UserProfileEntry user={userObject} onSubmitted={resetForm} />
      </SidebarPanel>

      <Modal isOpen={showChangePassword} onClose={resetForm}>
        <ChangePassword onSubmitted={resetForm} />
      </Modal>
    </div>
  );
};

const renderProfileInfo = (label, value) => (
  <div className="flex justify-between flex-wrap">
    <label className="font-semibold">{label}</label>
    <p>{value || '---'}</p>
  </div>
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

export default UserProfile;
