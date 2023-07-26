import React, { useContext } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
    <div>
    <span className="logo">InterL!nk</span>
    </div>
    <div className="navbar">
      <div className="user">
        <span>{currentUser.displayName}</span>
        <img src={currentUser.photoURL} alt="" />
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
    </>
  );
};

export default Navbar;
