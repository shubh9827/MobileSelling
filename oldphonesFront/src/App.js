import React, {useState} from 'react';
import './App.css';
import Rcb from './Components/App/Rcb';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/SignUp';
import AddPhones from './Components/App/AddPhones';
import preOrders from './Components/App/PreOrder/PreOrder';
import productDetails from './Components/App/ProductDetails';
import PrivateRoutes from './Components/Utils/PrivateRoutes';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
function App() {
  const [alert, setAlert] = useState(null);
  function showAlert(message, type){
    setAlert({
      msg : message,
      type : type
    })
    setTimeout(()=>{
      setAlert(null);
    }, 2000)
  }
  return (
    <>
      <Router>
        <Routes>
          <Route path = "/" element={<PrivateRoutes />}>
              <Route path="/App" element={<Rcb />} />
              <Route path="/App/addPhones" element={<Rcb alert = {alert} showAlert = {showAlert} addPhone = {AddPhones}/>} />
              <Route path="/App/productDetails" element={<Rcb alert = {alert} showAlert = {showAlert} productDetails = {productDetails}/>} />
              <Route path="/App/productDetails/preOrders" element={<Rcb alert = {alert} showAlert = {showAlert} preOrders  = {preOrders}/>} />
          </Route>
          <Route path="/Auth/signup" element={<Signup alert = {alert} showAlert = {showAlert} />} />
          <Route path="/Auth" element={<Login alert = {alert} showAlert = {showAlert} />} />
        </Routes>
      </Router>
    </>
  );
}
export default App;
