import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, Typography } from '@mui/material';
import Layout from '../../components/Layout';
import { useUserAuth } from '../../context/userAuthContext'; // Adjust the path accordingly
import '../../styles/Login.css';

const Signup = () => {
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { googleSignInWithPopup, userState, detectMob, googleSignIn, githubSignIn, githubSignInWithPopup } = useUserAuth();

  const handleSignUp = async (e, provider) => {
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

    const email = e.target[0].value; // Get the value of the email input
    const password = e.target[1].value; // Get the value of the password input

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      setErr(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file).then(async () => {
        const downloadURL = await getDownloadURL(storageRef);

        try {
          // Update profile
          await updateProfile(res.user, {
            displayName,
            photoURL: downloadURL,
          });

          // Create user on firestore
          await setDoc(doc(db, "users", res.user.uid), {
            uid: res.user.uid,
            displayName,
            email,
            photoURL: downloadURL,
          });

          // Create empty user chats on firestore
          await setDoc(doc(db, "userChats", res.user.uid), {});

          navigate("/");
        } catch (err) {
          console.log(err);
          setErr(true);
          setLoading(false);
        }
      });
    } catch (err) {
      console.log(err);
      setErr(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userState && userState.user) { // Check if userState is defined
      navigate('/chat');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);
  

  const card = (
    <React.Fragment>
      <CardContent>
        <Typography variant='h4' color='text.secondary' gutterBottom>
          InterL!nk
        </Typography>
        <Box width='100%'>
        <div className="formContainer">
          <div className="formWrapper">
            <form onSubmit={handleSubmit}>
              <input required type="text" placeholder="username" />
              <input required type="email" placeholder="email" />
              <input required type="password" placeholder="password" />
              <input required style={{ display: "none" }} type="file" id="file" />
              <label htmlFor="file">
                <img src='' alt="" />
                <span>Add an avatar</span>
              </label>
              <button disabled={loading}>Sign up</button>
              {loading && <p className="loading-message">Hold on as we create an account for you...</p>}
              {err && <p className="error-message">Ooops... looks like something went wrong</p>}
            </form>
            <p>
              Already have an account? <Link to="/">Login</Link>
            </p>
          </div>
        </div>
          <p>or Signup with</p>

          <div className='google-btn' role={'button'} onClick={(e) => handleSignUp(e, 'google')}>
            <div className='google-icon-wrapper'>
              <img
                className='google-icon'
                src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
                alt='google'
              />
            </div>
            <p className='btn-text'>
              <b>Signup with Google</b>
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
          overflowY: 'auto',
          background: 'rgba( 255, 255, 255, 0.4 )',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          backdropFilter: 'blur( 5px )',
          WebkitBackdropFilter: 'blur( 5px )',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.18)',
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
};

export default Signup;