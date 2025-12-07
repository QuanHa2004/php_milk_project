import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import CartSummary from '../../component/customer/cart-summary';
import useCart from '../../context/cart-context';

export default function Checkout() {
    const navigate = useNavigate();
    const { fetchCartItems } = useCart();
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address1: '',
        city: '',
        note: '',
        paymentMethod: 'COD'
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Cập nhật giá trị input khi người dùng nhập
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Chọn phương thức thanh toán (COD / VNPAY)
    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // Xử lý đặt hàng
    const handleCheckout = async () => {
        setError(null);
        if (!formData.fullName || !formData.phone || !formData.address1 || !formData.city) {
            alert("Vui lòng điền đầy đủ: Tên, SĐT và Địa chỉ!");
            return;
        }

        setLoading(true);

        const fullAddress = `${formData.address1}, ${formData.city}`;

        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                alert("Phiên đăng nhập hết hạn!");
                navigate('/login');
                return;
            }

            // Payload gửi lên backend
            const payload = {
                full_name: formData.fullName,
                phone: formData.phone,
                delivery_address: fullAddress,
                payment_method: formData.paymentMethod,
                note: formData.note,
                shipping_fee: 0
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
        <div className="bg-white dark:bg-background-dark font-display text-text-color">
            <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div className="layout-container flex h-full grow flex-col">
                    <div className="layout-content-container flex flex-col w-full flex-1">
                        <Header />

                        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 mt-10">
                            <section className="px-4 md:px-10 lg:px-40 py-5">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                    <div className="lg:col-span-2">
                                        <div className="space-y-8">
                                            <div>
                                                <h2 className="text-[#111618] dark:text-white text-[22px] font-bold px-4 pb-3 pt-5">
                                                    Thông tin giao hàng
                                                </h2>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-3">
                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="pb-2 font-medium">Họ và tên *</p>
                                                            <input
                                                                name="fullName"
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                className="form-input h-14 rounded-lg border border-[#dbe2e6] p-4"
                                                                placeholder="Nguyễn Văn A"
                                                                type="text"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="pb-2 font-medium">Số điện thoại *</p>
                                                            <input
                                                                name="phone"
                                                                value={formData.phone}
                                                                onChange={handleInputChange}
                                                                className="form-input h-14 rounded-lg border border-[#dbe2e6] p-4"
                                                                placeholder="0912345678"
                                                                type="tel"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="pb-2 font-medium">Địa chỉ nhận hàng *</p>
                                                            <input
                                                                name="address1"
                                                                value={formData.address1}
                                                                onChange={handleInputChange}
                                                                className="form-input h-14 rounded-lg border border-[#dbe2e6] p-4"
                                                                placeholder="Số nhà, tên đường..."
                                                                type="text"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="pb-2 font-medium">Tỉnh / Thành phố *</p>
                                                            <input
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleInputChange}
                                                                className="form-input h-14 rounded-lg border border-[#dbe2e6] p-4"
                                                                placeholder="Hà Nội, TP.HCM..."
                                                                type="text"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="pb-2 font-medium">Ghi chú (Tùy chọn)</p>
                                                            <textarea
                                                                name="note"
                                                                value={formData.note}
                                                                onChange={handleInputChange}
                                                                className="form-input rounded-lg border border-[#dbe2e6] p-4"
                                                                rows="2"
                                                                placeholder="Giao hàng giờ hành chính..."
                                                            />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h2 className="text-[#111618] dark:text-white text-[22px] font-bold px-4 pb-3 pt-5 flex items-center gap-2">
                                                    Phương thức thanh toán
                                                    <span className="material-symbols-outlined text-xl text-gray-400">lock</span>
                                                </h2>
                                                <div className="px-4 py-3 space-y-4">
                                                    <div
                                                        className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer ${formData.paymentMethod === 'VNPAY'
                                                            ? 'border-primary ring-2 ring-primary bg-blue-50'
                                                            : 'border-[#dbe2e6]'
                                                            }`}
                                                        onClick={() => handlePaymentChange('VNPAY')}
                                                    >
                                                        <input
                                                            checked={formData.paymentMethod === 'VNPAY'}
                                                            readOnly
                                                            className="form-radio h-5 w-5 text-primary"
                                                            type="radio"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-[#111618]">Ví VNPAY / Thẻ ATM / QR Code</p>
                                                            <p className="text-sm text-gray-500">Thanh toán an toàn qua cổng VNPay</p>
                                                        </div>
                                                        <img
                                                            src="https://sandbox.vnpayment.vn/paymentv2/images/logo-vnpay@2x.png"
                                                            alt="VNPay"
                                                            className="h-8"
                                                        />
                                                    </div>

                                                    <div
                                                        className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer ${formData.paymentMethod === 'COD'
                                                            ? 'border-primary ring-2 ring-primary bg-blue-50'
                                                            : 'border-[#dbe2e6]'
                                                            }`}
                                                        onClick={() => handlePaymentChange('COD')}
                                                    >
                                                        <input
                                                            checked={formData.paymentMethod === 'COD'}
                                                            readOnly
                                                            className="form-radio h-5 w-5 text-primary"
                                                            type="radio"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-bold text-[#111618]">Thanh toán khi nhận hàng (COD)</p>
                                                            <p className="text-sm text-gray-500">Thanh toán tiền mặt cho shipper</p>
                                                        </div>
                                                        <span className="material-symbols-outlined text-3xl text-gray-600">
                                                            local_shipping
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1">
                                        <div className="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] sticky top-24">
                                            <h2 className="text-[#111618] dark:text-white text-[22px] font-bold mb-6">
                                                Đơn hàng của bạn
                                            </h2>

                                            <CartSummary showPaymentSection={false} />

                                            {error && (
                                                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <button
                                                onClick={handleCheckout}
                                                disabled={loading}
                                                className={`w-full mt-8 flex items-center justify-center rounded-lg h-14 text-white text-lg font-bold transition-all ${loading
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
                                                    }`}
                                            >
                                                {loading
                                                    ? 'Đang xử lý...'
                                                    : formData.paymentMethod === 'VNPAY'
                                                        ? 'Thanh toán VNPay'
                                                        : 'Đặt hàng ngay'}
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </section>
                        </main>

                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    );
}