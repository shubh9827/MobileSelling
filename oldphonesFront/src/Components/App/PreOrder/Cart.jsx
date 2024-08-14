import React, {useEffect, useRef, useState, useContext} from 'react';
import '../../../StyleSheets/Cart.css';
import axios from "axios";
import Capitalize from '../../Helpers/Capitalize';
import {totalPriceContext} from './PreOrder';

export default function Cart(props) {
  const initialRender = useRef(true);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem("token");
  const { totalPrice, setTotalPrice } = useContext(totalPriceContext);

    const checkOut = () => {
        if(props.step === 3){
          props.setCompletedSteps(prevSteps => {
            return [true, true, true, ...prevSteps.slice(3)];
          });
          props.setStep((prevStep) => prevStep + 1);
        }
    }
    const removeItem = (id) => {
      axios.delete('http://localhost:2000/deleteCartProduct',  {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data : { _id : id }
      })
      .then(response => {
       if(response.data[0].products){
        setCartItems(response.data[0].products)
        setTotalPrice(response.data[0].totalPrice);
       }
       else setCartItems([])
      })
      .catch(error => {
        console.error("Error occurred:", error);
      });
    }

  useEffect(() => {
    if(initialRender.current){
      axios.get('http://localhost:2000/getCartProducts', {
        headers: {
          'Authorization' : `Bearer ${token}`,
        }
      })
      .then((response) => {
        if(response.data[0].products && response.data[0].totalPrice){
       setCartItems(response.data[0].products)
       setTotalPrice(response.data[0].totalPrice);
       }
       else{
        setCartItems([])
        setTotalPrice(0);
       }
      })
      .catch((error) => {
        console.error("Error occurred:", error);
      })
    }
    initialRender.current = false;
  }, [])

  return (
    <div className="cart-container">
    <div className="cart-items">
      {cartItems.map((item) => (
        <div key = {item._id} className = "cart-item row">
          <div className = "col-md-4 col-sm-4 col-xs-4">
            <img style = {{ width : "100px", height : "100px", objectFit : "contain"}} src = {`http://localhost:2000/public/images/${item.images[0]}`} alt = {item.modelName} className="img-responsive" />
          </div>
          <div className = "col-md-4 col-sm-4 col-xs-4">
            <p style = {{marginBottom : "50px", fontWeight : "bold", fontSize : "18px"}}>{Capitalize(item.modelName)}</p>
            <p>Price: ₹{item.price}</p>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4 my-3">
            <button onClick = {() => removeItem(item._id)} className = "btn btn-danger remove-item"><i className = "fa-regular fa-trash-can"></i> Remove</button>
          </div>
        </div>
      ))}
    </div>
    <div className = "cart-total">
      <h4>Total : ₹{totalPrice}</h4>
      <button onClick = {checkOut} className="btn btn-success checkout">Checkout</button>
    </div>
  </div>
  )
}
