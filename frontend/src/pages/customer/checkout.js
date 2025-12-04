import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Giả sử bạn dùng react-router-dom
import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import CartSummary from '../../component/customer/cart-summary';
import Voucher from '../../component/customer/voucher';
import useCart from '../../context/cart-context'; // Import context để reload giỏ hàng sau khi mua

export default function Checkout() {
    const navigate = useNavigate();
    const { fetchCartItems } = useCart(); // Lấy hàm fetchCartItems để cập nhật lại giỏ hàng sau khi mua thành công
    
    // 1. Khởi tạo State để lưu dữ liệu form
    const [formData, setFormData] = useState({
        fullName: '',
        address1: '',
        address2: '',
        city: '',
        zip: '',
        paymentMethod: 'COD' // Mặc định là COD hoặc Credit Card tùy bạn
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 2. Hàm xử lý khi người dùng nhập liệu
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // 3. Hàm xử lý chọn phương thức thanh toán
    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    // 4. Hàm xử lý Đặt hàng (Checkout)
    const handleCheckout = async () => {
        setError(null);

        // Validate cơ bản
        if (!formData.fullName || !formData.address1 || !formData.city || !formData.zip) {
            alert("Vui lòng điền đầy đủ thông tin giao hàng!");
            return;
        }

        setLoading(true);

        // Ghép địa chỉ thành 1 chuỗi duy nhất cho Backend
        const fullAddress = `${formData.address1}, ${formData.address2 ? formData.address2 + ', ' : ''}${formData.city}, Zip: ${formData.zip}`;

        try {
            // Lấy token từ LocalStorage (hoặc nơi bạn lưu token)
            const token = localStorage.getItem('access_token'); 

            if (!token) {
                alert("Bạn chưa đăng nhập!");
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:8000/orders/checkout', { // Thay URL API của bạn
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    delivery_address: fullAddress,
                    payment_method: formData.paymentMethod,
                    delivery_date: "" // Backend sẽ tự tính nếu để trống, hoặc bạn thêm date picker
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Có lỗi xảy ra khi đặt hàng');
            }

            // Thành công
            alert('Đặt hàng thành công! Mã đơn: ' + data.order_id);
            
            // Làm mới giỏ hàng (về 0)
            if(fetchCartItems) fetchCartItems();

            // Chuyển hướng về trang chủ hoặc trang lịch sử đơn hàng
            navigate('/'); 

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
                                    
                                    {/* Cột trái: Form nhập liệu */}
                                    <div className="lg:col-span-2">
                                        <div className="space-y-8">
                                            <div>
                                                <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                                                    Địa chỉ giao hàng</h2>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-3">
                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">Tên của bạn</p>
                                                            <input
                                                                name="fullName"
                                                                value={formData.fullName}
                                                                onChange={handleInputChange}
                                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="Nhập tên của bạn" type="text" />
                                                        </label>
                                                    </div>
                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">Địa chỉ 1</p>
                                                            <input
                                                                name="address1"
                                                                value={formData.address1}
                                                                onChange={handleInputChange}
                                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="Số nhà, đường..." type="text" />
                                                        </label>
                                                    </div>
                                                    <div className="col-span-full">
                                                        <label className="flex flex-col w-full">
                                                            <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">Địa chỉ 2 (nếu có)</p>
                                                            <input
                                                                name="address2"
                                                                value={formData.address2}
                                                                onChange={handleInputChange}
                                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="Tòa nhà, khu dân cư..." type="text" />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label className="flex flex-col w-full">
                                                            <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">Thành phố</p>
                                                            <input
                                                                name="city"
                                                                value={formData.city}
                                                                onChange={handleInputChange}
                                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <label className="flex flex-col w-full">
                                                            <p className="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">Mã Zip</p>
                                                            <input
                                                                name="zip"
                                                                value={formData.zip}
                                                                onChange={handleInputChange}
                                                                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Phương thức thanh toán */}
                                            <div>
                                                <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 flex items-center gap-2">
                                                    Phương thức thanh toán
                                                    <span className="material-symbols-outlined text-xl text-gray-400">lock</span>
                                                </h2>
                                                <div className="px-4 py-3 space-y-4">
                                                    
                                                    {/* Option 1: Credit Card */}
                                                    <div className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer ${formData.paymentMethod === 'CREDIT_CARD' ? 'border-primary ring-2 ring-primary' : 'border-[#dbe2e6] dark:border-gray-600'}`}
                                                         onClick={() => handlePaymentChange('CREDIT_CARD')}>
                                                        <input 
                                                            checked={formData.paymentMethod === 'CREDIT_CARD'} 
                                                            readOnly
                                                            className="form-radio h-4 w-4 text-primary focus:ring-primary"
                                                            type="radio" 
                                                        />
                                                        <label className="flex-1 text-[#111618] dark:text-gray-300 font-medium cursor-pointer">Credit Card</label>
                                                        <div className="flex items-center gap-2">
                                                            {/* Ảnh minh họa thẻ */}
                                                            <span className="text-xs font-bold text-gray-500">VISA/MASTER</span>
                                                        </div>
                                                    </div>

                                                    {/* Form nhập thẻ (Chỉ hiện khi chọn Credit Card) - Chỉ là giao diện giả lập cho đẹp */}
                                                    {formData.paymentMethod === 'CREDIT_CARD' && (
                                                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-[#dbe2e6] dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                                                            <div className="col-span-full">
                                                                <input className="form-input w-full rounded-lg border border-gray-300 p-3" placeholder="Số thẻ (Demo - Không lưu)" disabled />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Option 2: PayPal */}
                                                    <div className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer ${formData.paymentMethod === 'PAYPAL' ? 'border-primary ring-2 ring-primary' : 'border-[#dbe2e6] dark:border-gray-600'}`}
                                                         onClick={() => handlePaymentChange('PAYPAL')}>
                                                        <input 
                                                            checked={formData.paymentMethod === 'PAYPAL'} 
                                                            readOnly
                                                            className="form-radio h-4 w-4 text-primary focus:ring-primary"
                                                            type="radio" 
                                                        />
                                                        <label className="flex-1 text-[#111618] dark:text-gray-300 font-medium cursor-pointer">PayPal</label>
                                                    </div>

                                                    {/* Option 3: COD (Thanh toán khi nhận hàng) */}
                                                    <div className={`flex items-center gap-4 rounded-lg border p-4 cursor-pointer ${formData.paymentMethod === 'COD' ? 'border-primary ring-2 ring-primary' : 'border-[#dbe2e6] dark:border-gray-600'}`}
                                                         onClick={() => handlePaymentChange('COD')}>
                                                        <input 
                                                            checked={formData.paymentMethod === 'COD'} 
                                                            readOnly
                                                            className="form-radio h-4 w-4 text-primary focus:ring-primary"
                                                            type="radio" 
                                                        />
                                                        <label className="flex-1 text-[#111618] dark:text-gray-300 font-medium cursor-pointer">Thanh toán khi nhận hàng (COD)</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cột phải: Tổng đơn hàng & Nút đặt hàng */}
                                    <div className="lg:col-span-1">
                                        <div className="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] dark:border-gray-700 sticky top-24">
                                            <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                                                Đơn hàng của bạn</h2>
                                            
                                            {/* Component CartSummary giữ nguyên */}
                                            <CartSummary showPaymentSection={true} />
                                            
                                            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                                            
                                            <button
                                                onClick={handleCheckout}
                                                disabled={loading}
                                                className={`w-full mt-8 flex items-center justify-center rounded-lg h-14 text-white text-lg font-bold leading-normal tracking-[0.015em] transition-all
                                                    ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}>
                                                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
                                            </button>
                                        </div>
                                        
                                        <div className="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] dark:border-gray-700">
                                            <h2 className="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                                                Những voucher đang có</h2>
                                            <Voucher />
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
    )
}