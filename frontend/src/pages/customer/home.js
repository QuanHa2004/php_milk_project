import { useNavigate } from 'react-router-dom';

import Header from '../../component/customer/header';
import Footer from '../../component/customer/footer';
import BestSellingProduct from '../../component/customer/best-seller';
import Explore from '../../component/customer/explore';

export default function Home() {
  const navigate = useNavigate();
  return (
    <div class="bg-white dark:bg-background-dark font-display text-text-color">
      <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div class="layout-container flex h-full grow flex-col">
          <Header />
          <main class="flex-1 mt-10">
            <section class="px-4 md:px-10 lg:px-40 py-5">
              <div class="@container">
                <div class="@[480px]">
                  <div class="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center"
                    data-alt="A picturesque farm scene with cows grazing in a green pasture under a clear blue sky."
                    style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.pixabay.com/photo/2017/10/28/06/48/cow-2896329_1280.jpg")` }}>
                    <div class="flex flex-col gap-2 text-center">
                      <h1 class="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-6xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                        Fresh Milk
                      </h1>
                      <h2 class="text-white text-lg font-normal leading-normal @[480px]:text-xl @[480px]:font-normal @[480px]:leading-normal">Ghé thăm cửa hàng của chúng tôi</h2>
                    </div>
                    <button
                      class="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 @[480px]:h-14 @[480px]:px-6 bg-secondary text-white text-base font-bold leading-normal tracking-[0.015em] @[480px]:text-lg @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em] hover:bg-opacity-90 transition-opacity">
                      <button onClick={() => navigate('/products')}><span class="truncate">Mua ngay</span></button>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section class="px-4 md:px-10 lg:px-40 py-10">
              <h2
                class="text-text-color text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-5 pt-5 text-center">
                Khám phá nhiều thể loại sản phẩm</h2>
              <div><Explore /></div>
            </section>
            <section class="px-4 md:px-10 lg:px-40 py-10">
              <h2
                class="text-text-color text-3xl font-bold leading-tight tracking-[-0.015em] px-4 pb-5 pt-5 text-center">
                Sản phẩm bán chạy</h2>
              <div><BestSellingProduct /></div>
            </section>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  )
}
