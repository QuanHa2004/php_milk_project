import { useState, useEffect } from "react";

export default function ReviewSection({ product_id, currentVariant }) {
    const [reviews, setReviews] = useState([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const fetchReviews = () => {
        if (!product_id || !currentVariant?.variant_id) return;

        fetch(`http://localhost:8000/reviews/${product_id}/${currentVariant.variant_id}`)
            .then(res => res.json())
            .then(data => {
                setReviews(data.data || []);
            })
            .catch(err => console.error("Lỗi tải đánh giá:", err));
    };

    useEffect(() => {
        fetchReviews();
    }, [product_id, currentVariant?.variant_id]);

    const handleSubmitReview = async () => {
        if (!rating) {
            alert("Vui lòng chọn số sao đánh giá");
            return;
        }

        if (!currentVariant) {
            alert("Vui lòng chọn biến thể sản phẩm");
            return;
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Vui lòng đăng nhập để đánh giá");
            return;
        }

        try {
            setIsSubmittingReview(true);

            const res = await fetch("http://localhost:8000/reviews/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    variant_id: currentVariant.variant_id,
                    rating: rating,
                    comment: comment,
                }),
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                throw new Error(data.message || "Gửi đánh giá thất bại");
            }

            fetchReviews();

            alert("Cảm ơn bạn đã đánh giá sản phẩm");

            setRating(0);
            setComment("");

        } catch (err) {
            console.error(err);
            alert(err.message);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    return (
        <div className="mt-14">
            <h3 className="text-[#333333] dark:text-white text-xl font-bold border-b-2 border-gray-200 dark:border-gray-700 pb-2 mb-6">
                Đánh giá sản phẩm
            </h3>

            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-100 dark:border-gray-700 mb-8">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={star <= rating ? "currentColor" : "none"}
                                stroke="currentColor"
                                onClick={() => setRating(star)}
                                className="w-6 h-6 text-yellow-400 cursor-pointer hover:scale-110 transition-transform"
                            >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                        ))}
                    </div>


                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                    ></textarea>


                    <button
                        onClick={handleSubmitReview}
                        disabled={isSubmittingReview}
                        className="self-end bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 active:scale-95 transition disabled:opacity-60"
                    >
                        Gửi đánh giá
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div
                            key={review.review_id}
                            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-gray-800 dark:text-white">
                                        {review.full_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(review.created_at).toLocaleDateString("vi-VN")}
                                    </p>
                                </div>

                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <svg
                                            key={s}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill={s <= review.rating ? "currentColor" : "none"}
                                            stroke="currentColor"
                                            className="w-4 h-4 text-yellow-400"
                                        >
                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">
                        Chưa có đánh giá nào cho sản phẩm này
                    </p>
                )}

            </div>
        </div>
    )
}