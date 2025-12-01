import Header from '../../component/customer/header'
import Footer from '../../component/customer/footer'
import ProductOption from '../../component/customer/product-option';

export default function Product() {
    return (
        <div class="bg-white dark:bg-background-dark font-display text-text-color">
            <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div class="layout-container flex h-full grow flex-col">
                    <div class="layout-content-container flex flex-col w-full flex-1">
                        <Header />
                        <main class="flex-grow px-4 md:px-10 lg:px-40 py-5 mt-20">
                            <section class="px-4 md:px-10 lg:px-40 py-5">
                                <div class="flex flex-wrap justify-between gap-3 p-4">
                                    <p class="text-4xl font-black leading-tight tracking-[-0.033em] min-w-72 text-[#111618] dark:text-white">
                                        Our Fresh Milk Selection</p>
                                </div>
                            </section>
                            <ProductOption />
                        </main >
                        <Footer />
                    </div >
                </div >
            </div >
        </div >
    )
}