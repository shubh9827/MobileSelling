import React, {useRef, useState} from 'react'
import Navbar from './Navbar';
import Alert from '../Helpers/Alert';
import '../../StyleSheets/Rcb.css'; 
import ProductLayout from './ProductLayout';

export default function Rcb(props) {
  const [numberOfCartItems, setNumberOfCartItems] = useState(null);
  return (
    <div className = "rcb">
      <Navbar numberOfCartItems = {numberOfCartItems} />
      <div
        style = {{position : "fixed", top : "56px", width : "100%", zIndex : 1050 }}
      >
        <Alert alert={props.alert} />
      </div>
      {props.addPhone ? (
        <props.addPhone showAlert = {props.showAlert} />
      ) : props.productDetails ? (
        <props.productDetails setNumberOfCartItems = {setNumberOfCartItems} numberOfCartItems = {numberOfCartItems} />
      ) : props.preOrders ? (
        <props.preOrders />
      ) : (
        <ProductLayout
          setNumberOfCartItems = {setNumberOfCartItems} 
          numberOfCartItems = {numberOfCartItems}
        />
      )}
    </div>
  );
}
