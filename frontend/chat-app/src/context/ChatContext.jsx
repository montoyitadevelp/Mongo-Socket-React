import { createContext, useState, useEffect, useCallback } from 'react';
import { getRequest, postRequest, baseUrl } from '../utils/services';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

// eslint-disable-next-line react/prop-types
export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUsersChats] = useState(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [errorChat, setErrorChat] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [isMessageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [sendTextMessageError, setTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  //Conexion
  useEffect(() => {
    const newSocket = io('http://localhost:3000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return;

    socket.emit('addNewUser', user?._id);
    socket.on('getOnlineUsers', (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off('getOnlineUsers');
    };
  }, [socket]);

  //send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

  //Receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on('getMessage', (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on('getNotification', (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off('getMessage');
      socket.off('getNotification');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}/users`);

      if (response.error) {
        return console.log('Error fetching users', response);
      }

      const pChats = response?.filter((u) => {
        let isChatCreated = false;

        if (user?._id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });
      setPotentialChats(pChats);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setErrorChat(null);
        setLoadingChat(true);

        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);

        setLoadingChat(false);

        if (response.error) {
          return setErrorChat(response.error);
        }
        setUsersChats(response);
      }
    };
    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setMessageLoading(true);
      setMessageError(null);

      const response = await getRequest(
        `${baseUrl}/messages/${currentChat?._id}`
      );

      setMessageLoading(false);

      if (response.error) {
        return setMessageError(response);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const updatedCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}/chats`,
      JSON.stringify({
        firstId,
        secondId,
      })
    );

    if (response.error) {
      return console.log('Error creating chat', response);
    }

    setUsersChats((prev) => [...prev, response]);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return console.log('Message is empty');
      }
      const response = await postRequest(
        `${baseUrl}/messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender._id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setTextMessageError(response);
      }

      setNewMessage(response);
      setMessages((prev) => [...prev, response]);
      setTextMessage('');
    },
    []
  );

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((notification) => {
      return {
        ...notification,
        isRead: true,
      };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationsAsRead = useCallback(
    (notification, userChats, user, allNotifications) => {
      //find chat to open
      const chatToOpen = userChats.find((chat) => {
        const chatMembers = [user._id, notification.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });

      //mark notification as read
      const mNotifications = allNotifications.map((n) => {
        if (notification.senderId === n.senderId) {
          return {
            ...notification,
            isRead: true,
          };
        } else {
          return n;
        }
      });

      updatedCurrentChat(chatToOpen);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotifications, allNotifications) => {
      const mNotifications = allNotifications.map((el) => {
        let notification;

        thisUserNotifications.forEach((n) => {
          if (n.senderId === el.senderId) {
            notification = {
              ...n,
              isRead: true,
            };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotifications);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        loadingChat,
        errorChat,
        potentialChats,
        createChat,
        updatedCurrentChat,
        isMessageLoading,
        messageError,
        currentChat,
        messages,
        sendTextMessage,
        sendTextMessageError,
        newMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationsAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
