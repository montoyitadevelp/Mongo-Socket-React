import { useContext } from 'react';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { Container, Stack } from 'react-bootstrap';
import '../index.css';
import { UserChat } from '../components/chats/UserChat';
import { PotentialChats } from '../components/chats/PotentialChats';
import { ChatBox } from '../components/chats/ChatBox';

export const Chats = () => {
  const { user } = useContext(AuthContext);
  const { userChats, loadingChat, updatedCurrentChat } =
    useContext(ChatContext);
 

  return (
    <Container>
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {loadingChat && <p>Loading...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div onClick={() => updatedCurrentChat(chat)} key={index}>
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <ChatBox />
        </Stack>
      )}
    </Container>
  );
};
