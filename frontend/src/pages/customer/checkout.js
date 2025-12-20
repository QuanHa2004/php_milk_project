import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import CartSummary from '../../component/customer/cart-summary';
import Voucher from '../../component/customer/voucher';
import useCart from '../../context/cart-context';

export default function Checkout() {
    const navigate = useNavigate();
    const { fetchCartItems } = useCart();
    const [formData, setFormData] = useState({
        paymentMethod: 'COD'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Chọn phương thức thanh toán (COD / VNPAY)
    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // Xử lý đặt hàng
    const handleCheckout = async () => {
        setError(null);

        setLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Phiên đăng nhập hết hạn!");
                navigate('/login');
                return;
            }

            // Payload gửi lên backend
            const payload = {
                payment_method: formData.paymentMethod,
            };

            // Gửi yêu cầu tạo đơn hàng
            const response = await fetch('http://localhost:8000/orders/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const text = await response.text();
            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error("Server Error: " + text);
            }

            if (!response.ok) {
                if (response.status === 400 && data.error === 'Vui lòng cung cấp đầy đủ số điện thoại, địa chỉ') {
                    alert('Vui lòng cung cấp đầy đủ số điện thoại, địa chỉ');
                    navigate('/profile');
                    return;
                }
                throw new Error(data.error || 'Có lỗi xảy ra khi đặt hàng');
            }

            // Nếu là thanh toán VNPay → chuyển hướng sang VNPay
            if (data.payment_url) {
                if (fetchCartItems) fetchCartItems();
                window.location.href = data.payment_url;
                return;
            }

            // Nếu là COD → thành công ngay
            alert('Đặt hàng thành công! Mã đơn: ' + data.order_id);
            if (fetchCartItems) fetchCartItems();
            navigate(`/checkout/success?order_id=${data.order_id}`);

        } catch (err) {
            console.error(err);
            setError(err.message);
            alert("Lỗi: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-[#f8f9fa] font-sans text-[#333]">
            <div className="relative flex min-h-screen w-full flex-col">
                <Header />

                <main className="flex-grow pt-32 pb-20">
                    <div className="container mx-auto px-4 md:px-10 lg:px-20">

                        <div className="flex items-center gap-2 mb-8">
                            <span className="text-gray-500 cursor-pointer hover:text-[#1a3c7e]" onClick={() => navigate('/cart')}>Giỏ hàng</span>
                            <span className="text-gray-400">/</span>
                            <span className="text-[#1a3c7e] font-semibold">Thanh toán</span>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-[#1a3c7e] text-3xl font-bold uppercase tracking-wide">
                                Thanh toán
                            </h1>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                                    <h2 className="text-[#1a3c7e] text-xl font-bold flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                        <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
                                        Phương thức thanh toán
                                    </h2>

                                    <div className="space-y-4">
                                        <label
                                            className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                        ${formData.paymentMethod === 'VNPAY'
                                                    ? 'border-[#1a3c7e] bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                            onClick={() => handlePaymentChange('VNPAY')}
                                        >
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={formData.paymentMethod === 'VNPAY'}
                                                    readOnly
                                                    className="w-5 h-5 accent-[#1a3c7e]"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-bold text-[#333] text-lg">Ví VNPAY / Thẻ ATM / QR Code</p>
                                                <p className="text-sm text-gray-500 mt-1">Thanh toán an toàn, nhanh chóng qua cổng VNPAY</p>
                                            </div>

                                            <div className="h-8 md:h-10 w-auto bg-white rounded px-2 py-1 flex items-center justify-center border border-gray-100">
                                                <img
                                                    src="https://sandbox.vnpayment.vn/paymentv2/images/logo-vnpay@2x.png"
                                                    alt="VNPAY"
                                                    className="h-full object-contain"
                                                />
                                            </div>
                                        </label>

                                        <label
                                            className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md
                                            ${formData.paymentMethod === 'COD'
                                                    ? 'border-[#1a3c7e] bg-blue-50/30'
                                                    : 'border-gray-100 hover:border-blue-200'}`}
                                            onClick={() => handlePaymentChange('COD')}
                                        >
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="radio"
                                                    name="payment"
                                                    checked={formData.paymentMethod === 'COD'}
                                                    readOnly
                                                    className="w-5 h-5 accent-[#1a3c7e]"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <p className="font-bold text-[#333] text-lg">Thanh toán khi nhận hàng (COD)</p>
                                                <p className="text-sm text-gray-500 mt-1">Thanh toán bằng tiền mặt cho nhân viên giao hàng</p>
                                            </div>

                                            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                                                <span className="material-symbols-outlined">local_shipping</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <div
                                    class="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] dark:border-gray-700">
                                    <h2
                                        class="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                                        Những voucher đang có</h2>
                                    <Voucher />
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] sticky top-32 p-6 border border-gray-100">
                                    <h3 className="text-[#1a3c7e] text-xl font-bold uppercase border-b-2 border-[#1a3c7e] pb-3 mb-6 inline-block">
                                        Đơn hàng của bạn
                                    </h3>

                                    <div className="mb-6">
                                        <CartSummary showPaymentSection={true} />
                                    </div>

                                    {error && (
                                        <div className="mb-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
                                            <span className="material-symbols-outlined text-lg">error</span>
                                            <span>{error}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleCheckout}
                                        disabled={loading}
                                        className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide shadow-lg transition-all duration-300 transform hover:-translate-y-1
                                        ${loading
                                                ? 'bg-gray-300 text-white cursor-not-allowed shadow-none'
                                                : 'bg-gradient-to-r from-[#1a3c7e] to-[#2b55a3] text-white hover:shadow-blue-200'
                                            }`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Đang xử lý...
                                            </span>
                                        ) : (
                                            formData.paymentMethod === 'VNPAY' ? 'Thanh toán VNPAY' : 'Đặt hàng ngay'
                                        )}
                                    </button>

                                    <div className="mt-4 text-center">
                                        <p className="text-gray-400 text-xs">
                                            Cam kết bảo mật thông tin thanh toán
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}