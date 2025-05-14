import React, { createContext, useState, useContext, Fragment, useEffect } from 'react';

const AppContext = createContext({
   products: [],
   cart: [],
});

export const AppProvider = ({ children }) => {
   const [products, setProducts] = useState([
          // { _id: 1, name: 'Product A', price: 29.99, description: 'Description A' },
          // { _id: 2, name: 'Product B', price: 39.99, description: 'Description B' },
          // { _id: 3, name: 'Product C', price: 49.99, description: 'Description C' },
       ]),
       [cart, setCart] = useState([]),
       [totalItems, setTotalItems] = useState(0),
       [totalPrice, setTotalPrice] = useState(0.0);

   const addToCart = (product) => {
      setCart((prevCart) => {
         let newCart;

         // Check if product exists
         const existingItem = prevCart.find((item) => item.product.name === product.name);

         if (existingItem) {
            // Increment quantity
            newCart = prevCart.map((item) =>
                item.product.name === product.name
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
         } else {
            // Add new product
            newCart = [...prevCart, { product, quantity: 1 }];
         }

         // Calculate sum of quantities
         const totalQuantity = newCart.reduce((sum, item) => sum + item.quantity, 0);
         const totalPrice = newCart.reduce((sum, item) => sum + item.product.price, 0);
         setTotalItems(totalQuantity);
         setTotalPrice(totalPrice);

         // Add totalQuantity to each item
         return newCart.map((item) => ({ ...item, totalQuantity }));
      });
   };

   const removeFromCart = (product) => {
      setCart((prevCart) => {
         // Decrease quantity or remove item
         let updatedCart = prevCart
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

         // Recalculate total quantity and total price
         const totalQuantity = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
         const totalPrice = updatedCart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

         setTotalItems(totalQuantity);
         setTotalPrice(totalPrice);

         // Attach totalQuantity to each item
         return updatedCart.map((item) => ({ ...item, totalQuantity }));
      });
   };


   return (
       <AppContext.Provider value={{
          products,
          setProducts,
          cart,
          setCart,
          addToCart,
          removeFromCart,
          totalItems,
          totalPrice,
       }}>
          {children}
       </AppContext.Provider>
   );
}

export const useAppContext = () => {
   return useContext(AppContext);
};
