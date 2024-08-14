import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import capitalize from '../Helpers/Capitalize';
import  axios from "axios";
import '../../StyleSheets/ProductDetails.css'

export default function ProductDetails(props) {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const location = useLocation();
  const {state : product} = location;
  const cartData = {}; 
  const buyNow = () => {
    navigate('/App/productDetails/preOrders', { state : product });
  }
  if (!product) {
    return <div> Product not found </div>;
  }

  const addToCart = async() => {
    cartData.productId = product._id
    await axios.post('http://localhost:2000/addToCart', cartData, {
      headers: {
        'Authorization' : `Bearer ${token}`,
        'Content-Type' : 'application/json'
      }
    })
    .then((response) => {
      props.setNumberOfCartItems(response.data.productIds.length);
    })
    .catch(error => console.log(error))                         
  }

  return (
    <div className = "container my-5">
      <div className = "row" style = {{ marginTop : '100px' }}>
          <h1 style = {{fontSize : "40px", marginTop : "20px"}} className = "d-block d-md-none text-center mb-4 font-weight-bold">
            {capitalize(product.brand)} - {capitalize(product.modelName)}
          </h1>
        <div className = "col-md-6">
          <div id = "productCarousel" className = "mx-auto carousel slide" data-ride = "carousel">
            <div className = "carousel-inner" style = {{ height : '530px' }}>
              {product.images.map((image, index) => (
                <div className = {`carousel-item ${index === 0 ? 'active' : ''}`} key = {index}>
                  <img
                    className = "d-block w-100"
                    src = {`http://localhost:2000/public/images/${image}`}
                    alt = {`Slide ${index + 1}`}
                    style = {{height : '530px'}}
                  />
                </div>
              ))}
            </div>
            <a className = "carousel-control-prev custom-carousel-control-prev" href = "#productCarousel" role = "button" data-slide="prev">
              <span className = "carousel-control-prev-icon custom-carousel-control-prev-icon" aria-hidden = "true"></span>
              <span className = "sr-only">Previous</span>
            </a>
            <a className = "carousel-control-next custom-carousel-control-next" href = "#productCarousel" role = "button" data-slide = "next">
              <span className = "carousel-control-next-icon custom-carousel-control-next-icon" aria-hidden = "true"></span>
              <span className = "sr-only">Next</span>
            </a>
          </div>
        </div>
        <div className = "col-md-6">
          <h2 style = {{fontSize : "75px"}} className = "d-none d-md-block mb-5">{capitalize(product.brand)} - {capitalize(product.modelName)}</h2>
          <ul className = "list-group list-group-flush mb-5">
            <li className = "list-group-item mb-3"><strong>Features :</strong> {capitalize(product.features)}</li>
            <li className = "list-group-item mb-3"><strong>Condition :</strong> {capitalize(product.condition)}</li>
            <li className = "list-group-item mb-3"><strong>Network :</strong> {capitalize(product.network)}</li>
            <li className = "list-group-item mb-3"><strong>Price :</strong> ₹{product.price}</li>
            <li className = "list-group-item mb-3"><strong>Storage :</strong> {capitalize(product.storage)}</li>
            <li className = "list-group-item mb-3"><strong>RAM :</strong> {capitalize(product.ram)}</li>
          </ul>
        </div>
        <div id = "productDetailsBtns" className = "d-flex flex-column flex-md-row justify-content-between col-md-6">
            <button onClick = {addToCart} type = "button" className = "btn p-3 btn-warning w-100 w-md-45 m-2">
                <i className = "fa-solid fa-cart-shopping"></i> Add to Cart
            </button>
            <button onClick = {buyNow} type = "button" className = "btn btn-success w-100 p-3 w-md-45 m-2">
                <i className = "fa-solid fa-bolt"></i> Buy Now
            </button>
        </div>
       </div>
    </div>
  );
}
