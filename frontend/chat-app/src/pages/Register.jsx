import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export const Register = () => {
  const { registerInfo, updatedRegisterInfo, registerUser, error, isLoading } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const token = localStorage.getItem('User');
  const convertToken = JSON.parse(token);

  useEffect(() => {
    if (convertToken?.token) {
      navigate('/');
    }
  }, [convertToken]);

  return (
    <>
      <Form onSubmit={registerUser}>
        <Row
          style={{
            height: '100vh',
            justifyContent: 'center',
            paddingTop: '10%',
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(e) =>
                  updatedRegisterInfo({
                    ...registerInfo,
                    name: e.target.value,
                  })
                }
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updatedRegisterInfo({
                    ...registerInfo,
                    email: e.target.value,
                  })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updatedRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
              <Button variant="primary" type="submit">
                {isLoading ? 'Loading...' : 'Register'}
              </Button>

              {error?.error && (
                <Alert variant="danger">
                  <p>{error?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
