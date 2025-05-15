import React, { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import { useAppContext } from "../context/AppContext";


export default function Checkout() {
   const {
      cartItems,
      totalPrice,
      truncateToTwoDecimals,
   } = useAppContext();

   const [shippingInfo, setShippingInfo] = useState({
      name: '',
      address: '',
      email: '',
   });

   const [showModal, setShowModal] = useState(false);

   const handleChange = (e) => {
      setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
   };

   const handleCheckout = () => {
      setShowModal(false);
      console.log('Checkout info:', { shippingInfo, cart: cartItems });
      toast.success(
          <Fragment>
             <div className="toastify-header">
                <h6 className="toast-title">Order Placed!</h6>
             </div>
          </Fragment>
      );
   };

   return (
       <div className="container py-5">
          <h2 className="mb-4">Checkout</h2>

          <div className="mb-4">
             <h5>Cart Summary</h5>
             <ul className="list-group">
                {cartItems.map((item) => (
                    <li key={item.productId} className="list-group-item d-flex justify-content-between align-items-center">
                       {item.name} x {item.quantity}
                       <span>${truncateToTwoDecimals(item.price * item.quantity)}</span>
                    </li>
                ))}
             </ul>
             <div className="text-end fw-bold mt-2">Total: ${totalPrice}</div>
          </div>

          <div className="mb-4">
             <h5>Shipping Details</h5>
             <div className="row g-3">
                <div className="col-md-6">
                   <input
                       type="text"
                       name="name"
                       placeholder="Full Name"
                       className="form-control"
                       onChange={handleChange}
                   />
                </div>
                <div className="col-md-6">
                   <input
                       type="email"
                       name="email"
                       placeholder="Email"
                       className="form-control"
                       onChange={handleChange}
                   />
                </div>
                <div className="col-12">
                   <input
                       type="text"
                       name="address"
                       placeholder="Address"
                       className="form-control"
                       onChange={handleChange}
                   />
                </div>
             </div>
          </div>

          <button
              className="btn btn-success w-100"
              onClick={() => setShowModal(true)}
          >
             Place Order
          </button>

          {/* Bootstrap Modal */}
          {showModal && (
              <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                 <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content shadow">
                       <div className="modal-header">
                          <h5 className="modal-title">Confirm Order</h5>
                          <button
                              type="button"
                              className="btn-close"
                              onClick={() => setShowModal(false)}
                          />
                       </div>
                       <div className="modal-body">
                          <p>Are you sure you want to place the order for <strong>${totalPrice}</strong>?</p>
                       </div>
                       <div className="modal-footer">
                          <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => setShowModal(false)}
                          >
                             Cancel
                          </button>
                          <button
                              type="button"
                              className="btn btn-primary"
                              onClick={handleCheckout}
                          >
                             Confirm Order
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
          )}

          {/* Modal Backdrop */}
          {showModal && <div className="modal-backdrop fade show"></div>}
       </div>
   );
}
