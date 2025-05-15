import React, { createContext, useState, useContext, useEffect, Fragment } from 'react';
import { BACKEND_URL } from "../utils/constants";
import { toast } from "react-toastify";

const AppContext = createContext({
   products: [],
   cartItems: [],
});

export const AppProvider = ({ children }) => {
   const [products, setProducts] = useState([]),
       [cartItems, setCartItems] = useState([]),
       [totalItems, setTotalItems] = useState(0),
       [totalPrice, setTotalPrice] = useState(0.0);

   const truncateToTwoDecimals = (num) =>
       Math.floor(num * 100) / 100;

   useEffect(() => {
      if (cartItems.length > 0) {
         const { totalQuantity, totalPrice } = cartItems.reduce(
             (acc, item) => {
                acc.totalQuantity += item.quantity;
                acc.totalPrice += (item.product?.price || 0) * item.quantity;
                return acc;
             },
             { totalQuantity: 0, totalPrice: 0 }
         );

         setTotalItems(totalQuantity);
         setTotalPrice(truncateToTwoDecimals(totalPrice));
      }
      else {
         setTotalItems(0);
         setTotalPrice(0.0);
      }
   }, [cartItems])

   const addToCart = (product) => {
      let updatedCartItems = [...cartItems];
      const existingItem = updatedCartItems.find((item) => item.product.name === product.name);

      if (existingItem) {
         // Increment quantity
         updatedCartItems = updatedCartItems.map((item) =>
             item.product.name === product.name
                 ? { ...item, quantity: item.quantity + 1 }
                 : item
         );
      } else {
         // Add new product
         updatedCartItems = [...updatedCartItems, { productId: product?._id, quantity: 1, product }];
      }

      updateCart(updatedCartItems);
   };

   const removeFromCart = (product) => {
      let updatedCartItems = [...cartItems];

      updatedCartItems = updatedCartItems
          .map((item) => {
             if (item.product.name === product.name) {
                if (item.quantity > 1) {
                   return { ...item, quantity: item.quantity - 1 };
                }
                return null; // Mark for removal
             }
             return item;
          })
          .filter((item) => item !== null); // Remove items with 0 quantity

      updateCart(updatedCartItems);
   };

   const updateCart = (updatedCartItems) => {
      setCartItems(updatedCartItems);
      const { totalQuantity, totalPrice } = updatedCartItems.reduce(
          (acc, item) => {
             acc.totalQuantity += item.quantity;
             acc.totalPrice += (item.product?.price || 0) * item.quantity;
             return acc;
          },
          { totalQuantity: 0, totalPrice: 0 }
      );
      setTotalItems(totalQuantity);
      const _totalPrice = truncateToTwoDecimals(totalPrice);
      setTotalPrice(_totalPrice);

      const updateCartHeaders = new Headers();
      updateCartHeaders.append("Authorization", "");
      updateCartHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
         totalItems: totalQuantity,
         totalPrice: _totalPrice,
         items: updatedCartItems,
      });

      const requestOptions = {
         method: "POST",
         headers: updateCartHeaders,
         body: raw,
         redirect: "follow",
      };

      fetch(`${BACKEND_URL}/v1/customers/cart`, requestOptions)
          .then((response) => response.text())
          .then((result) => JSON.parse(result))
          .then((obj) => {
             const cartResponse = obj?.data || [];
             if (obj?.success) {
                toast.success(
                    <Fragment>
                       <div className="toastify-header">
                          <center className="toast-title">Cart Updated Successfully.</center>
                       </div>
                    </Fragment>
                );
             }
             else if (cartResponse?.message) {
                toast.error(
                    <div>
                       <div className="toastify-header">
                          <h6 className="toast-title">Error</h6>
                       </div>
                       <div className="toastify-body">
                          <span>{cartResponse?.message}</span>
                       </div>
                    </div>
                );
             } else if (obj?.message) {
                toast.error(
                    <div>
                       <div className="toastify-header">
                          <h6 className="toast-title">Error</h6>
                       </div>
                       <div className="toastify-body">
                          {obj?.message || obj?.error?.message || "Something went wrong."}
                       </div>
                    </div>
                );
             }
          })
          .catch((error) => {
             console.error("Error fetching products:", error);
             toast.error(
                 <div>
                    <div className="toastify-header">
                       <h6 className="toast-title">Error</h6>
                    </div>
                    <div className="toastify-body">
                       {error?.message || "Something went wrong."}
                    </div>
                 </div>
             );
          });
   }


   return (
       <AppContext.Provider value={{
          products,
          setProducts,
          cartItems,
          setCartItems,
          addToCart,
          removeFromCart,
          totalItems,
          totalPrice,
          truncateToTwoDecimals
       }}>
          {children}
       </AppContext.Provider>
   );
}

export const useAppContext = () => {
   return useContext(AppContext);
};
