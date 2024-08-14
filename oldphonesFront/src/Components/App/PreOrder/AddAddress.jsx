import React, {useState, useEffect, useRef} from 'react';
import axios from "axios";
import '../../../StyleSheets/AddPhone.css';
import stateDistrict from '../../Utils/StateDistricts';
const stateDistricts = stateDistrict();

export default function AddAddress(props) {
    const token = localStorage.getItem('token');
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState({});
    const initialRender = useRef(true);
    const initialFormData = {
        name : '',
        phone : '',
        pinCode : '',
        locality : '',
        district : '',
        state : '',
        addressStreet : ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        ...(name === 'state' && { district: '' })
      }));
    }
    const editAddress = () => {
      setFormData(address);
      setAddress({});
    }
      
    useEffect(() => {
      if (initialRender.current) {
        axios.get('http://localhost:2000/checkAddress', {
          headers: {
            'Authorization' : `Bearer ${token}`,
          }
        })
        .then((response) => {
          if (response.data.address) {
            setAddress(response.data.address);
            props.setCompletedSteps(prevSteps => {
              return [true, true, ...prevSteps.slice(2)];
            });
            props.setStep((prevStep) => prevStep + 1);
          }
        })
        .catch((error) => {
          console.error("Error occurred:", error);
        });
      }
      initialRender.current = false;
    }, []);
   
    const verifyEntries = (data) => {
      const newErrors = {};
      if (!data.name.trim()) newErrors.name = 'Name is required!';
      if (!data.phone.trim()) newErrors.phone = 'Phone number is required!';
      if (!data.pinCode.trim()) newErrors.pinCode = 'PinCode is required!';
      if (!data.locality.trim()) newErrors.locality = 'Locality is required!';
      if (!data.addressStreet.trim()) newErrors.addressStreet = 'Address is required!';
      if (!data.state.trim()) newErrors.state = 'State is required!';
      if (!data.district.trim()) newErrors.district = 'District is required!';
      return newErrors;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const formErrors = verifyEntries(formData);
      if (Object.keys(formErrors).length === 0) {
        try {
          const response = await axios.put('http://localhost:2000/addAddress', formData, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          setAddress(formData)
          setErrors({});
          setFormData(initialFormData);
          if(props.step === 2){
            props.setCompletedSteps(prevSteps => {
              return [true, true, ...prevSteps.slice(2)];
            });
            props.setStep((prevStep) => prevStep + 1)
          }
        }
        catch (err) {
          if (err.response && err.response.status === 400) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              validationError: err.response.data.error,
            }));
          }
          else if (err.response && err.response.status === 409) {
            setErrors((prevErrors) => ({
              ...prevErrors,
              alreadyExist : err.response.data.error,
            }));
          }
          else
          {
            setErrors((prevErrors) => ({
              ...prevErrors,
              unknown: 'An error occurred. Please try again later.',
            }));
          }
        }
      }
      else {
        setErrors(formErrors);
      }
    };

    return (
      <div>
          <h1 style = {{ color : '#6a64f1', marginBottom : '25px', fontWeight : 'bold', fontSize : '2em', fontFamily : 'sans-serif' }}>Delivery Address</h1>
              {Object.keys(address).length === 0 && <div className = "formbold-form-wrapper">
                  <form onSubmit = {handleSubmit}>
                      <div className = "formbold-input-flex">
                          <div>
                              <label htmlFor = "Name" className = "formbold-form-label">Name</label>
                              <input
                                  type = "text"
                                  name = "name"
                                  id = "Name"
                                  placeholder = "Name"
                                  className = "formbold-form-input"
                                  value = {formData.name}
                                  onChange = {handleChange}
                              />
                              {errors.name && <p style = {{ color : 'red' }}> {errors.name} </p>}
                          </div>
                          <div>
                              <label htmlFor = "Phone" className = "formbold-form-label">Contact No.</label>
                              <input
                                  type = "tel"
                                  name = "phone"
                                  id = "Phone"
                                  placeholder = "Contact No."
                                  className = "formbold-form-input"
                                  value = {formData.phone}
                                  onChange = {handleChange}
                              />
                              {errors.phone && <p style = {{ color: 'red' }}> { errors.phone } </p> }
                          </div>
                      </div>
                      <div className = "formbold-input-flex">
                          <div>
                              <label htmlFor = "Pincode" className = "formbold-form-label"> Pincode </label>
                              <input
                                  type = "text"
                                  name = "pinCode"
                                  id = "Pincode"
                                  placeholder = "Pincode"
                                  className = "formbold-form-input"
                                  value = { formData.pinCode }
                                  onChange = {handleChange}
                              />
                              { errors.pinCode && <p style = {{color : 'red'}}> { errors.pinCode } </p> }
                          </div>
                          <div>
                              <label htmlFor = "locality" className = "formbold-form-label"> Locality </label>
                              <input
                                  type = "text"
                                  name = "locality"
                                  id = "Locality"
                                  placeholder = "Locality"
                                  className = "formbold-form-input"
                                  value = {formData.locality}
                                  onChange = {handleChange}
                              />
                              { errors.locality && <p style = {{color : 'red'}}> {errors.locality} </p> }
                          </div>
                      </div>
                      <div className = "formbold-input-flex">
                          <div>
                              <label htmlFor = "State" className = "formbold-form-label"> State </label>
                              <select className = "formbold-form-input" name = "state" id = "State" value = {formData.state} onChange = {handleChange}>
                                <option value = "" disabled> Select State </option>
                                {Object.keys(stateDistricts).map((state) => (
                                  <option key = {state} value = {state}> {state} </option>
                                ))}
                              </select>
                              {errors.state && <p style = {{ color : 'red' }}> {errors.state} </p>}
                          </div>
                          {formData.state && (
                            <div>
                                <label htmlFor = "District" className = "formbold-form-label"> District </label>
                                <select className = "formbold-form-input" id = "District" value = {formData.district} onChange = {handleChange} name = "district">
                                    <option value = "" disabled> Select District </option>
                                    {stateDistricts[formData.state].map((district) => (
                                      <option key = {district} value = {district}>{district}</option>      
                                    ))}
                                </select>
                                {errors.district && <p style = {{ color : 'red' }}> {errors.district} </p>}
                                </div>
                              )}
                      </div>
                      <div className = "formbold-mb-3">
                          <label htmlFor = "AddressStreet" className = "formbold-form-label"> Address (Area, street)</label>
                          <textarea
                              rows = "3"
                              name = "addressStreet"
                              id = "AddressStreet"
                              className = "formbold-form-input"
                              value = {formData.addressStreet}
                              onChange = {handleChange}>
                          </textarea>
                          {errors.addressStreet && <p style = {{ color : 'red' }}>{errors.addressStreet}</p>}
                      </div>
                      <button type = "submit" className = "formbold-btn">Add Address</button>
                  </form>
                </div>
               }
               {Object.keys(address).length !== 0 && <div className="address-container p-3 mb-5">
                <div className = "row">
                  <div className = "col-md-10 address-info"> 
                    <p>Name : {address.name+ ", "}</p>
                    <p>Phone : {address.phone + ", "}</p>
                    <p>Address : {address.addressStreet + ", " + address.locality + ", " + address.district + ", " + address.state + " - " + address.pinCode }</p>
                  </div>
                  <div className = "col-md-2 address-actions text-right">
                    <button onClick = {editAddress} className = "btn btn-success edit-btn">Edit <i class="fa-solid fa-pen-to-square"></i></button>
                  </div>
                </div>
              </div>}
        </div>
    )
}
