import React, { useEffect, useCallback, useState } from 'react';
import { useAppContext } from "../context/AppContext";
import { BACKEND_URL } from "../utils/constants";
import { toast } from "react-toastify";

function Products() {
   const {
      products,
      setProducts,
      cartItems,
      addToCart,
      totalItems,
      totalPrice,
       removeFromCart,
   } = useAppContext();

   const [pageSize, setPageSize] = useState(10),
       [page, setPage] = useState(1),
       [searchTerm, setSearchTerm] = useState(""),
       [loading, setLoading] = useState(true);

   // useCallback function won't be re-created on re-rendering
   const catalogueProducts = useCallback(() => {
      setLoading(true);
      const catalogueProductsHeaders = new Headers();
      catalogueProductsHeaders.append("Authorization", "");
      catalogueProductsHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
         searchTerm,
      });

      const requestOptions = {
         method: "POST",
         headers: catalogueProductsHeaders,
         body: raw,
         redirect: "follow",
      };

      fetch(`${BACKEND_URL}/v3/products/catalogue?pageSize=${pageSize}&page=${page}`, requestOptions)
          .then((response) => response.text())
          .then((result) => JSON.parse(result))
          .then((obj) => {
             const productsResponse = obj?.data || [];

             if (obj?.success) {
                setProducts(productsResponse?.response);
                setLoading(false);
             } else if (productsResponse?.message) {
                toast.error(
                    <div>
                       <div className="toastify-header">
                          <h6 className="toast-title">Error</h6>
                       </div>
                       <div className="toastify-body">
                          <span>{productsResponse?.message}</span>
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
          }).finally(() => {

      });
   }, [setProducts, page, pageSize, searchTerm]);

   useEffect(() => {
      catalogueProducts();
   }, [catalogueProducts]);

   return (
       <div className="container mt-5">
          <h2 className="mb-4">Product Store</h2>
          <div className="mb-4">
             <input
                 type="text"
                 className="form-control"
                 placeholder="Search products..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 // onKeyDown={(e) => {
                 //    if (e.key === "Enter") {
                 //       catalogueProducts(); // Fetch on Enter
                 //    }
                 // }}
             />
          </div>
          {!loading && (
              <div className="row">
                 {products.map((item) => (
                     <div className="col-md-4 mb-4" key={item.products[0]._id}>
                        <div className="card h-100">
                           <div className="card-body d-flex flex-column">
                              <h5 className="card-title">{item.products[0].name}</h5>
                              <h6 className="card-subtitle mb-2 text-muted">${item.products[0].price}</h6>
                              <p className="card-text">{item.products[0].description}</p>
                              <button
                                  className="btn btn-primary mt-auto"
                                  onClick={() => addToCart(item.products[0])}
                              >
                                 Add to Cart
                              </button>
                           </div>
                        </div>
                     </div>
                 ))}
              </div>
          )}

          <h4 className="mt-5">Cart ({totalItems} items)</h4>
          <h4 className="mt-3">Total Price ${totalPrice}</h4>
          <ul className="list-group">
             <div className="row">
                {cartItems.map((item) => (
                    <div className="col-md-4 mb-4" key={item.product._id}>
                       <div className="card h-100 position-relative">
                          <span className="badge bg-primary position-absolute top-0 end-0 m-2">
            {item.quantity}
         </span>

                          <div className="card-body d-flex flex-column">
                             <h5 className="card-title">{item.product.name}</h5>
                             <h6 className="card-subtitle mb-2 text-muted">${item.product.price}</h6>
                             <p className="card-text">{item.product.description}</p>
                             <button
                                 className="btn btn-primary mt-auto"
                                 onClick={() => removeFromCart(item.product)}
                             >
                                Remove
                             </button>
                          </div>
                       </div>
                    </div>
                ))}
             </div>
          </ul>
          <center className="d-flex justify-content-center mt-5 mb-4">
             <button className="btn btn-success px-5 py-2" onClick={() => alert('Proceeding to checkout...')}>
                Checkout
             </button>
          </center>
       </div>
   );
}

export default Products;
