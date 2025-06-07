import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";
import { Review } from "@shared/schema";

interface ProfessionalResponseFormProps {
  professionalId: number;
}

export function ProfessionalResponseForm({ professionalId }: ProfessionalResponseFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  // Query to get reviews for this professional
  const { data: reviews, isLoading: isLoadingReviews } = useQuery<Review[]>({
    queryKey: ["/api/professionals", professionalId, "reviews"],
    queryFn: async () => {
      const response = await fetch(`/api/professionals/${professionalId}/reviews`);
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      return response.json();
    },
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      response: "",
    },
  });

  // Mutation for submitting a professional response to a review
  const submitResponseMutation = useMutation({
    mutationFn: async (data: { response: string }) => {
      // Send the response to the backend
      const response = await fetch(`/api/professionals/${professionalId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          response: data.response
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit response');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t('response_submitted'),
        description: t('your_response_has_been_added'),
      });
      reset();
      // Invalidate the reviews query to refresh the list with the new response
      queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
    },
    onError: (error: any) => {
      toast({
        title: t('error'),
        description: error.message || t('something_went_wrong'),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { response: string }) => {
    if (!user) {
      toast({
        title: t('authentication_required'),
        description: t('please_login'),
        variant: "destructive",
      });
      return;
    }

    submitResponseMutation.mutate({
      response: data.response,
    });
  };

  // Check if the current user is the professional and if there are reviews
  const isOwnProfile = user?.id === professionalId && user?.isProfessional;
  const hasReviews = !isLoadingReviews && reviews && reviews.length > 0;
  
  // If not the profile owner, don't show anything
  if (!isOwnProfile) {
    return null;
  }
  
  // If there are no reviews for this professional yet
  if (!hasReviews) {
    return (
      <div className="bg-muted/30 rounded-lg p-4 my-4">
        <h2 className="text-xl font-semibold mb-4">{t('no_reviews_yet')}</h2>
        <p className="text-gray-600">
          {t('as_a_professional_you_cannot_review_yourself')}
        </p>
        <p className="text-gray-600 mt-4">
          {t('you_can_respond_to_client_reviews_when_they_arrive')}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 rounded-lg p-4 my-4">
      <h2 className="text-xl font-semibold mb-4">{t('respond_to_reviews')}</h2>
      <p className="text-gray-600 mb-4">{t('as_a_professional_response_info')}</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Textarea
            {...register("response", { required: true })}
            placeholder={t('type_your_response')}
            className="w-full h-32"
          />
          {errors.response && (
            <p className="text-red-500 mt-1">{t('response_required')}</p>
          )}
        </div>
        
        <Button 
          type="submit" 
          className="bg-primary text-white hover:bg-primary-dark"
          disabled={submitResponseMutation.isPending}
        >
          {submitResponseMutation.isPending ? t('sending') : t('send_response')}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          {t('professional_response_guidelines')}
        </p>
      </form>
    </div>
  );
}