import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import { AppProvider } from "./context/AppContext";
import { ToastContainer, Slide } from 'react-toastify';


function App() {
  return (
    <AppProvider>
       <Router>
          <div className="App">
             <Routes>
                <Route path="/" element={<Products />} />
                <Route path="/checkout" element={<Checkout />} />
             </Routes>
          </div>
       </Router>
       <ToastContainer
           autoClose={5000}
           hideProgressBar={true}
           closeOnClick
           pauseOnFocusLoss={false}
           pauseOnHover
           transition={Slide}
           position="top-center"
           newestOnTop={true}
       />
    </AppProvider>
  );
}

export default App;
