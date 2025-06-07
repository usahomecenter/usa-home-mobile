import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, DollarSign, Building, Bell, BarChart3, Globe, LogOut, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import AdminLogin from "./AdminLogin";

const SecureAdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProfessionals, setSelectedProfessionals] = useState<number[]>([]);
  const [notificationType, setNotificationType] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [billingSearchTerm, setBillingSearchTerm] = useState("");
  const [professionalSearchTerm, setProfessionalSearchTerm] = useState("");
  const [notificationSearchTerm, setNotificationSearchTerm] = useState("");
  const [expandedDetails, setExpandedDetails] = useState<number[]>([]);
  const { toast } = useToast();

  // Check if admin is already authenticated
  useEffect(() => {
    // Check backend authentication status
    fetch('/api/admin/status')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          // Also set local storage for consistency
          localStorage.setItem("admin_authenticated", "true");
          localStorage.setItem("admin_login_time", Date.now().toString());
        }
      })
      .catch(() => {
        // If backend check fails, check local storage
        const adminAuth = localStorage.getItem("admin_authenticated");
        const loginTime = localStorage.getItem("admin_login_time");
        
        if (adminAuth === "true" && loginTime) {
          const now = Date.now();
          const sessionDuration = now - parseInt(loginTime);
          const maxSession = 24 * 60 * 60 * 1000; // 24 hours
          
          if (sessionDuration < maxSession) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem("admin_authenticated");
            localStorage.removeItem("admin_login_time");
          }
        }
      });
  }, []);

  // Fetch admin statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch admin stats");
      return res.json();
    },
    enabled: isAuthenticated
  });

  // Fetch professionals for notification management
  const { data: professionals, refetch: refetchProfessionals } = useQuery({
    queryKey: ["/api/admin/professionals"],
    queryFn: async () => {
      const res = await fetch("/api/admin/professionals");
      if (!res.ok) throw new Error("Failed to fetch professionals");
      const data = await res.json();

      return data;
    },
    enabled: isAuthenticated
  });

  // Fetch revenue data
  const { data: revenue } = useQuery({
    queryKey: ["/api/admin/revenue"],
    queryFn: async () => {
      const res = await fetch("/api/admin/revenue");
      if (!res.ok) throw new Error("Failed to fetch revenue");
      return res.json();
    },
    enabled: isAuthenticated
  });

  // Fetch deletion requests
  const { data: deletionRequests } = useQuery({
    queryKey: ["/api/admin/deletion-requests"],
    queryFn: async () => {
      const res = await fetch("/api/admin/deletion-requests");
      if (!res.ok) throw new Error("Failed to fetch deletion requests");
      return res.json();
    },
    enabled: isAuthenticated
  });

  // Fetch feedback data
  const { data: feedbackData } = useQuery({
    queryKey: ["/api/support/feedback"],
    queryFn: async () => {
      const res = await fetch("/api/support/feedback");
      if (!res.ok) throw new Error("Failed to fetch feedback");
      return res.json();
    },
    enabled: isAuthenticated
  });

  // Fetch support tickets
  const { data: supportTickets } = useQuery({
    queryKey: ["/api/support/tickets"],
    queryFn: async () => {
      const res = await fetch("/api/support/tickets");
      if (!res.ok) throw new Error("Failed to fetch support tickets");
      return res.json();
    },
    enabled: isAuthenticated
  });

  // Send individual notification mutation
  const sendNotificationMutation = useMutation({
    mutationFn: async ({ professionalId, type, message }: { professionalId: number, type: string, message?: string }) => {
      const res = await fetch(`/api/admin/notify/${professionalId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, customMessage: message })
      });
      if (!res.ok) throw new Error("Failed to send notification");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Notification Sent!",
        description: data.message,
      });
      refetchProfessionals();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Notification",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Send bulk notification mutation
  const sendBulkNotificationMutation = useMutation({
    mutationFn: async ({ professionalIds, type, message }: { professionalIds: number[], type: string, message?: string }) => {
      const res = await fetch("/api/admin/bulk-notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalIds, type, customMessage: message })
      });
      if (!res.ok) throw new Error("Failed to send bulk notifications");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Bulk Notifications Sent!",
        description: data.message,
      });
      setSelectedProfessionals([]);
      setCustomMessage("");
      refetchProfessionals();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Send Bulk Notifications",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated");
    localStorage.removeItem("admin_login_time");
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "Successfully logged out of admin panel",
    });
  };

  const handleSendNotification = (professionalId: number, type: string) => {
    sendNotificationMutation.mutate({ professionalId, type, message: customMessage });
  };

  const handleBulkNotification = () => {
    if (selectedProfessionals.length === 0) {
      toast({
        title: "No Professionals Selected",
        description: "Please select at least one professional to send notifications",
        variant: "destructive",
      });
      return;
    }

    sendBulkNotificationMutation.mutate({
      professionalIds: selectedProfessionals,
      type: notificationType,
      message: customMessage
    });
  };

  // Handle deletion request actions
  const processDeletionRequestMutation = useMutation({
    mutationFn: async ({ requestId, action }: { requestId: number; action: string }) => {
      const response = await fetch(`/api/admin/deletion-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: action,
          processedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update deletion request');
      }

      // Check if response has content before parsing JSON
      const text = await response.text();
      if (!text) {
        return { message: 'Deletion request updated successfully' };
      }
      
      try {
        return JSON.parse(text);
      } catch (e) {
        return { message: 'Deletion request updated successfully' };
      }
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Request Updated",
        description: `Deletion request has been ${variables.action}`,
      });
      // Force refresh the queries to show updated data
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deletion-requests"] });
      queryClient.refetchQueries({ queryKey: ["/api/admin/deletion-requests"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed", 
        description: error.message || "Failed to update deletion request",
        variant: "destructive",
      });
    }
  });

  const handleDeletionAction = (requestId: number, action: string) => {
    processDeletionRequestMutation.mutate({ requestId, action });
  };

  const toggleProfessionalSelection = (professionalId: number) => {
    setSelectedProfessionals(prev => 
      prev.includes(professionalId) 
        ? prev.filter(id => id !== professionalId)
        : [...prev, professionalId]
    );
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">USA Home Admin Dashboard</h1>
              <p className="text-gray-600">Platform Management & Notification Center</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Admin Session Active
              </Badge>
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.newUsersThisMonth || 0} new this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Professionals</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalProfessionals || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.activeProfessionals || 0} active subscriptions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue?.monthlyRevenue || "0.00"}</div>
              <p className="text-xs text-muted-foreground">
                ${revenue?.totalRevenue || "0.00"} total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalServices || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all categories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-8 gap-1">
            <TabsTrigger value="notifications" className="text-xs md:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs md:text-sm">Monitoring</TabsTrigger>
            <TabsTrigger value="professionals" className="text-xs md:text-sm">Professionals</TabsTrigger>
            <TabsTrigger value="billing" className="text-xs md:text-sm">Billing</TabsTrigger>
            <TabsTrigger value="feedback" className="text-xs md:text-sm">Feedback</TabsTrigger>
            <TabsTrigger value="support-tickets" className="text-xs md:text-sm">Support</TabsTrigger>
            <TabsTrigger value="deletion-requests" className="text-xs md:text-sm">Deletion</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            {/* Automated Payment Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🤖 Automated Payment Monitoring System
                </CardTitle>
                <CardDescription>
                  Your system automatically monitors all professional payments and sends notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h3 className="font-semibold text-green-900 mb-2">✅ System Status: ACTIVE</h3>
                      <p className="text-sm text-green-800">Monitoring runs every 30 minutes automatically</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Automatic Features:</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-yellow-600">⚠️</span>
                          <span>Warns professionals 7 days before subscription expires</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-600">🚫</span>
                          <span>Deactivates accounts when subscriptions expire</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600">💳</span>
                          <span>Notifies when payments fail (35+ days overdue)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600">📧</span>
                          <span>Sends email notifications automatically</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button 
                      onClick={() => {
                        fetch('/api/admin/check-payments', { method: 'POST' })
                          .then(res => res.json())
                          .then(data => {
                            alert(`Payment check completed!\n${data.message}\nTime: ${new Date(data.timestamp).toLocaleString()}`);
                          })
                          .catch(() => alert('Failed to trigger payment check'));
                      }}
                      className="w-full mb-4"
                    >
                      🔍 Check All Payments Now
                    </Button>
                    
                    <Button 
                      onClick={() => {
                        if (confirm('This will set subscription start dates for professionals missing this data. Continue?')) {
                          fetch('/api/admin/populate-subscription-dates', { method: 'POST' })
                            .then(res => res.json())
                            .then(data => {
                              alert(`Data updated!\nUpdated ${data.updated} professionals\nRefresh the page to see changes`);
                              window.location.reload();
                            })
                            .catch(() => alert('Failed to populate subscription dates'));
                        }
                      }}
                      className="w-full"
                      variant="outline"
                    >
                      📅 Fix Missing Subscription Dates
                    </Button>
                    
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">No Manual Work Needed!</h4>
                      <p className="text-sm text-blue-800">
                        The system runs automatically. You don't need to monitor payments manually anymore. 
                        Professionals get notified automatically about payment issues.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            {/* Bulk Notification Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Bulk Notification Center
                </CardTitle>
                <CardDescription>
                  Send notifications to multiple professionals at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Notification Type</label>
                    <Select value={notificationType} onValueChange={setNotificationType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="payment_reminder">Payment Reminder</SelectItem>
                        <SelectItem value="system_maintenance">System Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Selected Professionals</label>
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProfessionals(professionals?.map((p: any) => p.id) || [])}
                        >
                          Select All
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProfessionals([])}
                        >
                          Clear All
                        </Button>
                      </div>
                      <div className="p-2 border rounded text-sm bg-gray-50">
                        {selectedProfessionals.length} professional(s) selected
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Custom Message (Optional)</label>
                  <Textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Enter a custom message for this notification..."
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleBulkNotification}
                  disabled={selectedProfessionals.length === 0 || !notificationType || sendBulkNotificationMutation.isPending}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sendBulkNotificationMutation.isPending ? "Sending..." : "Send Bulk Notification"}
                </Button>
              </CardContent>
            </Card>

            {/* Professional Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Professionals for Notification</CardTitle>
                <CardDescription>
                  Choose which professionals to notify about payment updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by name, email, or business..."
                    value={notificationSearchTerm}
                    onChange={(e) => setNotificationSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {professionals?.filter((pro: any) => {
                    if (!notificationSearchTerm) return true;
                    const searchLower = notificationSearchTerm.toLowerCase().trim();
                    return (
                      pro.fullName?.toLowerCase().includes(searchLower) ||
                      pro.email?.toLowerCase().includes(searchLower) ||
                      pro.businessName?.toLowerCase().includes(searchLower)
                    );
                  }).map((pro: any) => (
                    <div key={pro.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedProfessionals.includes(pro.id)}
                          onChange={() => toggleProfessionalSelection(pro.id)}
                          className="rounded"
                        />
                        <div>
                          <h4 className="font-medium">{pro.businessName || pro.fullName}</h4>
                          <p className="text-sm text-gray-600">{pro.email}</p>
                          <p className="text-sm text-gray-500">{pro.serviceCategory}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={pro.isActive ? "default" : "destructive"}>
                          {pro.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            {/* Billing History Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💳 Complete Billing History
                </CardTitle>
                <CardDescription>
                  View detailed payment history for all professionals from their first subscription day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search Bar */}
                <div className="mb-6">
                  <Input
                    placeholder="Search subscribers by name or business..."
                    value={billingSearchTerm}
                    onChange={(e) => setBillingSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                
                <div className="space-y-6">
                  {professionals?.filter((pro: any) => {
                    const searchLower = billingSearchTerm.toLowerCase().trim();
                    if (searchLower === "") return true;
                    
                    const businessMatch = pro.businessName && pro.businessName.toLowerCase().includes(searchLower);
                    const nameMatch = pro.fullName && pro.fullName.toLowerCase().includes(searchLower);
                    const emailMatch = pro.email && pro.email.toLowerCase().includes(searchLower);
                    
                    return businessMatch || nameMatch || emailMatch;
                  }).map((pro: any) => (
                    <div key={pro.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{pro.fullName}</h3>
                          <p className="text-sm text-gray-600">{pro.email}</p>
                          <div className="flex items-center justify-between mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const isExpanded = expandedDetails.includes(pro.id);
                                if (isExpanded) {
                                  setExpandedDetails(expandedDetails.filter(id => id !== pro.id));
                                } else {
                                  setExpandedDetails([...expandedDetails, pro.id]);
                                }
                              }}
                              className="text-xs"
                            >
                              {expandedDetails.includes(pro.id) ? 'Hide Info' : 'More Info'}
                            </Button>
                          </div>
                          
                          {expandedDetails.includes(pro.id) && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <div className="space-y-2 text-xs text-gray-700">
                                <p><strong>Main Service:</strong> {pro.serviceCategory || (pro.serviceCategories && pro.serviceCategories.length > 0 ? pro.serviceCategories[0] : 'Not specified')}</p>
                                {pro.serviceCategories && pro.serviceCategories.length > 0 && (
                                  <div>
                                    <p className="font-medium mb-1">All Services:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {pro.serviceCategories.map((service: string, index: number) => (
                                        <Badge
                                          key={index}
                                          variant={service === pro.serviceCategory ? "default" : "secondary"}
                                          className="text-xs"
                                        >
                                          {service}
                                          {service === pro.serviceCategory && " (Main)"}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          

                        </div>
                        <div className="text-right">
                          <Badge variant={pro.isActive ? "default" : "secondary"}>
                            {pro.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">First Subscription</p>
                          <p className="font-medium">
                            {pro.subscription_start_date ? new Date(pro.subscription_start_date).toLocaleDateString() : 
                             pro.last_payment_date ? new Date(pro.last_payment_date).toLocaleDateString() : 'Data Missing'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Last Payment</p>
                          <p className="font-medium">
                            {pro.last_payment_date ? new Date(pro.last_payment_date).toLocaleDateString() : 
                             pro.subscription_start_date ? new Date(pro.subscription_start_date).toLocaleDateString() : 'No Payment Data'}
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-xs text-gray-600">Monthly Fee</p>
                          <p className="font-medium">
                            ${pro.totalMonthlyFee || (pro.serviceCategories?.length > 1 ? 
                              (29.77 + (pro.serviceCategories.length - 1) * 5).toFixed(2) : '29.77')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Payment Timeline</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              Number of services
                            </span>
                            <span className="font-medium">
                              {pro.serviceCategories && pro.serviceCategories.length > 0 
                                ? pro.serviceCategories.length 
                                : (pro.serviceCategory ? 1 : 0)}
                            </span>
                          </div>

                          {pro.subscription_start_date && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                Subscription Started
                              </span>
                              <span>{new Date(pro.subscription_start_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {pro.last_payment_date && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Last Successful Payment
                              </span>
                              <span>{new Date(pro.last_payment_date).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {pro.subscription_expires_at && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${new Date(pro.subscription_expires_at) < new Date() ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                {new Date(pro.subscription_expires_at) < new Date() ? 'Expired' : 'Expires'}
                              </span>
                              <span>{new Date(pro.subscription_expires_at).toLocaleDateString()}</span>
                            </div>
                          )}
                          
                          {!pro.isActive && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                Account Deactivated
                              </span>
                              <span className="text-red-600">Subscription Expired</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Estimated Total Revenue:</span>
                          <span className="font-semibold">
                            {(() => {
                              const monthlyFee = parseFloat(pro.total_monthly_fee) || (pro.serviceCategories?.length > 1 ? 
                                (29.77 + (pro.serviceCategories.length - 1) * 5) : 29.77);
                              
                              if (pro.subscription_start_date) {
                                const monthsActive = Math.max(1, Math.floor((new Date().getTime() - new Date(pro.subscription_start_date).getTime()) / (1000 * 60 * 60 * 24 * 30)));
                                return `$${(monthlyFee * monthsActive).toFixed(2)}`;
                              } else if (pro.last_payment_date) {
                                const monthsFromPayment = Math.max(1, Math.floor((new Date().getTime() - new Date(pro.last_payment_date).getTime()) / (1000 * 60 * 60 * 24 * 30)));
                                return `$${(monthlyFee * monthsFromPayment).toFixed(2)}`;
                              } else {
                                return `$${monthlyFee.toFixed(2)} (1 month estimate)`;
                              }
                            })()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {!pro.subscriptionStartDate && !pro.lastPaymentDate ? 
                            "Note: Payment dates missing - showing monthly fee estimate" : 
                            "Based on available payment data"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professionals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Individual Professional Notifications</CardTitle>
                <CardDescription>Send targeted notifications to specific professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Input
                    placeholder="Search by name, email, or business..."
                    value={professionalSearchTerm}
                    onChange={(e) => setProfessionalSearchTerm(e.target.value)}
                    className="max-w-md"
                  />
                </div>
                <div className="space-y-4">
                  {professionals?.filter((pro: any) => {
                    if (!professionalSearchTerm) return true;
                    const searchLower = professionalSearchTerm.toLowerCase().trim();
                    return (
                      pro.fullName?.toLowerCase().includes(searchLower) ||
                      pro.email?.toLowerCase().includes(searchLower) ||
                      pro.businessName?.toLowerCase().includes(searchLower)
                    );
                  }).map((pro: any) => (
                    <div key={pro.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{pro.fullName}</h3>
                        <p className="text-sm text-gray-600">{pro.email}</p>
                        <div className="flex items-center justify-between mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const isExpanded = expandedDetails.includes(pro.id);
                              if (isExpanded) {
                                setExpandedDetails(expandedDetails.filter(id => id !== pro.id));
                              } else {
                                setExpandedDetails([...expandedDetails, pro.id]);
                              }
                            }}
                            className="text-xs"
                          >
                            {expandedDetails.includes(pro.id) ? 'Hide Info' : 'More Info'}
                          </Button>
                        </div>
                        
                        {expandedDetails.includes(pro.id) && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="space-y-2 text-xs text-gray-700">
                              <p><strong>Main Service:</strong> {pro.serviceCategory || (pro.serviceCategories && pro.serviceCategories.length > 0 ? pro.serviceCategories[0] : 'Not specified')}</p>
                              {pro.serviceCategories && pro.serviceCategories.length > 0 && (
                                <div>
                                  <p className="font-medium mb-1">All Services:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {pro.serviceCategories.map((service: string, index: number) => (
                                      <Badge
                                        key={index}
                                        variant={service === pro.serviceCategory ? "default" : "secondary"}
                                        className="text-xs"
                                      >
                                        {service}
                                        {service === pro.serviceCategory && " (Main)"}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex gap-2 mt-2">
                          <Badge variant={pro.isActive ? "default" : "secondary"}>
                            {pro.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {pro.subscriptionExpiresAt && (
                            <Badge variant="outline">
                              Expires: {new Date(pro.subscriptionExpiresAt).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendNotification(pro.id, "payment_success")}
                          disabled={sendNotificationMutation.isPending}
                        >
                          Payment Success
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendNotification(pro.id, "payment_failed")}
                          disabled={sendNotificationMutation.isPending}
                        >
                          Payment Failed
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSendNotification(pro.id, "subscription_expiring")}
                          disabled={sendNotificationMutation.isPending}
                        >
                          Expiring Soon
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deletion-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🗑️ Account Deletion Requests
                </CardTitle>
                <CardDescription>
                  View and manage user account deletion requests with their reasons
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deletionRequests && deletionRequests.length > 0 ? (
                    deletionRequests.map((request: any) => (
                      <div key={request.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="destructive">Deletion Request</Badge>
                              <span className="text-sm text-gray-500">
                                #{request.id}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{request.email}</p>
                              <p className="text-sm text-gray-600">
                                Requested: {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant={request.status === 'pending' ? 'secondary' : request.status === 'processed' ? 'default' : 'destructive'}>
                            {request.status || 'Pending'}
                          </Badge>
                        </div>
                        
                        {request.reason && (
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-orange-400">
                            <p className="text-sm font-medium text-gray-700 mb-1">User's Reason:</p>
                            <p className="text-sm text-gray-600">{request.reason}</p>
                          </div>
                        )}
                        
                        {request.userId && (
                          <div className="text-xs text-gray-500">
                            User ID: {request.userId}
                          </div>
                        )}
                        
                        {request.status === 'pending' && (
                          <div className="flex gap-2 pt-3 border-t">
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeletionAction(request.id, 'approved')}
                              className="flex items-center gap-1"
                            >
                              ✅ Approve Deletion
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeletionAction(request.id, 'rejected')}
                              className="flex items-center gap-1"
                            >
                              ❌ Reject Request
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleDeletionAction(request.id, 'processed')}
                              className="flex items-center gap-1"
                            >
                              📝 Mark Processed
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-lg font-medium">No deletion requests found</p>
                      <p className="text-sm">All user accounts are in good standing</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  💬 User Feedback Management
                </CardTitle>
                <CardDescription>
                  View and manage feedback submitted by users
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedbackData && feedbackData.length > 0 ? (
                  <div className="space-y-4">
                    {feedbackData.map((feedback: any) => (
                      <div key={feedback.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{feedback.type || 'General'}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium">{feedback.subject}</p>
                            <p className="text-sm text-gray-700">{feedback.message}</p>
                            {feedback.email && (
                              <p className="text-xs text-gray-500">From: {feedback.email}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium">No feedback submissions yet</p>
                    <p className="text-sm">User feedback will appear here when submitted through the platform</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support-tickets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🎫 Support Ticket Management
                </CardTitle>
                <CardDescription>
                  Manage customer support requests and tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                {supportTickets && supportTickets.length > 0 ? (
                  <div className="space-y-4">
                    {supportTickets.map((ticket: any) => (
                      <div key={ticket.id} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Badge variant={ticket.status === 'open' ? 'destructive' : ticket.status === 'in-progress' ? 'default' : 'secondary'}>
                                {ticket.status}
                              </Badge>
                              <Badge variant="outline">{ticket.priority || 'Normal'}</Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(ticket.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm font-medium">Ticket #{ticket.id}: {ticket.subject}</p>
                            <p className="text-sm text-gray-700">{ticket.description}</p>
                            {ticket.userEmail && (
                              <p className="text-xs text-gray-500">From: {ticket.userEmail}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                const isExpanded = expandedDetails.includes(`ticket-${ticket.id}`);
                                if (isExpanded) {
                                  setExpandedDetails(expandedDetails.filter(id => id !== `ticket-${ticket.id}`));
                                } else {
                                  setExpandedDetails([...expandedDetails, `ticket-${ticket.id}`]);
                                }
                              }}
                            >
                              {expandedDetails.includes(`ticket-${ticket.id}`) ? 'Hide Details' : 'View Details'}
                            </Button>
                            {ticket.status === 'open' && (
                              <Button 
                                size="sm"
                                onClick={() => {
                                  // You can expand this to show assignment options
                                  alert(`Assign ticket #${ticket.id} to admin or support agent`);
                                }}
                              >
                                Assign
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-lg font-medium">No support tickets</p>
                    <p className="text-sm">Customer support requests will appear here when users need assistance</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold">${revenue?.monthlyRevenue || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-xl font-semibold">${revenue?.exactTotalRevenue || "0.00"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Active Professionals</p>
                      <p className="text-2xl font-bold">{stats?.activeProfessionals || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Services</p>
                      <p className="text-xl font-semibold">{stats?.totalServices || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SecureAdminPanel;