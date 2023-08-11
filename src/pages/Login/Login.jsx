import { Box, Card, CardContent, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/Layout';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useUserAuth } from '../../context/userAuthContext';
import '../../styles/Login.css';

export default function Login() {
  const { googleSignInWithPopup, user, detectMob, googleSignIn, githubSignIn, githubSignInWithPopup } =
    useUserAuth();

  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")
    } catch (err) {
      setErr(true);
    }
  };

  const handleSignIn = async (e, provider) => {
    e.preventDefault();
    try {
      switch (provider) {
        case 'google':
          await detectMob() ? googleSignIn() : googleSignInWithPopup();
          navigate('/chat');
          break;

        case 'github':
          await detectMob() ? githubSignIn() : githubSignInWithPopup();
          navigate('/chat');
          break;

        default:
          break;
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/chat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant='h4' color='text.secondary' gutterBottom>
          InterL!nk
        </Typography>
        <Box width='100%'>
          <div>
            <div>
              <span>login</span>
              <form onSubmit={handleSubmit}>
                <input type="email" />
                <input type="password"/>
                <button>Signin</button>
                {err && <span>Something went wrong</span>}
              </form>
              <p>You don't have an account?<Link to='./Signup'>Signup</Link></p>
            </div>
          </div>
          <p>or Login with</p>
          <div className='google-btn' role={'button'} onClick={(e) => handleSignIn(e, 'google')}>
            <div className='google-icon-wrapper'>
              <img
                className='google-icon'
                src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
                alt='google'
              />
            </div>
            <p className='btn-text'>
              <b>Login with Google</b>
            </p>
          </div>
        </Box>
      </CardContent>
    </React.Fragment>
  );
  return (
    <Layout sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box
        sx={{
          padding: '16px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          inset: '0px',
          maxWidth: '480px',
          // height: '100%',
          overflowY: 'auto',
          // margin: '50px auto 0',
          background: 'rgba( 255, 255, 255, 0.4 )',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur( 5px )',
          WebkitBackdropFilter: 'blur( 5px )',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          // marginBottom: '10px',
          width: '100%',

          margin: 'auto',
        }}
      >
        <Card variant='elevation' sx={{ width: '100%' }}>
          {card}
        </Card>
      </Box>
    </Layout>
  );
}
