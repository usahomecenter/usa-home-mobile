import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "@/components/ui/star-rating";
import { Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Emoji selection for review sentiment
const EMOJI_OPTIONS = [
  { emoji: "😍", label: "Love it", value: 5 },
  { emoji: "😊", label: "Like it", value: 4 },
  { emoji: "😐", label: "Neutral", value: 3 },
  { emoji: "😕", label: "Dislike", value: 2 },
  { emoji: "😠", label: "Terrible", value: 1 },
];

// Form validation schema
const guestReviewSchema = z.object({
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  comment: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1).max(5)
});

type GuestReviewFormValues = z.infer<typeof guestReviewSchema>;

interface GuestReviewFormProps {
  professionalId: number;
}

export function GuestReviewForm({ professionalId }: GuestReviewFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEmoji, setSelectedEmoji] = useState<number>(5);
  
  const form = useForm<GuestReviewFormValues>({
    resolver: zodResolver(guestReviewSchema),
    defaultValues: {
      guestName: "",
      guestEmail: "",
      comment: "",
      rating: 5
    },
  });

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: GuestReviewFormValues) => {
      const response = await fetch(`/api/professionals/${professionalId}/guest-reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          professionalId,
          rating: data.rating,
          comment: data.comment,
          guestName: data.guestName,
          guestEmail: data.guestEmail || undefined
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
        title: "Thank you for your review!",
        description: "Your feedback has been submitted successfully.",
      });
      form.reset();
      setSelectedEmoji(5);
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["/api/professionals", professionalId, "reviews"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: GuestReviewFormValues) => {
    submitReviewMutation.mutate(data);
  };

  const handleEmojiSelect = (value: number) => {
    setSelectedEmoji(value);
    form.setValue("rating", value);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Share Your Experience</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <FormLabel className="block text-sm font-medium mb-2">Your Name</FormLabel>
              <Input 
                placeholder="Enter your name" 
                {...form.register("guestName")} 
                className="w-full"
              />
              {form.formState.errors.guestName && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.guestName.message}</p>
              )}
            </div>
            
            <div>
              <FormLabel className="block text-sm font-medium mb-2">Your Email (optional)</FormLabel>
              <Input 
                placeholder="email@example.com" 
                type="email" 
                {...form.register("guestEmail")} 
                className="w-full"
              />
              {form.formState.errors.guestEmail && (
                <p className="text-sm text-red-500 mt-1">{form.formState.errors.guestEmail.message}</p>
              )}
            </div>
          </div>
          
          {/* Emoji Rating Selection */}
          <div>
            <FormLabel className="block text-sm font-medium mb-2">How was your experience?</FormLabel>
            <div className="flex space-x-4 mb-1">
              {EMOJI_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleEmojiSelect(option.value)}
                  className={`text-2xl p-2 rounded-full transition-all ${
                    selectedEmoji === option.value
                      ? "bg-blue-100 transform scale-110"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  title={option.label}
                >
                  {option.emoji}
                </button>
              ))}
            </div>
            {form.formState.errors.rating && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.rating.message}</p>
            )}
          </div>
            
          <div>
            <FormLabel className="block text-sm font-medium mb-2">Your Review</FormLabel>
            <Textarea 
              placeholder="Share your experience with this professional..."
              className="w-full min-h-[100px]"
              {...form.register("comment")}
            />
            {form.formState.errors.comment && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.comment.message}</p>
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
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}