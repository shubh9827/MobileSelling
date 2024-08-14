import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../../StyleSheets/PreOrder.css';
import AddAddress from './AddAddress';
import Cart from './Cart';
import checkToken from '../../Helpers/CheckToken';
const totalPriceContext = React.createContext();
export {totalPriceContext};

export default function PreOrder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [totalPrice, setTotalPrice] = useState(0);
  const initialRender = useRef(true);
  const { state : product } = location;
  const [step, setStep] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([false, false, false, false]);

  useEffect(() => {
    if (initialRender.current) {
      const tokenStatus = checkToken();
      setIsLoggedIn(tokenStatus);
    }
    initialRender.current = false;
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      setCompletedSteps(prevSteps => {
        return [true, ...prevSteps.slice(1)];
      });
      setStep(2);
    }
  }, [isLoggedIn]);

  const handleNext = () => {
    if (completedSteps[step - 2]) {
      setCompletedSteps((prevSteps) => [...prevSteps.slice(0, step - 1), true, ...prevSteps.slice(step)]);
      nextStep();
    }
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderLogin = () => {
    if (isLoggedIn) {
      return (
        <div style = {{width : "150px", border : "0.25px solid black", borderRadius : "10px", color : "white", padding : "10px", backgroundColor : "#44ce48"}}>
          <h2  className = "fs-5"> <i className = "fa-solid fa-check"></i>  Logged In  </h2>
        </div>
      );
    } else {
      return (
        <div>
          <h2>Please Login!</h2>
          <button onClick = {() => { navigate('/Auth'); }} className = "btn btn-success">Login</button>
        </div>
      );
    }
  };

  const renderPayment = () => (
    <div>
      <h2>Payment</h2>
      <div>
        <h3>UPI Payment</h3>
        <button onClick = {handleNext}>Pay Now</button>
      </div>
      <div>
        <p>Total : ₹{product.price}</p>
      </div>
      <button onClick = {prevStep}> Back </button>
    </div>
  );

  return (
  <div>
   <totalPriceContext.Provider value = {{ totalPrice, setTotalPrice }}>
    <div className = "container">
      <div  className = "row">
       <div style = {{ marginTop : "100px" }} className = "col-md-7 col-sm-12 accordion" id = "accordionPanelsStayOpenExample">
        <div className = "accordion-item" >
          <h2 className = "accordion-header">
            <button
              className = "accordion-button"
              type = "button"
              data-bs-toggle = "collapse"
              data-bs-target = "#panelsStayOpen-collapseOne"
              aria-expanded = "true"
              aria-controls = "panelsStayOpen-collapseOne"
              disabled = {!completedSteps[0]}
            >
              LOGIN STATUS
            </button>
          </h2>
          <div
            id = "panelsStayOpen-collapseOne"
            className = {`accordion-collapse collapse ${step === 1  ? 'show' : ''}`}
          >
            <div className = "accordion-body">
              {renderLogin()}
            </div>
          </div>
        </div>
        <div className = "accordion-item" >
          <h2 className = "accordion-header">
            <button
              className = "accordion-button"
              type = "button"
              data-bs-toggle = "collapse"
              data-bs-target = "#panelsStayOpen-collapseTwo"
              aria-expanded = "false"
              aria-controls = "panelsStayOpen-collapseTwo"
              disabled = {!completedSteps[1]}
            > 
              DELIVERY ADDRESS
            </button>
          </h2>
          <div
            id = "panelsStayOpen-collapseTwo"
            className = {`accordion-collapse collapse ${step === 2  ? 'show' : ''}`}
          >
            <div className = "accordion-body">
              <AddAddress  setStep = {setStep} step = {step}  setCompletedSteps = {setCompletedSteps}/>
            </div>
          </div>
        </div>
        <div className = "accordion-item">
          <h2 className = "accordion-header">
            <button
              className = "accordion-button"
              type = "button"
              data-bs-toggle = "collapse"
              data-bs-target = "#panelsStayOpen-collapseThree"
              aria-expanded = "false"
              aria-controls = "panelsStayOpen-collapseThree"
              disabled = {!completedSteps[2]}
            >
              ORDER SUMMARY
            </button>
          </h2>
          <div
            id = "panelsStayOpen-collapseThree"
            className = {`accordion-collapse collapse ${step === 3  ? 'show' : ''}`}
          >
            <div className = "accordion-body">
             <h1 style = {{ color : '#6a64f1', marginBottom : '25px', fontWeight : 'bold', fontSize : '2em', fontFamily : 'sans-serif' }}>Shopping Cart</h1>
              <Cart step = {step} setStep = {setStep}  setCompletedSteps = {setCompletedSteps} />
            </div>
          </div>
        </div>
        <div className = " my-2 accordion-item">
          <h2 className = "accordion-header">
            <button
              className = "accordion-button"
              type="button"
              data-bs-toggle = "collapse"
              data-bs-target = "#panelsStayOpen-collapseFour"
              aria-expanded = "false"
              aria-controls = "panelsStayOpen-collapseFour"
              disabled = {!completedSteps[3]}
            >
              PAYMENT
            </button>
          </h2>
          <div
            id = "panelsStayOpen-collapseFour"
            className = {`accordion-collapse collapse ${step === 4  ? 'show' : ''}`}>
            <div className = "accordion-body">
              {renderPayment()}
            </div>
          </div>
        </div>
      </div>
        <div style = {{marginLeft : "70px", top : "80px"}} className = "sticky-top col-md-3 col-sm-12 billing-summary">
          <h5 className = "fs-4 my-3 text-center"><strong>Billing Summary</strong></h5>
          <table className = "billTable  table table-borderless my-4">
            <tbody>
              <tr>
                <th> Total Price : </th>
                <td> ₹ {totalPrice} </td>
              </tr>
              <tr>
                <th> Delivery Charges : </th>
                <td> ₹ 49</td>
              </tr>
              <tr>
                <th> Grand Total : </th>
                <td> ₹ {totalPrice + 49} </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
     </totalPriceContext.Provider>
    </div>
  );
}
