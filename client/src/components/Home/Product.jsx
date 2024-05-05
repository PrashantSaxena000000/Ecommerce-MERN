import React, { useEffect, useState } from "react";
import css from "../../styles/Products.module.css";
import Plane from "../../assets/plane.png";
// import { ProductsData } from "../../data/products";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cart";
import toast from "react-hot-toast";

const Product = () => {
  const navigate = useNavigate();
  const [MenuProducts, setMenuProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [cart, setCart] = useCart();

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);
  //get products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(data.products);
      setMenuProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  //getTOtal COunt
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);
  //load more

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filterd product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  const filter = (type) => {
    setMenuProducts(categories.filter((product) => product.name === type));
  };

  const [parent] = useAutoAnimate();

  return (
    <div className={css.container}>
      <img src={Plane} alt="" />
      <h1>Our Feature Products</h1>

      <div className={css.products}>
        <ul className={css.menu}>
          <li onClick={() => setMenuProducts(products)}>All</li>
          {categories?.map((c, i) => (
            <li>{c.name}</li>
          ))}
          {/* <li onClick={() => filter("watches")}>watches</li>
          <li onClick={() => filter("headphones")}>headphones</li> */}
        </ul>

        <div className={css.list} ref={parent}>
          {MenuProducts?.map((product, i) => (
            <div className={css.product}>
              <div
                className="left-s"
                onClick={() => navigate(`/product/${product.slug}`)}
              >
                <div className={css.name}>
                  <spam>{product?.name}</spam>
                  {/* <span>{product.detail}</span> */}
                </div>

                <span>₹ {product?.price}</span>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setCart([...cart, product]);
                    localStorage.setItem(
                      "cart",
                      JSON.stringify([...cart, product])
                    );
                    toast.success("Item Added to cart");
                  }}
                >
                  shop now
                </div>
              </div>
              <img
                alt=""
                src={`/api/v1/product/product-photo/${product?._id}`}
                className="img-p"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
