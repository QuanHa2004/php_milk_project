import { Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './protected-routes';

// auth
import Login from '../pages/login';
import Registration from '../pages/registration';

// admin pages
import Dashboard from '../pages/admin/dashboard';
import Order from '../pages/admin/order-management';
import CategoryManagement from '../pages/admin/category-management';
import ProductManagement from '../pages/admin/product-management';
import PromotionManagement from '../pages/admin/promotion-management';
import InvoiceManagement from '../pages/admin/invoice-management';
import UserManagement from '../pages/admin/user-management';
import ManufacturerManagement from '../pages/admin/manufacturer-management';
import SupplierManagement from '../pages/admin/supplier-management';
import AddCategory from '../pages/admin/add-category';
import AddProduct from '../pages/admin/add-product';
import CreatePromotion from '../pages/admin/create-promotion';
import AddInvoice from '../pages/admin/add-invoice';
import AddManufacturer from '../pages/admin/add-manufacturer';
import AddSupplier from '../pages/admin/add-supplier';
import ReviewManagement from '../pages/admin/review-management';


// customer pages
import Home from '../pages/customer/home';
import Profile from '../pages/customer/profile';
import Product from '../pages/customer/product';
import ProductDetail from '../pages/customer/product-detail';
import Cart from '../pages/customer/cart';
import Checkout from '../pages/customer/checkout';
import CheckoutSuccess from "../pages/customer/checkout-success";
import CheckoutFailed from "../pages/customer/checkout-failed";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />
      <Route path="/registration" element={<Registration />} />

      <Route element={<ProtectedRoutes />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/order" element={<Order />} />
        <Route path="/admin/category" element={<CategoryManagement />} />
        <Route path="/admin/product" element={<ProductManagement />} />
        <Route path="/admin/promotion" element={<PromotionManagement />} />
        <Route path="/admin/invoice" element={<InvoiceManagement />} />
        <Route path="/admin/user" element={<UserManagement />} />
        <Route path="/admin/manufacturer" element={<ManufacturerManagement />} />
        <Route path="/admin/supplier" element={<SupplierManagement />} />
        <Route path="/admin/review" element={<ReviewManagement />} />
        <Route path="/admin/add-category" element={<AddCategory />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/create-promotion" element={<CreatePromotion />} />
        <Route path="/admin/add-invoice" element={<AddInvoice />} />
        <Route path="/admin/add-manufacturer" element={<AddManufacturer />} />
        <Route path="/admin/add-supplier" element={<AddSupplier />} />
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/products" element={<Product />} />
      <Route path="/categories/:category_id/products" element={<Product />} />
      <Route path="/product-details/:product_id" element={<ProductDetail />} />
      <Route path="/carts" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout/success" element={<CheckoutSuccess />} />
      <Route path="/checkout/failed" element={<CheckoutFailed />} />

    </Routes>
  );
}
