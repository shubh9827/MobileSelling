import React, { useState, useEffect, useRef } from 'react';
import Product from './Product';
import Filter from './Filter';
import InfiniteScroll from "react-infinite-scroll-component";
import Spinner from "../Helpers/Spinner";
import axios from 'axios';

export default function ProductLayout(props) {
  const [products, setProducts] = useState([]);
  const initialRender = useRef(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1;
      const url = `http://localhost:2000/getProducts?page=${nextPage}&limit=5`;
      const response = await axios.get(url);
      const parsedData = response.data;

      if (parsedData.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...parsedData.products]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error("Error fetching more data: ", error);
    }
  };

  const updateProducts = async () => {
    try {
      const url = `http://localhost:2000/getProducts?page=1&limit=5`;
      const response = await axios.get(url);
      const parsedData = response.data;
      setProducts(parsedData.products);
      setHasMore(parsedData.products.length > 0);
    } catch (error) {
      console.error("Error updating products: ", error);
    }
  };

  useEffect(() => {
    if (initialRender.current) {
      updateProducts();
      initialRender.current = false; 
    }
  }, []);

  return (
    <div>
      <div className = "container fixed-top d-flex justify-content-center" id = "headingProduct">
        <h1 style = {{ fontWeight : 'bold', fontSize : '2em', fontFamily : "sans-serif"}}> All Available Phones</h1>
      </div>
      <div style = {{ position : "fixed" }} className = "container-fluid my-4">
        <div id="mainRow" className="row">
          <div className = "col-md-3">
            <Filter/>
          </div>
          <div className = "col-md-9" id = "mainContainer" style = {{ height : "calc(100vh - 150px)", overflowY : 'auto'}}>
            <InfiniteScroll
              dataLength = {products.length}
              next = {fetchMoreData}
              hasMore = {hasMore}
              loader = {
                <div id = "spinner" >
                  <Spinner />
                </div>
              }
              scrollableTarget = "mainContainer"
            >
              <div className = "row" id = "productRow">
                {Array.isArray(products) && products.map((product) => (
                  product && product._id && (
                    <div className = "col-md-12 mb-4" key = {product._id}>
                      <Product product = {product} />
                    </div>
                  )
                ))}
              </div>
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </div>
  );
}
