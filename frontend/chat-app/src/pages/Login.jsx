import { useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { Alert, Button, Form, Row, Col, Stack } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

export const Login = () => {
  const { updatedLoginInfo, loginInfo, errorLogin, isLoadingLogin, loginUser } =
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
      <Form onSubmit={loginUser}>
        <Row
          style={{
            height: '100vh',
            justifyContent: 'center',
            paddingTop: '10%',
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(e) =>
                  updatedLoginInfo({
                    ...loginInfo,
                    email: e.target.value,
                  })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updatedLoginInfo({
                    ...loginInfo,
                    password: e.target.value,
                  })
                }
              />
              {isLoadingLogin ? (
                'Loading...'
              ) : (
                <Button variant="primary" type="submit">
                  Login
                </Button>
              )}

              {errorLogin && (
                <Alert variant="danger">
                  <p>{errorLogin?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};
