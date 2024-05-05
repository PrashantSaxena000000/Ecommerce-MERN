import React, { useState } from "react";
import css from "../../styles/Header.module.css";
import { CgShoppingBag } from "react-icons/cg";
import { GoThreeBars } from "react-icons/go";

const NewHeader = () => {
  const [ShowMenu, setShowMenu] = useState(true);

  const toggleMenu = () => {
    setShowMenu((ShowMenu) => !ShowMenu);
  };

  return (
    <div className={css.container}>
      <div className={css.logo}>
        {/* <img src={Logo} alt="logo" /> */}
        <span>🛒 Ecommerce App</span>
      </div>

      <div className={css.right}>
        <div className={css.bars} onClick={toggleMenu}>
          <i className="fa-solid fa-bars"></i>
        </div>

        {/* <div className={css.menu}  > */}
        <ul
          className={css.menu}
          style={{ display: ShowMenu ? "inherit" : "none" }}
        >
          <li>Collections</li>
          <li>Brands</li>
          <li>New</li>
          <li>Sales</li>
          <li>Eng</li>
        </ul>
        {/* </div> */}
        <input type="text" placeholder="Search" className={css.search} />

        <CgShoppingBag className={css.cart} />
      </div>
    </div>
  );
};

export default NewHeader;
