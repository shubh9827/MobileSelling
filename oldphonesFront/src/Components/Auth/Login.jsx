import React, {useState} from 'react'
import '../../StyleSheets/SignUp.css';
import { Link, useNavigate } from "react-router-dom";
import Alert from '../Helpers/Alert';
import axios from 'axios';
import GoogleOAuth from './GoogleoAuth';
export default function Login(props) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      email : '',
      password : ''
    });
  const [errors, setErrors] = useState('');
  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name] : event.target.value,
    });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
    } else {
        setErrors(validationErrors);
        return
    }
    const dataToSend = JSON.stringify(formData);
    try {
      const response = await axios.post('http://localhost:2000/login', dataToSend, {
        headers: { 'Content-Type': 'application/json' },
      });
      localStorage.setItem("token", response.data.token);
      navigate("/App");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setErrors((errors)=>({
          ...errors,
          validationError: err.response.data.error
        }));
        
        props.showAlert(errors.validationError, "warning")
      } else {
        setErrors((errors)=>({
          ...errors,
          unknown : "An error occurred. Please try again later."}));
        props.showAlert(errors.unknown, "danger")
      }
    }
  };
  const validateForm = (data) => {
    let errors = {};
    if (!data.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Email is invalid';
    }
    if (!data.password.trim()) {
        errors.password = 'Password is required';
    }
    return errors;
};
  return (
    <div className = "login">
      <Alert alert = {props.alert}/>
      <div className = "head">
        Re-Cell-Bazaar
      </div>
        <div className="signup-container">
            <form className="signup-form" onSubmit = {handleSubmit} >
                <h1 style = {{textAlign : "center"}}>Login</h1>
               
                <div className="form-group">
                    <input
                        type = "email"
                        name = "email"
                        placeholder = "Email"
                        value = {formData.email}
                        onChange = {handleChange}
                    />
                {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className = "form-group">
                    <input
                        type = "password"
                        name = "password"
                        value = {formData.password}
                        placeholder = "Password"
                        onChange = {handleChange}
                    />
                {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                <button className = "buttonAuth" type="submit">Login</button>
                <span className="divider"></span>
                <GoogleOAuth setLoggedIn = {props.setLoggedIn}/>
                <p style = {{textAlign : "center"}}>Create a new Account <Link to="/Auth/signup">Sign Up</Link></p> 
            </form>
        </div>
    </div>
  )
}
