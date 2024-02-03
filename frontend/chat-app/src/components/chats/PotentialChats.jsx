import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import '../../index.css';
import { AuthContext } from '../../context/AuthContext';

export const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div
                className="single-user"
                key={index}
                onClick={() => createChat(user._id, u._id)}
              >
                {u.name}
                <span
                  className={`${
                    onlineUsers?.some((user) => user?.userId === u?._id)
                      ? 'user-online'
                      : 'user-offline'
                  }`}
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
};
