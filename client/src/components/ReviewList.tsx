import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Review } from "@shared/schema";
import { StarRating } from "@/components/ui/star-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { ProfessionalResponseForm } from "@/components/ProfessionalResponseForm";
import { useLanguage } from "@/hooks/useLanguage";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, X, Check } from "lucide-react";

interface ReviewListProps {
  professionalId: number;
}

export function ReviewList({ professionalId }: ReviewListProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for review editing/deleting
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editResponseText, setEditResponseText] = useState<string>("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<number | null>(null);
  
  const { data: reviews, isLoading, error } = useQuery<Review[]>({
    queryKey: ["/api/professionals", professionalId, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/professionals/${professionalId}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
  });
  
  // Check if the current user is the professional whose profile is being viewed
  const isOwnProfile = user?.id === professionalId && user?.isProfessional;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="mb-4">
            <CardHeader className="pb-2">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 rounded-md mb-4">
        Failed to load reviews: {error.message}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-md text-neutral-light">
        {t('no_reviews_yet')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="mb-4">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg font-medium">
                  {/* Show reviewer name based on whether it's a guest or authenticated user */}
                  {review.guestName 
                    ? review.guestName 
                    : review.reviewerId
                      ? `${t('reviewer')} #${review.reviewerId}`
                      : t('anonymous')}
                </CardTitle>
                <p className="text-sm text-neutral-light">
                  {review.createdAt ? formatDistanceToNow(new Date(review.createdAt), { addSuffix: true }) : t('recently')}
                </p>
              </div>
              <StarRating rating={review.rating} size={16} />
            </div>
            
            {/* Add review action buttons for professionals viewing their own profile */}
            {isOwnProfile && (
              <div className="flex gap-2 mt-2">
                {!review.professionalResponse && (
                  <button 
                    className="text-xs text-primary hover:text-primary-dark flex items-center"
                    onClick={() => {
                      // Set the review to respond to in a state variable
                      window.location.href = `#respond-${review.id}`;
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    {t('respond')}
                  </button>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-neutral">{review.comment}</p>
            {review.verified && (
              <div className="flex items-center mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('verified_review')}
                </span>
              </div>
            )}
            
            {/* Display professional response if it exists */}
            {review.professionalResponse && editingReviewId !== review.id && (
              <div className="mt-4 bg-blue-50 p-3 rounded">
                <p className="font-semibold text-sm text-primary">{t('professional_response')}:</p>
                <p className="text-sm mt-1">{review.professionalResponse}</p>
                
                {isOwnProfile && (
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      className="text-xs text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        setEditingReviewId(review.id);
                        setEditResponseText(review.professionalResponse || "");
                      }}
                    >
                      {t('edit_button')}
                    </button>
                    <button 
                      className="text-xs text-red-600 hover:text-red-800"
                      onClick={() => setConfirmingDeleteId(review.id)}
                    >
                      {t('delete_button')}
                    </button>
                  </div>
                )}
                
                {/* Delete confirmation UI */}
                {confirmingDeleteId === review.id && (
                  <div className="mt-3 p-2 border border-red-200 bg-red-50 rounded-md">
                    <p className="text-sm text-red-700 mb-2">{t('delete_response_confirm')}</p>
                    <div className="flex justify-end gap-2">
                      <button 
                        className="px-2 py-1 text-xs bg-gray-200 rounded-md hover:bg-gray-300"
                        onClick={() => setConfirmingDeleteId(null)}
                      >
                        {t('cancel_button')}
                      </button>
                      <button 
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded-md hover:bg-red-700"
                        onClick={() => {
                          // Call API to delete the response
                          fetch(`/api/professionals/${professionalId}/respond/${review.id}`, {
                            method: 'DELETE',
                          })
                          .then(res => {
                            if (!res.ok) throw new Error('Failed to delete response');
                            return res.json();
                          })
                          .then(() => {
                            // Invalidate the reviews query to refresh the list
                            queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
                            // Show success toast
                            toast({
                              title: t('response_deleted'),
                              description: t('your_response_has_been_deleted')
                            });
                            // Close delete confirmation
                            setConfirmingDeleteId(null);
                          })
                          .catch(err => {
                            console.error('Error deleting response:', err);
                            toast({
                              title: t('error'),
                              description: t('something_went_wrong'),
                              variant: "destructive"
                            });
                          });
                        }}
                      >
                        {t('confirm_delete')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Edit response form */}
            {review.professionalResponse && editingReviewId === review.id && (
              <div className="mt-4 bg-blue-50 p-3 rounded">
                <p className="font-semibold text-sm text-primary mb-2">{t('edit_your_response')}</p>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm" 
                  rows={3}
                  value={editResponseText}
                  onChange={(e) => setEditResponseText(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-2 mt-2">
                  <button 
                    className="px-3 py-1 bg-gray-200 text-xs rounded-md hover:bg-gray-300"
                    onClick={() => {
                      setEditingReviewId(null);
                      setEditResponseText("");
                    }}
                  >
                    {t('cancel_button')}
                  </button>
                  <button 
                    className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark"
                    onClick={() => {
                      if (editResponseText && editResponseText.trim() !== '') {
                        // Call API to update the response
                        fetch(`/api/professionals/${professionalId}/respond/${review.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ response: editResponseText }),
                        })
                        .then(res => {
                          if (!res.ok) throw new Error('Failed to update response');
                          return res.json();
                        })
                        .then(() => {
                          // Invalidate the reviews query to refresh the list
                          queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
                          // Show success toast
                          toast({
                            title: t('response_edited'),
                            description: t('your_response_has_been_edited')
                          });
                          // Exit edit mode
                          setEditingReviewId(null);
                          setEditResponseText("");
                        })
                        .catch(err => {
                          console.error('Error updating response:', err);
                          toast({
                            title: t('error'),
                            description: t('something_went_wrong'),
                            variant: "destructive"
                          });
                        });
                      }
                    }}
                  >
                    {t('save_response')}
                  </button>
                </div>
              </div>
            )}
            
            {/* Add inline response form for this specific review */}
            {isOwnProfile && !review.professionalResponse && (
              <div id={`respond-${review.id}`} className="mt-4 bg-blue-50 p-3 rounded">
                <p className="text-sm font-medium mb-2">{t('respond_to_this_review')}</p>
                <textarea 
                  className="w-full p-2 border rounded-md text-sm" 
                  rows={3}
                  placeholder={t('type_your_response')}
                  id={`response-${review.id}`}
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button 
                    className="px-3 py-1 bg-primary text-white text-xs rounded-md hover:bg-primary-dark"
                    onClick={() => {
                      // Get the response text from the textarea
                      const responseText = (document.getElementById(`response-${review.id}`) as HTMLTextAreaElement)?.value;
                      if (responseText && responseText.trim() !== '') {
                        // Call the API to submit the response
                        fetch(`/api/professionals/${professionalId}/respond`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ 
                            response: responseText,
                            reviewId: review.id
                          }),
                        })
                        .then(res => {
                          if (!res.ok) throw new Error('Failed to submit response');
                          return res.json();
                        })
                        .then(() => {
                          // Invalidate the reviews query to refresh the list
                          queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
                          // Show success toast
                          toast({
                            title: t('response_submitted'),
                            description: t('your_response_has_been_added')
                          });
                        })
                        .catch(err => {
                          console.error('Error submitting response:', err);
                          toast({
                            title: t('error'),
                            description: t('something_went_wrong'),
                            variant: "destructive"
                          });
                        });
                      }
                    }}
                  >
                    {t('send_response')}
                  </button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}