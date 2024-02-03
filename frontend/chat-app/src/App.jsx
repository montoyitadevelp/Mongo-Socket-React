import { Routes, Route, Navigate } from 'react-router-dom';
import { Chats } from './pages/Chat';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './components/Navbar';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import { ChatContextProvider } from './context/ChatContext.jsx';
import { RequireAuth } from './utils/auth/RequireAuth.jsx';

function App() {
  const { user } = useContext(AuthContext);


  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          {/*Public Routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/*Private Routes */}
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Chats />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
}

export default App;
