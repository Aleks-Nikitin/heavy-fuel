"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import ReviewModal from "./review-modal";

interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date | string;
  user?: {
    name: string;
  };
}

export default function Reviews({
  reviews,
  productId,
  productName,
}: {
  reviews: Review[];
  productId: string;
  productName: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(
          1,
        )
      : "0.0";
  const handleWriteReview = () => {
    if (!session?.user) {
      router.push("/auth");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <section className="w-full py-16 mt-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3 flex flex-col gap-4 md:sticky top-24">
            <h2 className="text-center text-2xl font-black uppercase text-white tracking-tight">
              Customer Reviews
            </h2>

            <div className="flex justify-center items-end gap-4 mt-2">
              <span className="text-6xl font-black text-white leading-none">
                {averageRating}
              </span>
              <div className="flex flex-col gap-1 pb-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(Number(averageRating))
                          ? "fill-[#CCFF00] text-[#CCFF00]"
                          : "fill-transparent text-white/20"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[#8E8E93] text-sm uppercase font-bold tracking-wider">
                  Based on {totalReviews} reviews
                </span>
              </div>
            </div>

            <button
              onClick={handleWriteReview}
              className="mt-6 w-full py-4 rounded-xl border border-white/15 bg-[#13161C] text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors"
            >
              Write a Review
            </button>
          </div>

          <div className="w-full md:w-2/3 flex flex-col gap-6">
            {totalReviews === 0 ? (
              <p className="text-[#8E8E93] text-center py-12 border border-dashed border-white/10 rounded-3xl">
                No reviews yet. Be the first to leave one!
              </p>
            ) : (
              reviews.map((review) => {
                const authorName = review.user?.name || "Anonymous User";
                const formattedDate = new Date(
                  review.createdAt,
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={review.id}
                    className="p-6 md:p-8 rounded-3xl bg-[#13161C] border border-white/5 flex flex-col gap-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating
                                  ? "fill-[#CCFF00] text-[#CCFF00]"
                                  : "fill-transparent text-white/20"
                              }`}
                            />
                          ))}
                        </div>
                        <h3 className="text-white font-bold text-lg">
                          {review.title}
                        </h3>
                      </div>
                      <span className="text-[#8E8E93] text-sm font-semibold whitespace-nowrap">
                        {formattedDate}
                      </span>
                    </div>

                    <p className="text-[#8E8E93] leading-relaxed">
                      {review.body}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-8 h-8 rounded-full bg-[#0B0D10] border border-white/10 flex items-center justify-center text-white font-bold text-sm uppercase">
                        {authorName.charAt(0)}
                      </span>
                      <span className="text-white font-bold text-sm uppercase tracking-wider">
                        {authorName}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
