import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const SupportPage = () => {
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [chatbotMessages, setChatbotMessages] = useState([
    { sender: "bot", text: "Welcome to USA Home support! I'm here to help with home building, design, financing, and real estate questions. How can I assist you with your home project today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  
  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatbotMessages]);

  const handleSendFeedback = async () => {
    if (!message) {
      toast({
        title: "Missing information",
        description: "Please enter your feedback message",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Missing information",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('/api/support/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
          category: 'general'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      toast({
        title: "Feedback Sent",
        description: "Thank you for your feedback! We appreciate your input.",
      });
      
      setMessage("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTicket = async () => {
    if (!ticketSubject) {
      toast({
        title: "Missing information",
        description: "Please enter a subject for your ticket",
        variant: "destructive"
      });
      return;
    }
    
    if (!ticketDescription) {
      toast({
        title: "Missing information",
        description: "Please provide a description of your issue",
        variant: "destructive"
      });
      return;
    }
    
    if (!email) {
      toast({
        title: "Missing information",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          subject: ticketSubject,
          description: ticketDescription,
          priority: 'medium'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create ticket');
      }

      toast({
        title: "Ticket Created",
        description: "Your support ticket has been submitted. We'll contact you soon!",
      });
      
      setTicketSubject("");
      setTicketDescription("");
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Keywords to determine appropriate responses
  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    // Add user message
    const newMessages = [
      ...chatbotMessages, 
      { sender: "user", text: chatInput }
    ];
    
    setChatbotMessages(newMessages);
    setChatInput("");
    
    // Process the user message and generate a focused response
    const userMessage = chatInput.toLowerCase();
    let botResponse = "";
    
    // Set focus on input after sending message
    setTimeout(() => {
      const inputElement = document.querySelector('#chat-input') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }, 100);
    
    // Check if message contains off-topic content
    const offTopicKeywords = ["politics", "sports", "games", "movies", "music", "weather", "food", "restaurants"];
    const isOffTopic = offTopicKeywords.some(keyword => userMessage.includes(keyword));
    
    if (isOffTopic) {
      botResponse = "I can only help with home building, design, financing, and real estate questions. Please ask about these topics.";
    } 
    // Home Building
    else if (userMessage.includes("build") || userMessage.includes("construction") || userMessage.includes("contractor") || 
             userMessage.includes("architect") || userMessage.includes("foundation") || userMessage.includes("permits")) {
      
      // Check for specific building subcategories
      if (userMessage.includes("framing") || userMessage.includes("steel")) {
        botResponse = `<a href="/build-home/category/Construction & Building/Structural Steel & Framing" class="text-primary underline font-medium">Click here for Structural Steel & Framing specialists</a>`;
      } 
      else if (userMessage.includes("general contractor")) {
        botResponse = `<a href="/build-home/category/Construction & Building/General Contractor" class="text-primary underline font-medium">Click here for General Contractors</a>`;
      }
      else if (userMessage.includes("mason") || userMessage.includes("brick")) {
        botResponse = `<a href="/build-home/category/Construction & Building/Masonry & Bricklayer" class="text-primary underline font-medium">Click here for Masonry & Bricklayer specialists</a>`;
      }
      else if (userMessage.includes("electrical") || userMessage.includes("electrician")) {
        botResponse = `<a href="/build-home/category/MEP (Mechanical, Electrical, Plumbing)/Electrician" class="text-primary underline font-medium">Click here for Electricians</a>`;
      }
      else if (userMessage.includes("plumbing") || userMessage.includes("plumber")) {
        botResponse = `<a href="/build-home/category/MEP (Mechanical, Electrical, Plumbing)/Plumber" class="text-primary underline font-medium">Click here for Plumbers</a>`;
      }
      else if (userMessage.includes("hvac") || userMessage.includes("air conditioning") || userMessage.includes("heating")) {
        botResponse = `<a href="/build-home/category/MEP (Mechanical, Electrical, Plumbing)/HVAC Technician" class="text-primary underline font-medium">Click here for HVAC Technicians</a>`;
      }
      else {
        // General building response with subcategory links
        botResponse = `We can connect you with building professionals: <a href="/build-home" class="text-primary underline font-medium">Browse all building services</a><br>
        Popular categories: 
        <a href="/build-home/category/Construction & Building" class="text-primary underline font-medium">Construction</a> | 
        <a href="/build-home/category/MEP (Mechanical, Electrical, Plumbing)" class="text-primary underline font-medium">MEP</a>`;
      }
    } 
    // Home Design
    else if (userMessage.includes("design") || userMessage.includes("interior") || userMessage.includes("decor") || 
             userMessage.includes("remodel") || userMessage.includes("renovation") || userMessage.includes("furniture")) {
    
      // Check for specific design subcategories
      if (userMessage.includes("interior")) {
        botResponse = `<a href="/design-home/category/Interior Designer" class="text-primary underline font-medium">Click here for Interior Designers</a>`;
      }
      else if (userMessage.includes("landscape") || userMessage.includes("garden")) {
        botResponse = `<a href="/design-home/category/Landscape Architect" class="text-primary underline font-medium">Click here for Landscape Architects</a>`;
      }
      else if (userMessage.includes("furniture")) {
        botResponse = `<a href="/design-home/category/Interior Designer/Furniture & Fixtures Selection" class="text-primary underline font-medium">Click here for Furniture & Fixtures specialists</a>`;
      }
      else if (userMessage.includes("lighting")) {
        botResponse = `<a href="/design-home/category/Interior Designer/Lighting Design" class="text-primary underline font-medium">Click here for Lighting Design specialists</a>`;
      }
      else if (userMessage.includes("architect")) {
        botResponse = `<a href="/design-home/category/Architect" class="text-primary underline font-medium">Click here for Architects</a>`;
      }
      else {
        // General design response with subcategory links
        botResponse = `Our design experts can help with your project: <a href="/design-home" class="text-primary underline font-medium">Browse all design services</a><br>
        Popular categories: 
        <a href="/design-home/category/Interior Designer" class="text-primary underline font-medium">Interior Design</a> | 
        <a href="/design-home/category/Architect" class="text-primary underline font-medium">Architects</a> | 
        <a href="/design-home/category/Landscape Architect" class="text-primary underline font-medium">Landscaping</a>`;
      }
    } 
    // Finance & Real Estate
    else if (userMessage.includes("finance") || userMessage.includes("mortgage") || userMessage.includes("loan") || 
             userMessage.includes("real estate") || userMessage.includes("property") || userMessage.includes("buying") || 
             userMessage.includes("selling") || userMessage.includes("agent") || userMessage.includes("broker")) {
      
      // Check for specific finance subcategories
      if (userMessage.includes("mortgage") || userMessage.includes("loan officer")) {
        botResponse = `<a href="/finance/category/Mortgage & Loan Professionals" class="text-primary underline font-medium">Click here for Mortgage & Loan Professionals</a>`;
      }
      else if (userMessage.includes("real estate") || userMessage.includes("property") || userMessage.includes("buying") || userMessage.includes("selling")) {
        botResponse = `<a href="/finance/category/Real Estate & Property Professionals" class="text-primary underline font-medium">Click here for Real Estate & Property Professionals</a>`;
      }
      else if (userMessage.includes("credit") || userMessage.includes("credit score")) {
        botResponse = `<a href="/finance/category/Credit Repair Specialists" class="text-primary underline font-medium">Click here for Credit Repair Specialists</a>`;
      }
      else if (userMessage.includes("debt") || userMessage.includes("consolidation")) {
        botResponse = `<a href="/finance/category/Debt Management" class="text-primary underline font-medium">Click here for Debt Management professionals</a>`;
      }
      else {
        // General finance response with subcategory links
        botResponse = `Find financial professionals here: <a href="/finance" class="text-primary underline font-medium">Browse all finance & real estate services</a><br>
        Popular categories: 
        <a href="/finance/category/Mortgage & Loan Professionals" class="text-primary underline font-medium">Mortgage</a> | 
        <a href="/finance/category/Real Estate & Property Professionals" class="text-primary underline font-medium">Real Estate</a> | 
        <a href="/finance/category/Credit Repair Specialists" class="text-primary underline font-medium">Credit Repair</a>`;
      }
    } 
    // Support and Account Questions
    else if (userMessage.includes("account") || userMessage.includes("profile") || userMessage.includes("password") || 
             userMessage.includes("subscription") || userMessage.includes("payment") || userMessage.includes("login")) {
      const accountResponses = [
        "Check My Account or create a support ticket. Need directions?",
        "For account issues, I recommend creating a support ticket for direct assistance.",
        "Update profile in My Account; check Update Payment Info for billing questions.",
        "Account trouble? Create a support ticket for fastest assistance."
      ];
      botResponse = accountResponses[Math.floor(Math.random() * accountResponses.length)];
    }
    // Default responses for anything else related to homes
    else {
      const generalResponses = [
        "How can I help with your home project today?",
        "Which service interests you: building, design, financing, or real estate?",
        "I can help with home building, design, financing, and real estate. Which area?",
        "What specific home-related service do you need help with?"
      ];
      botResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
    }
    
    // Send the response after a short delay
    setTimeout(() => {
      setChatbotMessages(prev => [
        ...prev, 
        { sender: "bot", text: botResponse }
      ]);
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-4 py-2 md:py-4">
      <h1 className="text-xl md:text-2xl font-bold text-center mb-2 md:mb-4 text-primary">Support Center</h1>
      
      <Tabs defaultValue="chatbot" className="mb-2 md:mb-3">
        <TabsList className="grid w-full grid-cols-3 mb-2 md:mb-3 text-xs md:text-sm">
          <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="ticket">Create a Ticket</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chatbot">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary to-primary-dark">
              <CardTitle className="text-white">Chat with our Assistant</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col h-[350px]">
                <div 
                  ref={chatContainerRef}
                  className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-md p-4"
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {chatbotMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-3 ${msg.sender === 'bot' 
                        ? 'bg-gray-100 p-3 rounded-lg rounded-tl-none' 
                        : 'bg-primary text-white p-3 rounded-lg rounded-tr-none ml-auto'}`}
                      style={{ 
                        maxWidth: '80%', 
                        overflowWrap: 'break-word',
                        wordBreak: 'break-word'
                      }}
                      dangerouslySetInnerHTML={{ __html: msg.text }}
                    >
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Input 
                    id="chat-input"
                    placeholder="Type your message..." 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
                    className="flex-1"
                    aria-label="Chat message"
                    autoComplete="off"
                  />
                  <Button onClick={handleSendChatMessage}>Send</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="feedback">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary to-primary-dark">
              <CardTitle className="text-white">Send Feedback</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Your Feedback</Label>
                  <Textarea 
                    id="message" 
                    placeholder="We value your input! Please share your thoughts or suggestions."
                    className="min-h-[150px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSendFeedback}>Submit Feedback</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ticket">
          <Card>
            <CardHeader className="bg-gradient-to-r from-primary to-primary-dark">
              <CardTitle className="text-white">Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-email">Email</Label>
                  <Input 
                    id="ticket-email" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticket-subject">Subject</Label>
                  <Input 
                    id="ticket-subject" 
                    placeholder="Brief description of the issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="ticket-description">Description</Label>
                  <Textarea 
                    id="ticket-description" 
                    placeholder="Please provide details about your issue or question"
                    className="min-h-[150px]"
                    value={ticketDescription}
                    onChange={(e) => setTicketDescription(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleCreateTicket}>Submit Ticket</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SupportPage;