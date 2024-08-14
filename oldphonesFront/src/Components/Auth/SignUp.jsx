import React, {useState} from 'react';
import '../../StyleSheets/SignUp.css';
import axios from 'axios';
import Alert from '../Helpers/Alert';
import { Link, useNavigate } from "react-router-dom";
import GoogleoAuth from './GoogleoAuth';

const Signup = (props) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name : '',
        email : '',
        phone : "",
        gender : '',
        dob : '',
        password : '',
        confirmPassword : ''
      });
      const [errors, setErrors] = useState('');
      const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
      };
    
      const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = validateForm(formData);
        if (Object.keys(validationErrors).length === 0) {
        } else {
            setErrors(validationErrors);
        }
        const dataToSend = JSON.stringify(formData);
        try {
          const response = await axios.post('http://localhost:2000/signup', dataToSend, {
            headers: {'Content-Type': 'application/json'},
          });
          props.showAlert("You're Credentials are registered! please Login.", "success");
          navigate("/Auth");
        } catch (err) {
          if (err.response && err.response.status === 409) {
            setErrors((errors) => ({
              ...errors,
              alreadyExists : err.response.data.msg
            }));
            props.showAlert(errors.alreadyExists, "warning")
          } else  if (err.response && err.response.status === 400) {
            setErrors((errors) => ({
             ...errors,
             validationError : err.response.data.error
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
        let selectedDate = new Date(data.dob).getTime();

        if (!data.name.trim()) {
            errors.name = 'Username is required';
        }
        if (!data.phone.trim()) {
          errors.phone = 'Phone no. is required';
        }
        else if(!/^[0-9]{10}$/.test(data.phone)){
          errors.phone = "Phone no. is invalid"
        }
        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }
        if (!data.password.trim()) {
            errors.password = 'Password is required';
        }
        else if(!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(data.password)){
          errors.password = 'password must contain Minimum 8 characters, at least 1 letter, 1 number and 1 special character:'
        }
        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        if (!data.dob) {
          errors.dob = 'Date of birth required';
        }
        else if(selectedDate >= Date.now()){
          errors.dob = 'Date must be in the Past.'
        }
        if (!data.gender) {
          errors.gender = 'Gender not selected.';
        }
        return errors;
    };

    return (
      <div className = "signup">
        <Alert alert = {props.alert}/>
      <div className = "head">
        Re-Cell-Bazaar
      </div>
        <div className = "signup-container">
            <form className = "signup-form" onSubmit = {handleSubmit} >
                <h1 style = {{textAlign : "center"}}>Sign Up</h1>
                <div className = "form-group">
                    <input
                        type = "text"
                        name = "name"
                        value = {formData.name}
                        placeholder = "Username"
                        onChange = {handleChange}
                    />
                     {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className = "form-group">
                    <input
                        type = "email"
                        name = "email"
                        value = {formData.email}
                        placeholder = "Email"
                        onChange = {handleChange}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                <div className = "form-group">
                    <input
                        type = "tel"
                        name = "phone"
                        value = {formData.phone}
                        placeholder = "Phone no."
                        onChange = {handleChange}
                    />
                    {errors.phone && <span className = "error-message">{errors.phone}</span>}
                </div>
                <div className = "dropdowns" >
                <div className = "form-group" id = "select">
                <span>Gender : </span>
                    <select id = "gender" name = "gender"  value = {formData.gender} onChange = {handleChange}>
                        <option value = "">Select Gender</option>
                        <option value = "male">Male</option>
                        <option value = "female">Female</option>
                        <option value = "other">Other</option>
                    </select>
                    {errors.gender && <p className="error-message">{errors.gender}</p>}
                    </div>
                    <div className = "form-group" id = "date">
                    <span> DOB : </span>
                    <input
                        id = "dob"
                        type = "date"
                        value = {formData.dob}
                        name = "dob"
                        onChange = {handleChange}
                    />
                    {errors.dob && <p className="error-message">{errors.dob}</p>}
                </div>
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
                <div className = "form-group">
                    <input
                        type = "password"
                        name = "confirmPassword"
                        value = {formData.confirmPassword}
                        placeholder = "Confirm Password"
                        onChange = {handleChange}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
                <button className = 'buttonAuth' type = "submit">Sign Up</button>
                  <span className = "divider"></span>
                    <GoogleoAuth setLoggedIn = {props.setLoggedIn}/>
                <p style = {{textAlign : "center"}}>Already have an Account? <Link to = "/Auth"> Login </Link> </p> 
            </form>
          </div>
        </div>
    );
};

export default Signup;
