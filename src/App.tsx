import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import './css/style.css'
import MainPage from './components/pages/MainPage'
import CatalogPage  from './components/pages/CatalogPage';
import AboutPage  from './components/pages/AboutPage';
import ContactsPage  from './components/pages/ContactsPage';
import Error404Page  from './components/pages/Error404Page';
import Header from './components/Header';
import Footer from './components/Footer';
import banner from './components/banner';
import ProductPage from './components/pages/ProductPage';
import CartPage from './components/pages/CartPage';

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path='/' element={<MainPage children={banner}/>} />
        <Route path='/catalog' element={<CatalogPage children={banner}/>} />
        <Route path='/about' element={<AboutPage children={banner}/>} />
        <Route path='/contacts' element={<ContactsPage children={banner}/>} />
        <Route path='/catalog/#/:productID' element={<ProductPage children={banner}/>} />
        <Route path='/cart' element={<CartPage children={banner}/>} />
        <Route path='*' element={<Error404Page  children={banner}/>} />
      </Routes>

      <Footer />
    </>

  )

}

export default App;
