"use client";

import { useState, useEffect } from "react";
import { X, Star, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { createReviewByProductId } from "@/lib/actions/product-actions";

type ReviewModalProps = {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function ReviewModal({
  productId,
  productName,
  isOpen,
  onClose,
}: ReviewModalProps) {
  const { data: session } = useSession();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      toast.error("You must be logged in to leave a review.");
      return;
    }

    if (!title.trim() || !body.trim() || rating === 0) {
      toast.error("Please provide a rating, title, and review.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createReviewByProductId(productId, {
        rating,
        title,
        body,
      });

      toast.success("Review submitted successfully!");
      setBody("");
      setTitle("");
      setRating(0);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0B0D10] border border-white/10 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#13161C]">
          <div>
            <h2 className="text-xl font-black uppercase text-white tracking-tight">
              Write a Review
            </h2>
            <p className="text-xs text-[#8E8E93] font-bold uppercase tracking-wider mt-1">
              For {productName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 flex flex-col gap-6">
          <div className="flex flex-col gap-2 items-center justify-center py-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8E8E93]">
              Overall Rating
            </span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    size={36}
                    className={`transition-all ${
                      star <= (hoverRating || rating)
                        ? "fill-[#CCFF00] text-[#CCFF00]"
                        : "fill-transparent text-white/20"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-2 block">
              Review Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience..."
              className="w-full bg-[#13161C] border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#CCFF00] transition-colors font-bold"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#8E8E93] mb-2 block">
              Review Details
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="How did the product perform? How was the taste/fit?"
              rows={4}
              className="w-full bg-[#13161C] border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:border-[#CCFF00] transition-colors resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || rating === 0 || !title || !body}
            className="w-full py-4 mt-2 rounded-xl bg-[#CCFF00] text-black font-black uppercase tracking-wider hover:bg-[#b3e600] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
