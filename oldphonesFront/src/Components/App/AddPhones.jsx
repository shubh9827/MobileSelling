import React, { useState } from 'react';
import axios from 'axios';
import '../../StyleSheets/AddPhone.css';

export default function AddPhones(props) {
  const initialFormData = {
    Brand : '',
    ModelName : '',
    Storage: '',
    RAM : '',
    Price : '',
    Network : '',
    Condition : '',
    Features : '',
    images : [],
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData((prevData) => ({
        ...prevData,
        images: Array.from(files),
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name] : value,
      }));
    }
  };

  const verifyEntries = (data) => {
    const newErrors = {};
    if (!data.Brand.trim()) newErrors.Brand = 'Brand is required!';
    if (!data.ModelName.trim()) newErrors.ModelName = 'Model Name is required!';
    if (!data.Storage.trim()) newErrors.Storage = 'Storage is required!';
    if (!data.RAM.trim()) newErrors.RAM = 'RAM is required!';
    if (!data.Price.trim()) newErrors.Price = 'Price is required!';
    if (!data.Network.trim()) newErrors.Network = 'Network is required!';
    if (!data.Condition.trim()) newErrors.Condition = 'Condition is required!';
    if (!data.Features.trim()) newErrors.Features = 'Features are required!';
    if (data.images.length < 3 || data.images.length > 3) newErrors.images = 'Only Three images should be uploaded!';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const formErrors = verifyEntries(formData);

    if (Object.keys(formErrors).length === 0) {
      try {
        const dataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === 'images') {
            formData[key].forEach((file) => dataToSend.append(key, file));
          } else {
            dataToSend.append(key, formData[key]);
          }
        });

        const response = await axios.post('http://localhost:2000/addProduct', dataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        });
        setErrors({});
        setFormData(initialFormData);
        props.showAlert('New Phone added successfully!', 'success');
      } catch (err) {
        if (err.response && err.response.status === 400) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            validationError: err.response.data.error,
          }));
          props.showAlert(err.response.data.error, 'warning');
        }
        else  if (err.response && err.response.status === 409) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            alreadyExist : err.response.data.error,
          }));
          props.showAlert(err.response.data.error, 'warning');
        }
        else
        {
          setErrors((prevErrors) => ({
            ...prevErrors,
            unknown: 'An error occurred. Please try again later.',
          }));
          props.showAlert('An error occurred. Please try again later.', 'danger');
        }
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className="formbold-main-wrapper">
      <div className="formbold-form-wrapper">
        <div className="d-flex justify-content-center" id="addPhoneHead">
          <h1 style={{ color: '#6a64f1', marginBottom: '25px', fontWeight: 'bold', fontSize: '2em', fontFamily: 'sans-serif' }}>Add Phones</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="formbold-input-flex">
            <div>
              <label htmlFor="Brand" className="formbold-form-label">Brand</label>
              <input
                type="text"
                name="Brand"
                id="Brand"
                placeholder="Brand"
                className="formbold-form-input"
                value={formData.Brand}
                onChange={handleChange}
              />
              {errors.Brand && <p style={{ color: 'red' }}>{errors.Brand}</p>}
            </div>
            <div>
              <label htmlFor="ModelName" className="formbold-form-label">Model Name</label>
              <input
                type="text"
                name="ModelName"
                id="ModelName"
                placeholder="Model Name"
                className="formbold-form-input"
                value={formData.ModelName}
                onChange={handleChange}
              />
              {errors.ModelName && <p style = {{ color: 'red' }}> { errors.ModelName } </p> }
            </div>
          </div>
          <div className = "formbold-input-flex">
            <div>
              <label htmlFor = "Storage" className = "formbold-form-label"> Storage </label>
              <input
                type = "text"
                name = "Storage"
                id = "Storage"
                placeholder = "Storage"
                className = "formbold-form-input"
                value = { formData.Storage }
                onChange={handleChange}
              />
              { errors.Storage && <p style = {{ color: 'red' }}> { errors.Storage } </p> }
            </div>
            <div>
              <label htmlFor = "RAM" className = "formbold-form-label"> RAM </label>
              <input
                type = "text"
                name = "RAM"
                id = "RAM"
                placeholder = "RAM"
                className = "formbold-form-input"
                value = { formData.RAM }
                onChange = {handleChange}
              />
              { errors.RAM && <p style = {{ color: 'red' }}> {errors.RAM} </p> }
            </div>
          </div>
          <div className="formbold-input-flex">
            <div>
              <label htmlFor="Price" className="formbold-form-label">Price</label>
              <input
                type="number"
                name="Price"
                id="Price"
                placeholder="Rs."
                className="formbold-form-input"
                value={formData.Price}
                onChange={handleChange}
              />
              {errors.Price && <p style={{ color: 'red' }}>{errors.Price}</p>}
            </div>
            <div>
              <label htmlFor="Network" className="formbold-form-label">Network</label>
              <select
                name="Network"
                id="Network"
                className="formbold-form-input"
                value={formData.Network}
                onChange={handleChange}
              >
                <option value="">Select Network</option>
                <option value="3G">3G</option>
                <option value="4G">4G</option>
                <option value="5G">5G</option>
              </select>
              {errors.Network && <p style={{ color: 'red' }}>{errors.Network}</p>}
            </div>
          </div>
          <div className="formbold-mb-3">
            <label htmlFor="Condition" className="formbold-form-label">Condition</label>
            <input
              type="text"
              name="Condition"
              id="Condition"
              className="formbold-form-input"
              value={formData.Condition}
              onChange={handleChange}
            />
            {errors.Condition && <p style={{ color: 'red' }}>{errors.Condition}</p>}
          </div>
          <div className="formbold-mb-3">
            <label htmlFor="Features" className="formbold-form-label">Other Features</label>
            <textarea
              rows="6"
              name="Features"
              id="Features"
              className="formbold-form-input"
              value={formData.Features}
              onChange={handleChange}
            ></textarea>
            {errors.Features && <p style={{ color: 'red' }}>{errors.Features}</p>}
          </div>
          <div className="formbold-form-file-flex">
            <label htmlFor="images" className="formbold-form-label">Upload Images</label>
            <input
              type="file"
              name="images"
              id="images"
              className="formbold-form-file"
              multiple
              onChange={handleChange}
            />
            {errors.images && <p style={{ color: 'red' }}>{errors.images}</p>}
          </div>
          <button type="submit" className="formbold-btn">Apply Now</button>
        </form>
      </div>
    </div>
  );
}
