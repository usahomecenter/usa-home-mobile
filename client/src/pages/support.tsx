// Support page for App Store submission
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MessageCircle, HelpCircle } from 'lucide-react';

export default function Support() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Center</h1>
          <p className="text-xl text-gray-600">We're here to help you with any questions or issues</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Contact Methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Support
                </CardTitle>
                <CardDescription>
                  Get help via email within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">support@usahome.com</p>
                <p className="text-sm text-gray-500">Response time: 24 hours</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-green-600" />
                  Phone Support
                </CardTitle>
                <CardDescription>
                  Speak with our support team directly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">1-800-USA-HOME</p>
                <p className="text-sm text-gray-500">Hours: Mon-Fri 9AM-6PM EST</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                  Live Chat
                </CardTitle>
                <CardDescription>
                  Chat with us in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Live Chat</Button>
                <p className="text-sm text-gray-500 mt-2">Available during business hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you soon
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="How can we help you?" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your question or issue in detail..."
                  rows={5}
                />
              </div>
              <Button className="w-full">Send Message</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-600" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I create an account?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Click the "Sign Up" button and provide your email address and basic information to get started.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">How do I find service providers?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Use our interactive map or browse by service category to find verified professionals in your area.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">Is my personal information secure?</h3>
                <p className="text-gray-600 text-sm">
                  Yes, we use industry-standard encryption and never share your personal data without consent.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I update my profile?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Go to your account settings to update your personal information and preferences.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">What services are available?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  We offer home building, design, financing, real estate, and many other home-related services.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">How do I report an issue?</h3>
                <p className="text-gray-600 text-sm">
                  Use any of the contact methods above or the contact form to report problems or concerns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}