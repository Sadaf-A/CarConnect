import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import SignUp from './components/SignUp';
import Login from './components/Login';
import ProductInfo from './components/ProductInfo';
import ProductList from './components/ProductList';
import AddCar from './components/AddCar';

function App() {
  return (
    <Router>
      <div className="App">      
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/car-details/:carId" element={<ProductInfo />} />
          <Route path="/add-car" element={<AddCar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
