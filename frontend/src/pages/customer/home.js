
import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import BestSellingProduct from '../../component/customer/best-seller';
import Explore from '../../component/customer/explore';

export default function Home() {

  return (
    <div className="bg-white font-sans text-[#333]">
      <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">
        <div className="flex h-full grow flex-col">
          <Header />

          <main className="flex-1">
            <section className="w-full">
              <div className="relative w-full h-[600px] bg-cover bg-center bg-no-repeat"
                // style={{
                //   backgroundImage: `url("/images/fresh-milk-is-the-best.png")`,
                // }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c7e]/80 to-transparent flex items-center">
                  <div className="container mx-auto px-4 md:px-10 lg:px-20">
                    <div className="max-w-2xl text-white space-y-6">
                      <span className="text-lg font-medium tracking-wide uppercase text-blue-200">
                        Nguồn dinh dưỡng thuần khiết
                      </span>
                      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                        Vươn Cao Việt Nam
                      </h1>
                      <p className="text-lg opacity-90 max-w-lg">
                        Mang đến nguồn sữa tươi 100% thiên nhiên, giàu dưỡng chất cho sự phát triển toàn diện của gia đình bạn.
                      </p>
                      <button className="bg-white text-[#1a3c7e] px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg mt-4">
                        Mua Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-16 bg-white">
              <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="text-center mb-12">
                  <h2 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3">
                    Danh Mục Sản Phẩm
                  </h2>
                  <div className="w-24 h-1 bg-[#1a3c7e] mx-auto rounded-full"></div>
                </div>
                <Explore />
              </div>
            </section>

            <section className="py-16 bg-[#f4f7fc]">
              <div className="container mx-auto px-4 md:px-10 lg:px-20">
                <div className="flex justify-between items-end mb-10 px-2">
                  <div>
                    <h2 className="text-[#1a3c7e] text-3xl md:text-4xl font-bold uppercase tracking-wide mb-2">
                      Sản Phẩm Bán Chạy
                    </h2>
                    <p className="text-gray-600">Sự lựa chọn hàng đầu của hàng triệu gia đình Việt</p>
                  </div>
                  <button className="hidden md:block text-[#1a3c7e] font-semibold hover:underline">
                    Xem tất cả &rarr;
                  </button>
                </div>
                <BestSellingProduct />
              </div>
            </section>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
