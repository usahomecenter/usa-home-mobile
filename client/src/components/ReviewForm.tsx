import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { GuestReviewForm } from "./GuestReviewForm";
import { ProfessionalResponseForm } from "./ProfessionalResponseForm";
import { useLanguage } from "@/hooks/useLanguage";

// Emoji selection for review sentiment
const EMOJI_OPTIONS = [
  { emoji: "😍", label: "Love it", value: 5 },
  { emoji: "😊", label: "Like it", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😕", label: "Dislike", value: 2 },
  { emoji: "😠", label: "Terrible", value: 1 },
];

interface ReviewFormProps {
  professionalId: number;
}

interface CanReviewResponse {
  canReview: boolean;
  message?: string;
}

export function ReviewForm({ professionalId }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  // Check if user can review this professional
  const { data: canReviewData, isLoading: checkingCanReview } = useQuery<CanReviewResponse>({
    queryKey: ["can-review", professionalId],
    queryFn: async () => {
      // Don't check eligibility if not logged in - we'll show guest form instead
      if (!user) return { canReview: true };
      
      const response = await fetch(`/api/can-review/${professionalId}`);
      if (!response.ok) {
        throw new Error("Failed to check review eligibility");
      }
      return response.json();
    },
    enabled: !!user,
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: { comment: string; rating: number }) => {
      const response = await fetch(`/api/professionals/${professionalId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId,
          rating: data.rating,
          comment: data.comment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t('review_submitted'),
        description: t('thank_you_for_feedback'),
      });
      reset();
      setRating(5);
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
      queryClient.invalidateQueries({ queryKey: ["can-review", professionalId] });
    },
    onError: (error: Error) => {
      toast({
        title: t('review_submission_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { comment: string }) => {
    if (!user) {
      toast({
        title: t('authentication_required'),
        description: t('please_login'),
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      comment: data.comment,
      rating,
    });
  };
  
  const handleEmojiSelect = (value: number) => {
    setRating(value);
  };

  if (checkingCanReview) {
    return (
      <div className="mb-6">
        <div className="flex justify-center items-center p-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2">{t('checking_review_eligibility')}</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, use the GuestReviewForm instead
  if (!user) {
    return <GuestReviewForm professionalId={professionalId} />;
  }

  // If the current user is this professional or is any professional, prevent review
  if (user.id === professionalId) {
    return (
      <div>
        <div className="mb-4">
          <p className="text-gray-700">{t('you_cannot_review_your_own_profile')}</p>
        </div>
        <ProfessionalResponseForm professionalId={professionalId} />
      </div>
    );
  }
  
  // If the user is any professional, they can't review other professionals
  if (user.isProfessional) {
    return (
      <div>
        <div className="mb-4">
          <p className="text-gray-700">{t('professionals_cannot_review_other_professionals')}</p>
        </div>
      </div>
    );
  }

  // Only check review eligibility for logged-in users who are not the professional
  if (user && canReviewData && !canReviewData.canReview) {
    return (
      <div>
        <p className="text-gray-700 mb-6">{t('cannot_review_professional')}</p>
        <p className="text-gray-700 mb-4">{t('can_review_as_guest')}</p>
        <GuestReviewForm professionalId={professionalId} />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">{t('share_your_experience')}</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Emoji Rating Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">{t('how_was_your_experience')}</label>
          <div className="flex space-x-4 mb-1">
            {EMOJI_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleEmojiSelect(option.value)}
                className={`text-2xl p-2 rounded-full transition-all ${
                  rating === option.value
                    ? "bg-blue-100 transform scale-110"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                title={t(option.label.toLowerCase().replace(' ', '_'))}
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            {t('your_review')}
          </label>
          <Textarea
            id="comment"
            placeholder={t('share_experience_placeholder')}
            rows={4}
            className="w-full min-h-[100px]"
            {...register("comment", {
              required: t('provide_feedback'),
              minLength: {
                value: 10,
                message: t('review_min_length'),
              },
            })}
          />
          {errors.comment && (
            <p className="text-sm text-red-500 mt-1">{errors.comment.message}</p>
          )}
        </div>
        
        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={submitReviewMutation.isPending}
        >
          {submitReviewMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit_review')
          )}
        </Button>
      </form>
    </div>
  );
}