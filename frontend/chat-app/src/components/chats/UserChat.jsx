import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import { Stack } from 'react-bootstrap';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotifications } from '../../utils/unreadNotifications';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
import Avatar from '../../assets/profile.svg';
import moment from 'moment';
import '../../index.css';

export const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationAsRead } =
    useContext(ChatContext);
  const { latestMessage } = useFetchLatestMessage(chat);

  const unReadNotifications = unreadNotifications(notifications);

  const thisUserNotifications = unReadNotifications?.filter(
    (notification) => notification.senderId === recipientUser?._id
  );

  const isOnline = onlineUsers.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncatedText = (text) => {
    let shortText = text?.substring(0, 20);

    if (text?.length > 20) {
      return `${shortText}...`;
    }

    return shortText;
  };

  return (
    <>
      <Stack
        direction="horizontal"
        gap={4}
        className="user-card align-items-center p-2 justify-content-between"
        role="button"
        onClick={() => {
          if (thisUserNotifications?.length !== 0) {
            markThisUserNotificationAsRead(
              thisUserNotifications,
              notifications
            );
          }
        }}
      >
        <div className="d-flex">
          <div
            style={{ display: 'flex', alignItems: 'center' }}
            className="me-2"
          >
            <img src={Avatar} alt="Avatar image user" height="35px" />
          </div>
          <div style={{ color: 'black' }} className="text-content">
            <div className="name">{recipientUser?.name}</div>
            <div className="text">
              {latestMessage?.text ? (
                <span>{truncatedText(latestMessage?.text)}</span>
              ) : (
                'No messages yet'
              )}{' '}
            </div>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end">
          <div className="date">
            {moment(latestMessage?.createdAt).calendar()}
          </div>
          <div
            className={
              thisUserNotifications?.length > 0 ? 'this-user-notifications' : ''
            }
          >
            {thisUserNotifications?.length > 0
              ? thisUserNotifications?.length
              : ''}
          </div>
          <span
            className={`${isOnline ? 'user-online' : 'user-offline'} `}
          ></span>
        </div>
      </Stack>
    </>
  );
};
