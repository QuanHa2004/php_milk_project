import Header from "../../component/customer/header"
import Footer from "../../component/customer/footer"

export default function SearchResults() {
    return (
        <div class="bg-white dark:bg-background-dark font-display text-text-color">
            <div class="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
                <div class="layout-container flex h-full grow flex-col">
                    <Header/>
                    <main class="px-4 md:px-10 lg:px-20 py-5 flex-1 mt-10">
                        <div class="layout-content-container flex flex-col max-w-7xl mx-auto">
                            <div class="flex flex-wrap justify-between items-center gap-3 p-4">
                                <p class="text-text-main dark:text-white text-3xl font-bold leading-tight tracking-tight">
                                    Showing results for 'Milk'</p>
                            </div>
                            <div class="flex gap-3 p-4 overflow-x-auto">
                                <button
                                    class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 hover:bg-primary-subtle dark:hover:bg-primary/30">
                                    <p class="text-text-main dark:text-white text-sm font-medium leading-normal">Sort by:
                                        Relevance</p>
                                    <span
                                        class="material-symbols-outlined text-text-secondary dark:text-gray-400">expand_more</span>
                                </button>
                                <button
                                    class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 hover:bg-primary-subtle dark:hover:bg-primary/30">
                                    <p class="text-text-main dark:text-white text-sm font-medium leading-normal">Filter by Brand
                                    </p>
                                    <span
                                        class="material-symbols-outlined text-text-secondary dark:text-gray-400">expand_more</span>
                                </button>
                                <button
                                    class="flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 hover:bg-primary-subtle dark:hover:bg-primary/30">
                                    <p class="text-text-main dark:text-white text-sm font-medium leading-normal">Filter by Type
                                    </p>
                                    <span
                                        class="material-symbols-outlined text-text-secondary dark:text-gray-400">expand_more</span>
                                </button>
                            </div>
                            <div class="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6 p-4">
                                <div
                                    class="flex flex-col gap-4 pb-4 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary-subtle dark:hover:border-primary/50 transition-all duration-300">
                                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover"
                                        data-alt="A carton of Organic Valley Milk"
                                        style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAvXYoos-4bd-VGQLf3-2jEaMUAwT8ohMPXwLoeHCbK75dM7PaTstL1An0SEIIV1FphdyxS7tkjuqNzVHDb9-s7nbWm09RgsMc12N02_Z6QKuliuOhMlt81g1smPMXaRmqBEqJ9CTfvg-J0tCF1sd2Z1ndJYc1vNE2N3ZOxW0uN2q9KJ8HcUUW0uIDBUzDmPJJL0p3b5ZuPXs4QwRjUJSxIs1ZldN-Oz2SQczVCkXzc5B26SozJp8n6sKgDYbO0A2KEiAe-z7PKhfg")`}}>
                                    </div>
                                    <div class="px-4 flex flex-col gap-2">
                                        <span class="text-text-main dark:text-white text-base font-semibold leading-normal hover:text-primary"
                                            href="san_pham.html">Organic Valley Milk</span>
                                        <p class="text-text-secondary text-sm font-normal leading-normal">Organic Valley</p>
                                        <p class="text-text-main dark:text-white text-lg font-bold leading-normal">$4.99</p>
                                    </div>
                                    <div class="px-4 pb-2">
                                        <button
                                            class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                                            <span class="truncate">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-col gap-4 pb-4 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary-subtle dark:hover:border-primary/50 transition-all duration-300">
                                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover"
                                        data-alt="A carton of Horizon Organic Milk"
                                        style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuB4p0Fdgrxcpr0B8TpBANCSwT-lWC7dF4lrpCb1DILsoK8nKelaO0g7Gj5RrkqLMUZA5YdJgEhZqL-PX5vj0ZloO4tQGnTrVAOmIUIAY7WbMqqF4z7fw5FHVk01SRhW4LSibfGrpJcq2QqpC1UgTFm0tpxMdsFYKAbueMkvjP_JNJu3CCCy3aaAHP9AtVOYjjTKJKYXoxr_CtSiP8whLnqXast9yFPOUXWUBIcqxSh7Vyd_rrwmWnPNheIbxpqGudbtO4tJ6qnnzhw")`}}>
                                    </div>
                                    <div class="px-4 flex flex-col gap-2">
                                        <span class="text-text-main dark:text-white text-base font-semibold leading-normal hover:text-primary"
                                            href="san_pham.html">Horizon Organic Milk</span>
                                        <p class="text-text-secondary text-sm font-normal leading-normal">Horizon Organic</p>
                                        <p class="text-text-main dark:text-white text-lg font-bold leading-normal">$5.29</p>
                                    </div>
                                    <div class="px-4 pb-2">
                                        <button
                                            class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                                            <span class="truncate">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-col gap-4 pb-4 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary-subtle dark:hover:border-primary/50 transition-all duration-300">
                                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover"
                                        data-alt="A carton of Stonyfield Organic Milk"
                                        style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuAq7gkGrT3qtvj4V5-76S4dClzeScxOjS1kJMmY46qMQOYatFwvMyBHa1DmGmDN7hV7XV1DlyFU-W5vI_ZQKfuX-zqqGqULP4X73uSDYIOidW3gKQtGDQbZplQoIi2urUbZ6wf3Ez7XVEqRZdFAlPv-UF6SDM1LLWif66GReS9vD0AnTYDgL-KGnETtgWI0MDEEMvMCmMibhPYKgOno4VzNQgdnvKYDvVukBS-6rytQQKkFAthITZJp-ip4DBAj0-dPZENRUpenPfQ")`}}>
                                    </div>
                                    <div class="px-4 flex flex-col gap-2">
                                        <span class="text-text-main dark:text-white text-base font-semibold leading-normal hover:text-primary"
                                            href="san_pham.html">Stonyfield Organic Milk</span>
                                        <p class="text-text-secondary text-sm font-normal leading-normal">Stonyfield</p>
                                        <p class="text-text-main dark:text-white text-lg font-bold leading-normal">$4.79</p>
                                    </div>
                                    <div class="px-4 pb-2">
                                        <button
                                            class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                                            <span class="truncate">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                                <div
                                    class="flex flex-col gap-4 pb-4 rounded-xl overflow-hidden group border border-gray-200 dark:border-gray-800 hover:shadow-lg hover:border-primary-subtle dark:hover:border-primary/50 transition-all duration-300">
                                    <div class="w-full bg-center bg-no-repeat aspect-square bg-cover"
                                        data-alt="A carton of Maple Hill Creamery Milk"
                                        style={{backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBaRNKLMA-mOZeYo112V_UOXGsho9vzf_aEcjRAOFKx8FQuCeQkS0vaI8Zx2J2m5nXvHfwA0pYxOOH9kssAp3AMTJFbYyFWXbrByxFSGsNYyp6RLZdnyLTiZaLfWfPz0XO_y4DnyVJLcUKg8HKK-RsKqUDhydtCtTaGbJuCt-xBASM7_UYmK8QfUBf3cDX-Sc1xHSUrxkj8XJ9OxaMmTvg3QVvZeHZtq5obPkVAdJZh8ShT_SNCfLCRhyccfSA_Nwr-0YIUDcujszc")`}}>
                                    </div>
                                    <div class="px-4 flex flex-col gap-2">
                                        <span class="text-text-main dark:text-white text-base font-semibold leading-normal hover:text-primary"
                                            href="san_pham.html">Maple Hill Creamery Milk</span>
                                        <p class="text-text-secondary text-sm font-normal leading-normal">Maple Hill Creamery
                                        </p>
                                        <p class="text-text-main dark:text-white text-lg font-bold leading-normal">$6.99</p>
                                    </div>
                                    <div class="px-4 pb-2">
                                        <button
                                            class="flex w-full items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-blue-700 transition-colors">
                                            <span class="truncate">Add to Cart</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer/>
                </div>
            </div>
        </div>
    )
}