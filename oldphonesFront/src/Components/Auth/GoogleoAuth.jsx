import React from 'react';
import '../../StyleSheets/Googlebtn.css';
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider} from '@react-oauth/google';
export default function GoogleOAuth() {
  const navigate = useNavigate();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
  const handleLoginSuccess = (response) => {
    fetch('http://localhost:2000/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ accessToken: response.credential })
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token', data);
      navigate("/App")
    })
    .catch(error => console.error(error));
  };
  const handleLoginFailure = (error) => {
    console.error('Login failed:', error);
  }
  return (
    <div className = "login-with-google-btn">
    <GoogleOAuthProvider clientId={clientId}>
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onFailure={handleLoginFailure}
      buttonText="Login with Google"
    />
    </GoogleOAuthProvider>
    </div>
  );
}
