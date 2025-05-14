import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Products from "./components/Products";
import { AppProvider } from "./context/AppContext";
import { ToastContainer, Slide } from 'react-toastify';

function App() {
  return (
    <AppProvider>
       <div className="App">
          <Products/>
       </div>
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
