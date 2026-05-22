// src/components/product/ProductReviews.tsx
import { useState } from "react";
import { Star, Loader2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import { useAppSelector } from "../../store/hooks";
import { useGetReviewsQuery, useAddReviewMutation } from "../../store/api/userApi";

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: reviewsResponse, isLoading } = useGetReviewsQuery(productId);
  const [addReview, { isLoading: isSubmitting }] = useAddReviewMutation();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState("");

  const reviews = reviewsResponse?.data || [];

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      toast.error("Please provide both a rating and a comment.");
      return;
    }

    try {
      await addReview({ productId, data: { rating, comment } }).unwrap();
      toast.success("Review submitted successfully. It may be pending approval.");
      setRating(5);
      setComment("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to submit review.");
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-16">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Summary & Add Review Form */}
        <div className="md:w-1/3">
          <h3 className="font-display text-2xl text-gray-900 mb-6">Customer Reviews</h3>
          
          <div className="flex items-end gap-4 mb-8">
            <span className="font-display text-5xl text-gray-900">{averageRating}</span>
            <div className="flex flex-col pb-1">
              <div className="flex text-black mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Based on {reviews.length} reviews
              </span>
            </div>
          </div>

          {user ? (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 border border-gray-100 mt-8">
              <h4 className="text-xs font-bold uppercase tracking-widest text-black mb-4">Write a Review</h4>
              
              <div className="mb-4">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-6 h-6 transition-colors ${star <= rating ? 'text-black fill-current' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Your Experience</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={4}
                  placeholder="Tell us what you think..."
                  className="w-full border border-gray-300 p-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Submit Review"}
              </Button>
            </form>
          ) : (
            <div className="bg-gray-50 p-6 border border-gray-100 mt-8 text-center">
              <p className="text-sm text-gray-600 mb-4">You must be logged in to write a review.</p>
              <Button variant="outline" className="w-full uppercase text-[10px]" onClick={() => window.location.href = '/auth'}>
                Log In to Review
              </Button>
            </div>
          )}
        </div>

        {/* Right Column: Reviews List */}
        <div className="md:w-2/3">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">No reviews yet.</p>
              <p className="text-xs text-gray-400 mt-1">Be the first to share your thoughts.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review: any) => (
                <div key={review._id} className="p-6 border border-gray-100 bg-white">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm uppercase tracking-widest text-gray-900">
                          {review.userId?.name || "Anonymous User"}
                        </p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">
                          {new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex text-black">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed font-sans">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};