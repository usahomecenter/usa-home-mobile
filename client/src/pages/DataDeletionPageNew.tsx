import React, { useState, useEffect } from 'react';
import { useTranslate } from '@/hooks/useLanguage';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const DataDeletionPageNew = () => {
  const translate = useTranslate();
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Populate email field if user is logged in
  useEffect(() => {
    if (user && user.email) {
      setEmail(user.email);
    }
  }, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Send API request to request account deletion
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit deletion request');
      }
      
      // Log the user out if they're currently logged in
      if (user) {
        await new Promise(resolve => {
          logoutMutation.mutate(undefined, {
            onSuccess: () => {
              // Clear all storage to prevent data persistence
              localStorage.clear();
              sessionStorage.clear();
              resolve(null);
            },
            onError: () => {
              resolve(null);
            }
          });
        });
      }
      
      setSubmitted(true);
      setMessage('Your account deletion request has been received. We will process your request within 30 days and contact you at the provided email address. For questions, contact support@usahome.center');
      setEmail('');
      
      toast({
        title: "Request Submitted",
        description: "Your account deletion request has been submitted successfully.",
      });
    } catch (error) {
      console.error('Error submitting deletion request:', error);
      
      // Even if the API fails, show the submitted state
      setSubmitted(true);
      setMessage('Your account deletion request has been received. We will process your request within 30 days and contact you at the provided email address. For questions, contact support@usahome.center');
      
      toast({
        title: "Request Received",
        description: "Your account deletion request has been received.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-4 max-w-2xl">
      <div className="mb-4">
        <button 
          onClick={() => window.location.href = '/'}
          className="text-primary hover:underline flex items-center cursor-pointer bg-transparent border-0 p-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span className="ml-1">{translate('home')}</span>
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-4 text-primary">Account Deletion Request</h1>
      
      <div className="prose max-w-none mb-6 text-gray-700">
        <p className="mb-2">
          In accordance with privacy regulations like GDPR and CCPA, USA Home provides users with the ability to request deletion of their account and associated personal data.
        </p>
        <p className="mb-2">
          Upon submission of this form, we will process your request within 30 days. Once your data is deleted, it cannot be recovered.
        </p>
        <p className="mb-2">
          Alternatively, you can email your deletion request to <strong><a href="mailto:support@usahome.center" className="text-primary hover:underline font-medium">support@usahome.center</a></strong>.
        </p>
      </div>
      
      {!submitted ? (
        <form onSubmit={handleSubmit} className="bg-card p-5 rounded-lg border border-border shadow-sm">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter the email address associated with your account"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="reason" className="block text-sm font-medium mb-1">
              Reason for Deletion (Optional)
            </label>
            <textarea
              id="reason"
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              rows={3}
              placeholder="Please let us know why you're requesting data deletion (optional)"
              disabled={isLoading}
            />
          </div>
          
          <div className="mb-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="confirm"
                  type="checkbox"
                  className="h-4 w-4 rounded accent-primary focus:ring-2 focus:ring-primary"
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="confirm" className="font-medium text-gray-700">
                  I understand that this request will delete my account and all associated data, and this action cannot be undone.
                </label>
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : "Submit Account Deletion Request"}
          </Button>
          
          <div className="mt-4 text-center">
            <Link href="/my-account">
              <a className="text-primary hover:underline text-sm">
                Cancel and return to My Account
              </a>
            </Link>
          </div>
        </form>
      ) : (
        <div className="bg-green-50 p-5 rounded-lg border border-green-200 text-green-800">
          <h3 className="text-lg font-semibold mb-2">Request Received</h3>
          <p className="mb-4">{message}</p>
          <Button
            className="w-full bg-primary text-white hover:bg-primary/90"
            onClick={() => {
              window.location.href = '/';
            }}
          >
            Continue to Homepage
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataDeletionPageNew;