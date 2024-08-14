import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import capitalize from '../Helpers/Capitalize';

export default function Product(props) {
  const navigate = useNavigate();
  const saveOverFlow = () => {
    const { features } = props.product;
    const wordsArray = features.split(" ");
    if (wordsArray.length <= 10) {
      return features;
    }
    const newFeatures = wordsArray.slice(0, 10).concat("...").join(" ");
    return newFeatures;
  }
  const openProduct = () => {
    navigate('/App/productDetails', {state : props.product})
  }

  return (
    <div onClick = {openProduct} className = "d-flex justify-content-center">
      <div className = "card flex-row productBox" style = {{ marginBottom: "40px" }}>
        <img className = "card-img-left"  src = {`http://localhost:2000/public/images/${props.product.images[0]}`} style = {{ width: "200px", height: "100%" }} alt="Sorry, Image not Available!" />
        <div className = "card-body product">
          <h5 className = "card-title mb-3"><strong>{capitalize(props.product.brand)} - {capitalize(props.product.modelName)}</strong></h5>
          <p className = "card-text mb-2">{saveOverFlow()}</p>
          <ul className = "list-group list-group-flush mb-3">
            <li className = "list-group-item">Condition - {props.product.condition}</li>
            <li className = "list-group-item"> Network - {props.product.network}</li>
            <li className = "list-group-item">Price - ₹{props.product.price}</li>
          </ul>
          <div style = {{marginTop : "-25px"}} className = "row">
            <div style = {{marginBottom : "-6px"}} className = "col-sm-12 col-md-6">
              <button type = "button" className = "btn btn-warning w-100">
                <i className = "fa-solid fa-cart-shopping"></i> Add to Cart
              </button>
            </div>
            <div className = "col-sm-12 col-md-6">
              <button type = "button" className = "btn btn-dark w-100">
                <i className = "fa-solid fa-info"></i> Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
