import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/hooks/useLanguage";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function SubscriptionDemo() {
  const { t } = useLanguage();
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Protection System</h1>
      <p className="text-lg mb-6">
        This page explains how the subscription protection works in our application.
      </p>
      
      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertTitle>Implementation Complete</AlertTitle>
        <AlertDescription>
          The subscription protection system is fully implemented throughout the application.
          When a professional's payment stops, their profile remains listed but their contact 
          information and profile image are automatically blurred.
        </AlertDescription>
      </Alert>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>How the Subscription Protection Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">For Active Subscriptions:</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Professional's full profile is visible to all users</li>
              <li>Contact information is displayed clearly</li>
              <li>Profile image is shown in full clarity</li>
              <li>Website links and social media accounts are clickable</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">When Payment is Due Soon:</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Professional sees a payment reminder banner on their profile</li>
              <li>Email notifications are sent as the due date approaches</li>
              <li>Profile remains fully visible to potential clients</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">When Subscription Expires:</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Professional's profile remains listed in search results</li>
              <li>Contact information is automatically blurred</li>
              <li>Profile image is automatically blurred</li>
              <li>Social media links and website URLs are obscured</li>
              <li>Professional sees prominent payment recovery notices</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-md text-gray-600">
        This protection system ensures professionals maintain their subscription payments 
        while still allowing potential clients to discover them even when payments lapse. 
        The automatic blurring provides strong incentive for professionals to renew their 
        subscription without completely removing them from the platform.
      </p>
    </div>
  );
}