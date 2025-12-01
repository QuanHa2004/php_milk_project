import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import CartSummary from '../../component/customer/cart-summary';
import Voucher from '../../component/customer/voucher';

export default function Checkout() {
    return (
        <div class="bg-white dark:bg-background-dark font-display text-text-color">
            <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div class="layout-container flex h-full grow flex-col">
                    <div class="layout-content-container flex flex-col w-full flex-1">
                        <Header />
                        <main class="flex-1 px-4 sm:px-6 lg:px-10 py-8 mt-10">
                            <section class="px-4 md:px-10 lg:px-40 py-5">
                                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div class="lg:col-span-2">
                                        <div class="space-y-8">
                                            <div>
                                                <h2
                                                    class="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                                                    Địa chỉ giao hàng</h2>
                                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4 py-3">
                                                    <div class="col-span-full">
                                                        <label class="flex flex-col w-full">
                                                            <p
                                                                class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                Tên của bạn</p>
                                                            <input
                                                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="Nhập tên của bạn" type="text" />
                                                        </label>
                                                    </div>
                                                    <div class="col-span-full">
                                                        <label class="flex flex-col w-full">
                                                            <p
                                                                class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                Địa chỉ 1</p>
                                                            <input
                                                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                    <div class="col-span-full">
                                                        <label class="flex flex-col w-full">
                                                            <p
                                                                class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                Địa chỉ 2 (nếu có)</p>
                                                            <input
                                                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                    <div>
                                                        <label class="flex flex-col w-full">
                                                            <p
                                                                class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                Thành phố</p>
                                                            <input
                                                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                    <div class="sm:col-span-2">
                                                        <label class="flex flex-col w-full">
                                                            <p
                                                                class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                Mã Zip</p>
                                                            <input
                                                                class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                placeholder="" type="text" />
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h2
                                                    class="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5 flex items-center gap-2">
                                                    Phương thức thanh toán
                                                    <span class="material-symbols-outlined text-xl text-gray-400">lock</span>
                                                </h2>
                                                <div class="px-4 py-3 space-y-4">
                                                    <div
                                                        class="flex items-center gap-4 rounded-lg border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark p-4 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                                                        <input checked="" class="form-radio h-4 w-4 text-primary focus:ring-primary"
                                                            id="creditCard" name="paymentMethod" type="radio" />
                                                        <label class="flex-1 text-[#111618] dark:text-gray-300 font-medium"
                                                            for="creditCard">Credit Card</label>
                                                        <div class="flex items-center gap-2">
                                                            <img alt="Visa" class="h-6"
                                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDO1L66OZ_J_6kj2ZiQLAUaCE5ZNSp0N_-xGGlCG-fiEc69SVjmKVzCcdoQGrJG9LuUnplIgqGfK_guSfL9hnF2lPvYwu1NvGtxn9ZciUk8YJsn3GTiwydasfz3KXsEP0TFaJQJwegN2_Z-WKHjBtsXnVHf-3QBXYqKMae0ZJ4NWOxI21_8mG1Nar4yDECDTPDBl5XSPRHtidvZ5el-JQXa5Si7dg0kRQabPi-IxZOWU_DVqbmABgMEIlvC7n4poToQkvSmnROK2go" />
                                                            <img alt="Mastercard" class="h-6"
                                                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuApRtPYA1ibw1M1TuayUsdK4W3Xs-a--Spds1NSikzVfGhTm58tMVXS3N86nNfo0dZClTOHWmChR80A5dD6doPFIlYch4H9TYBdcqwDocTHOUf_oi_Og-fMi3WBSD25aMVKx4tgqk5ZYSUhW3bBl93s3knK0y1ep58ia3zug2f8SxI2xBcuBnNNKt7YiBA4Sb2FrDX-EMHbrZNL1AY-EOg-iWNS1cCDMBHGzYrvH9ZS0M958teQ9YZVwASlhV6S00ZurPPMDphap-0" />
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 border border-[#dbe2e6] dark:border-gray-600 rounded-lg">
                                                        <div class="col-span-full">
                                                            <label class="flex flex-col w-full">
                                                                <p
                                                                    class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                    Số thẻ</p>
                                                                <input
                                                                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                    placeholder="" type="text" />
                                                            </label>
                                                        </div>
                                                        <div class="col-span-2">
                                                            <label class="flex flex-col w-full">
                                                                <p
                                                                    class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                    Ngày hết hạn</p>
                                                                <input
                                                                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                    placeholder="MM / YY" type="text" />
                                                            </label>
                                                        </div>
                                                        <div class="col-span-2">
                                                            <label class="flex flex-col w-full">
                                                                <p
                                                                    class="text-[#111618] dark:text-gray-300 text-base font-medium leading-normal pb-2">
                                                                    CVC</p>
                                                                <input
                                                                    class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111618] dark:text-white focus:outline-0 focus:ring-0 border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark focus:border-primary dark:focus:border-primary h-14 placeholder:text-[#617c89] p-[15px] text-base font-normal leading-normal"
                                                                    placeholder="123" type="text" />
                                                            </label>
                                                        </div>
                                                    </div>
                                                    <div
                                                        class="flex items-center gap-4 rounded-lg border border-[#dbe2e6] dark:border-gray-600 bg-white dark:bg-background-dark p-4 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary">
                                                        <input class="form-radio h-4 w-4 text-primary focus:ring-primary"
                                                            id="paypal" name="paymentMethod" type="radio" />
                                                        <label class="flex-1 text-[#111618] dark:text-gray-300 font-medium"
                                                            for="paypal">PayPal</label>
                                                        <img alt="PayPal" class="h-6"
                                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdngoCRsUsz2DV1GVRNnnGbC5iNbFrtkovemlMhAS1J8n8hlLyihmKfhcWjaPzMeZuv97ZIUOJOuUYGSZXhQkPQH2bJocwHi2lFHfID-LzggNKnEhJaM0bNINZBS0HL41SYZ2ZDk_UKxqWmf5yrllSlPc4lPfdjy89JRJIp0LGZdJ7qSFyVvxkLQAjTawvMYNp8DkNDAdVKOGH67hJSXbOTriHrhyNAJ_4lcnRtFIyD_7nC_4WQFd5ii9IiTbjJv5_VTxOcmL4cwI" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="lg:col-span-1">
                                        <div
                                            class="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] dark:border-gray-700">
                                            <h2
                                                class="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
                                                Đơn hàng của bạn</h2>
                                            <CartSummary showPaymentSection={true} />
                                            <button
                                                class="w-full mt-8 flex items-center justify-center rounded-lg h-14 bg-primary text-white text-lg font-bold leading-normal tracking-[0.015em]">
                                                Đặt hàng</button>
                                        </div>
                                        <div
                                            class="mt-8 bg-white dark:bg-background-dark/50 rounded-xl p-6 border border-[#dbe2e6] dark:border-gray-700">
                                            <h2
                                                class="text-[#111618] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em] mb-6">
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