import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DataProductList } from './components/DataProductList';
import { DataProductDetail } from './components/DataProductDetail';
import { CreateDataProduct } from './components/CreateDataProduct';
import { EditDataProduct } from './components/EditDataProduct';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DataProductList />} />
        <Route path="/data-products" element={<DataProductList />} />
        <Route path="/data-products/new" element={<CreateDataProduct />} />
        <Route path="/data-products/:id" element={<DataProductDetail />} />
        <Route path="/data-products/:id/edit" element={<EditDataProduct />} />
      </Routes>
    </Layout>
  );
}

export default App;