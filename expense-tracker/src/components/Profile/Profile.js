import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import {  collection, getDocs, query, where, doc, setDoc } from 'firebase/firestore';
import { db } from '../Signup/Config';
import './Profile.css'; 
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [fullname, setFullName] = useState('');
  const [photourl, setPhotoUrl] = useState('');
  const navigate =useNavigate()
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userCollection = collection(db, "userData");
        const q = query(userCollection, where("uid", "==", user.uid)); 
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          setFullName(data.fullName || '');
          setPhotoUrl(data.photoUrl || '');
        });
      }
    };

    fetchUserData();
  }, [user]); 

  const submitProfile = async () => {
    try {
      const userDocRef = doc(db, "userData", user.uid); 
      await setDoc(userDocRef, {
        uid: user.uid, 
        fullName: fullname,
        photoUrl: photourl
      }, { merge: true });
      console.log(fullname);
      console.log(photourl);
      navigate('/home')
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="profile-container">
      <h1>User Profile</h1>
      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="fullname">Full Name</label>
          <input
            id="fullname"
            type="text"
            value={fullname}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="photourl">Photo URL</label>
          <input
            id="photourl"
            type="text"
            value={photourl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            placeholder="Photo URL"
          />
        </div>
      </div>
      <div className="button-group">
        <button className="update-button" onClick={submitProfile}>Update</button>
        <button className="cancel-button">Cancel</button>
      </div>
    </div>
  );
};

export default UserProfile;
