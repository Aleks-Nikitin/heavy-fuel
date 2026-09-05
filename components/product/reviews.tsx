import { Star } from "lucide-react";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Marcus T.",
    date: "Aug 28, 2026",
    rating: 5,
    title: "Best tasting protein on the market.",
    body: "Mixes perfectly with no clumps. The chocolate flavor isn't overly sweet like other brands. Noticed a solid difference in my recovery times since switching to the HeavyFuel stack.",
  },
  {
    id: 2,
    author: "David L.",
    date: "Aug 15, 2026",
    rating: 5,
    title: "Heavy duty and reliable.",
    body: "Clinical dosing is exactly what I was looking for. No proprietary blends, just straight performance. Will be subscribing.",
  },
  {
    id: 3,
    author: "Sarah J.",
    date: "Jul 10, 2026",
    rating: 4,
    title: "Great results, shipping was a day late.",
    body: "The product itself is 10/10. Easily the best formula I've used. Giving 4 stars just because FedEx delayed my package by a day, but the HeavyFuel team was super responsive.",
  },
];

export default function Reviews() {
  const averageRating = 4.8;
  const totalReviews = 124;

  return (
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
                      star <= Math.round(averageRating)
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

          <button className="mt-6 w-full py-4 rounded-xl border border-white/15 bg-[#13161C] text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
            Write a Review
          </button>
        </div>
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {MOCK_REVIEWS.map((review) => (
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
                  {review.date}
                </span>
              </div>

              <p className="text-[#8E8E93] leading-relaxed">{review.body}</p>

              <div className="flex items-center gap-2 mt-2">
                <span className="w-8 h-8 rounded-full bg-[#0B0D10] border border-white/10 flex items-center justify-center text-white font-bold text-sm">
                  {review.author.charAt(0)}
                </span>
                <span className="text-white font-bold text-sm uppercase tracking-wider">
                  {review.author}
                </span>
                <span className="text-[#CCFF00] text-xs font-bold uppercase tracking-widest ml-2 flex items-center gap-1">
                  ✓ Verified Buyer
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
