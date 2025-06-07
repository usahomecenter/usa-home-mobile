import { Review } from "@shared/schema";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/ui/star-rating";

interface ReviewSummaryProps {
  reviews: Review[];
}

export function ReviewSummary({ reviews }: ReviewSummaryProps) {
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const avgRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Calculate rating distribution
  const ratingDistribution = Array(5).fill(0);
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingDistribution[review.rating - 1]++;
    }
  });

  return (
    <div className="bg-white rounded-md p-4 mb-6">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <div className="text-3xl font-bold text-primary">
            {avgRating.toFixed(1)}
          </div>
          <StarRating rating={avgRating} size={16} />
          <div className="text-sm text-neutral-light mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </div>
        </div>
        
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating - 1];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            
            return (
              <div key={`rating-${rating}`} className="flex items-center mb-1 text-sm">
                <div className="w-8">{rating}</div>
                <Progress value={percentage} className="h-2 flex-1 mx-2" />
                <div className="w-8 text-right">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-sm">
        <span className="font-medium">Top Keywords: </span>
        {countKeywords(reviews).map(([keyword, count], index) => (
          <span
            key={keyword}
            className="inline-block bg-primary-light/10 text-primary-dark rounded-full px-2 py-1 mr-2 mb-2"
          >
            {keyword} ({count})
          </span>
        ))}
      </div>
    </div>
  );
}

// Helper function to extract and count common keywords from reviews
function countKeywords(reviews: Review[]): [string, number][] {
  const commonWords = [
    "professional", "quality", "responsive", "helpful", "knowledgeable",
    "efficient", "reliable", "excellent", "recommend", "punctual",
    "friendly", "affordable", "skilled", "thorough", "creative"
  ];
  
  const keywordCounts: Record<string, number> = {};
  
  reviews.forEach((review) => {
    if (!review.comment) return;
    
    const words = review.comment.toLowerCase().split(/\W+/);
    
    words.forEach((word) => {
      if (commonWords.includes(word) && word.length > 3) {
        keywordCounts[word] = (keywordCounts[word] || 0) + 1;
      }
    });
  });
  
  // Sort by count and take top 5
  return Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
}