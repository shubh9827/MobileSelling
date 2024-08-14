import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar(props) {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    navigate("/Auth")
  }
  return (
    <nav className = "navbar fixed-top navbar-expand-lg navbar-dark bg-dark mx-auto px-3">
      <div className = "container-fluid">
        <Link className = "navbar-brand" to = "/App">ReCellBazaar</Link>
        <button className = "navbar-toggler" type = "button" data-bs-toggle = "collapse" data-bs-target = "#navbarSupportedContent" aria-controls = "navbarSupportedContent" aria-expanded = "false" aria-label = "Toggle navigation">
          <span className = "navbar-toggler-icon"></span>
        </button>
        <div className = "collapse navbar-collapse" id = "navbarSupportedContent">
          <ul className = "navbar-nav me-auto mb-2 mb-lg-0">
            <li className = "nav-item dropdown">
              <Link className = "nav-link dropdown-toggle" to = "#" id = "navbarDropdown" role = "button" data-bs-toggle = "dropdown" aria-expanded = "false">
              <i className = "fa-solid fa-user"></i>
              </Link>
              <ul className = "dropdown-menu" aria-labelledby = "navbarDropdown">
                <li><Link className = "dropdown-item" to = "#"><i className = "fa-solid fa-truck-fast"></i> My Orders</Link></li>
                <li><Link className = "dropdown-item" to = "/App/addPhones"><i className = "fa-solid fa-plus"></i> Add Phones</Link></li>
                <li><Link className = "dropdown-item" to = "#"><i className = "fa-solid fa-gear"></i> Settings</Link></li>
                <li><Link className = "dropdown-item" to = "#"><i className = "fa-solid fa-ticket"></i> Coupons</Link></li>
                <li><hr className = "dropdown-divider"/></li>
                <li>
                  <button className = "dropdown-item" onClick = {logout}>
                    <i className = "fa-solid fa-right-from-bracket"></i> Logout
                  </button>
                </li>
              </ul>
            </li>
            <li className = "nav-item">
              <Link className = "nav-link" to = "#"><i className = "fa-solid fa-heart"></i></Link>
            </li>
            <li className = "nav-item">
            <Link className = "nav-link" to = "#">
              <i className = "fa-solid fa-cart-shopping position-relative">
                <span style = {{
                  backgroundColor : "red",
                  borderRadius : "10px",
                  fontSize : "10px", 
                  padding : "4px 6px", 
                  top : "-5px", 
                }} className = "badge badge-danger position-absolute top-0 start-100 translate-middle">
                  {props.numberOfCartItems}
                </span>
              </i>
            </Link>
            </li>
            <li className = "nav-item">
              <Link className = "nav-link" to = "/">About</Link>
            </li>
            <li className = "nav-item">
              <Link className = "nav-link" to = "/link">Contact Us</Link>
            </li>
          </ul>
          <form className = "d-flex align-items-center">
            <input className = "form-control me-2 my-2" type = "search" placeholder = "Search" aria-label = "Search" />
            <button className = "btn btn-outline-info my-2" type = "submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}
