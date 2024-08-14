import React, { useState, useEffect, useRef } from 'react';
export default function Filter() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('');
  const filterRef = useRef(null);
  const handleBrands = (e) => {
    const { value, checked } = e.target;
  
    if (checked) {
      setSelectedBrands((prev) => [...prev, value]);
    } else {
      setSelectedBrands((prev) => prev.filter((item) => item !== value));
    }
  };
  const handlePriceRange = (e) => {
    setSelectedPriceRange(e.target.value)
  }
  const handleNetwork = (e) => {
    setSelectedNetwork(e.target.value)
  }
  const handleApplyFilters = () => {
    const filterData = {
      brands: selectedBrands,
      priceRange: selectedPriceRange,
      network: selectedNetwork,
    };
    console.log('Sending filter data to backend:', filterData);
    fetch('https://example.com/api/filters', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filterData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange('');
    setSelectedNetwork('');
  };
  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleClickOutside = (event) => {
    if (filterRef.current && !filterRef.current.contains(event.target)) {
      setIsCollapsed(true);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="col-12 col-md-3 p-0" id="filter" ref={filterRef}>
      <div className="d-md-none mb-3 text-center">
        <button
          className="btn btn-primary rounded-circle"
          onClick={handleToggle}
          type="button"
          aria-expanded={!isCollapsed}
          aria-controls="filterCollapse"
          style = {{ width: '50px', float : "left" }}
        >
          <i className="fa-solid fa-filter"></i>
        </button>
      </div>

      <div
        className={`collapse ${!isCollapsed && 'show'} d-md-flex flex-column flex-shrink-0 p-3 bg-dark sidebar`}
        id="filterCollapse"
      >
        <div style = {{border : "1px solid #333"}} className="card card-body bg-dark text-white">
          <div className="d-none d-md-flex justify-content-center align-items-center">
            <h1 style={{ fontWeight: 'bold', fontSize: '1.2em' }}>Filter</h1>
          </div>

          <h5 className="card-title">Brand</h5>
          {[
            'Apple', 'Samsung', 'Xiomi', 'One Plus', 'Realme', 'Nothing', 
            'Iqoo', 'Poco', 'Honor', 'Motorola', 'Oppo', 'Vivo', 'Lava'
          ].map((brand, index) => (
            <div className="form-check" key={brand}>
              <input className="form-check-input" type="checkbox" value={brand.toLowerCase()} id={`brand${brand}`} />
              <label className="form-check-label" htmlFor={`brand${brand}`}>
                {brand}
              </label>
            </div>
          ))}

          <h5 className="card-title mt-3">Price Range</h5>
          {[
            { id: 'below5000', label: 'Below ₹5000' },
            { id: '5000to10000', label: '₹5000 - ₹10000' },
            { id: '10000to25000', label: '₹10000 - ₹25000' },
            { id: '25000to50000', label: '₹25000 - ₹50000' },
            { id: 'above50000', label: 'Above ₹50000' }
          ].map(range => (
            <div className="form-check" key={range.id}>
              <input className="form-check-input" type="radio" name="priceRange" id={`priceRange${range.id}`} value={range.id} />
              <label className="form-check-label" htmlFor={`priceRange${range.id}`}>
                {range.label}
              </label>
            </div>
          ))}

          <h5 className="card-title mt-3">Network</h5>
          <div className="btn-group" role="group" aria-label="Toggle button group">
            {['3G', '4G', '5G'].map(network => (
              <button type="button" className="btn btn-outline-primary" data-value={network} key={network}>
                {network}
              </button>
            ))}
          </div>
          <button type="button" className="btn btn-primary w-100  mt-3">Apply Filters</button>
          <button type="button" className="btn btn-secondary w-100 mt-3">Reset</button>
        </div>
      </div>
    </div>
  );
}
