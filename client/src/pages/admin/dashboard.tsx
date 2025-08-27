import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, UserCheck, UserX, Clock, CheckCircle, XCircle, Eye, Shield, IndianRupee, TrendingUp, Briefcase, Bell, Settings, Search, Filter, AlertTriangle, Wallet } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  businessDetails: string;
  serviceCategories: string[];
  location: string;
  status: "pending" | "approved" | "rejected";
  documentsUploaded: boolean;
  user?: {
    name?: string;
    email?: string;
    phoneNumber: string;
  };
}

export default function AdminDashboard() {
  const [user] = useState({ id: "admin-1", name: "Admin User" }); // This would come from auth context
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  // Fetch comprehensive dashboard data
  const { data: dashboardData } = useQuery({
    queryKey: ["/api/admin/dashboard"],
    enabled: !!user.id,
  });

  const { data: recentActions } = useQuery({
    queryKey: ["/api/admin/actions/recent"],
    enabled: !!user.id,
  });

  const { data: pendingUsersData } = useQuery({
    queryKey: ["/api/admin/users/pending"],
    enabled: !!user.id,
  });

  // Mock chart data (in production, this would come from API)
  const jobsPerDayData = [
    { date: "Mon", jobs: 12 },
    { date: "Tue", jobs: 19 },
    { date: "Wed", jobs: 15 },
    { date: "Thu", jobs: 22 },
    { date: "Fri", jobs: 28 },
    { date: "Sat", jobs: 35 },
    { date: "Sun", jobs: 18 }
  ];

  const revenueData = [
    { month: "Jan", revenue: 15000 },
    { month: "Feb", revenue: 23000 },
    { month: "Mar", revenue: 31000 },
    { month: "Apr", revenue: 28000 },
    { month: "May", revenue: 42000 },
    { month: "Jun", revenue: 38000 }
  ];

  const categoryData = [
    { name: "Home Cleaning", value: 35, color: "#8884d8" },
    { name: "Plumbing", value: 25, color: "#82ca9d" },
    { name: "Electrical", value: 20, color: "#ffc658" },
    { name: "Beauty", value: 12, color: "#ff7300" },
    { name: "Others", value: 8, color: "#0088fe" }
  ];

  // Get pending providers
  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["/api/admin/providers/pending"],
    enabled: !!user.id,
  });

  const pendingProviders: ProviderProfile[] = (pendingData as any)?.providers || [];
  const pendingUsers = (pendingUsersData as any)?.users || [];
  
  // Enhanced dashboard stats
  const stats = (dashboardData as any)?.stats || {
    totalUsers: 247,
    activeProviders: 89,
    totalJobs: 156,
    monthlyRevenue: 45000,
    pendingApprovals: pendingProviders.length + pendingUsers.length,
    approvedToday: 3,
    rejectedToday: 1
  };

  const approveMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/providers/${userId}/approve`);
      return response.json();
    },
    onSuccess: (data, userId) => {
      toast({
        title: "Provider Approved",
        description: "The service provider has been approved and can now start receiving jobs.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/providers/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/providers/${userId}/reject`);
      return response.json();
    },
    onSuccess: (data, userId) => {
      toast({
        title: "Provider Rejected",
        description: "The service provider application has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/providers/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/approve`);
      return response.json();
    },
    onSuccess: (data, userId) => {
      toast({
        title: "User Approved",
        description: "The user has been approved and can now access the platform.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Approval Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const rejectUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/reject`);
      return response.json();
    },
    onSuccess: (data, userId) => {
      toast({
        title: "User Rejected",
        description: "The user registration has been rejected.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Rejection Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const blockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/block`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "User Blocked",
        description: "The user has been blocked successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/providers/pending"] });
    },
    onError: (error: any) => {
      toast({
        title: "Block Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (userId: string) => {
    approveMutation.mutate(userId);
  };

  const handleReject = (userId: string) => {
    rejectMutation.mutate(userId);
  };

  const handleApproveUser = (userId: string) => {
    approveUserMutation.mutate(userId);
  };

  const handleRejectUser = (userId: string) => {
    rejectUserMutation.mutate(userId);
  };

  const handleBlockUser = (userId: string) => {
    blockUserMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8" data-testid="dashboard-header">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="text-primary" size={24} />
            <h1 className="text-3xl font-bold" data-testid="text-welcome">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground" data-testid="text-subtitle">
            Manage service providers, users, and platform operations
          </p>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8" data-testid="stats-cards">
          <Card data-testid="stat-total-users">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-active-providers">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProviders}</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-total-jobs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs}</div>
              <p className="text-xs text-muted-foreground">+25% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-monthly-revenue">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% from last month</p>
            </CardContent>
          </Card>

          <Card data-testid="stat-pending-approvals">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">Needs attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" data-testid="admin-tabs">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="pending">Approvals ({pendingProviders.length + pendingUsers.length})</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="jobs">Jobs</TabsTrigger>
            <TabsTrigger value="wallet">Wallet & Pricing</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Jobs Per Day</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={jobsPerDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="jobs" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`₹${value}`, "Revenue"]} />
                      <Line type="monotone" dataKey="revenue" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Service Categories Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Admin Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(recentActions as any)?.actions?.map((action: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <p className="font-medium">{action.action}</p>
                          <p className="text-sm text-muted-foreground">{action.target}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{action.time}</span>
                      </div>
                    )) || (
                      <div className="text-center text-muted-foreground py-4">
                        No recent actions
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pending" data-testid="tab-content-pending">
            <div className="space-y-6">
              {/* Pending Users Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users size={20} />
                  Pending User Registrations ({pendingUsers.length})
                </h3>
                {pendingUsers.length === 0 ? (
                  <Card data-testid="empty-pending-users">
                    <CardContent className="text-center py-8">
                      <UserCheck className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">No pending user registrations</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-3">
                    {pendingUsers.map((user: any) => (
                      <Card key={user.id} className="hover:shadow-md transition-shadow" data-testid={`card-user-${user.id}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {user.userType === 'customer' ? 'Customer' : 'Provider'}
                                </Badge>
                                <span className="font-medium">{user.phoneNumber}</span>
                              </div>
                              {user.name && <p className="text-sm text-muted-foreground">{user.name}</p>}
                              <p className="text-xs text-muted-foreground">
                                Registered: {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveUser(user.id)}
                                disabled={approveUserMutation.isPending}
                                data-testid={`button-approve-user-${user.id}`}
                              >
                                <CheckCircle size={16} className="mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleRejectUser(user.id)}
                                disabled={rejectUserMutation.isPending}
                                data-testid={`button-reject-user-${user.id}`}
                              >
                                <XCircle size={16} className="mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Providers Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Briefcase size={20} />
                  Pending Service Providers ({pendingProviders.length})
                </h3>
                {pendingProviders.length === 0 && pendingUsers.length === 0 ? (
                <Card data-testid="empty-pending">
                  <CardContent className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
                    <h3 className="text-lg font-semibold">All caught up!</h3>
                    <p className="text-muted-foreground">No pending applications to review</p>
                  </CardContent>
                </Card>
                  ) : (
                  <div className="space-y-3">
                    {pendingProviders.map((provider) => (
                  <Card key={provider.id} className="hover:shadow-md transition-shadow" data-testid={`card-provider-${provider.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg" data-testid={`text-business-name-${provider.id}`}>
                            {provider.businessName}
                          </CardTitle>
                          <CardDescription data-testid={`text-provider-info-${provider.id}`}>
                            <div className="space-y-1">
                              <p><strong>Owner:</strong> {provider.user?.name || "N/A"}</p>
                              <p><strong>Phone:</strong> {provider.user?.phoneNumber}</p>
                              <p><strong>Email:</strong> {provider.user?.email || "N/A"}</p>
                              <p><strong>Location:</strong> {provider.location}</p>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline" data-testid={`badge-status-${provider.id}`}>
                            <Clock size={14} className="mr-1" />
                            Pending Review
                          </Badge>
                          {provider.documentsUploaded && (
                            <Badge variant="secondary" data-testid={`badge-docs-${provider.id}`}>
                              Documents Uploaded
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Business Details</h4>
                          <p className="text-muted-foreground text-sm" data-testid={`text-details-${provider.id}`}>
                            {provider.businessDetails}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Service Categories</h4>
                          <div className="flex flex-wrap gap-2" data-testid={`categories-${provider.id}`}>
                            {provider.serviceCategories.map((category, index) => (
                              <Badge key={index} variant="outline">{category}</Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-docs-${provider.id}`}
                            >
                              <Eye size={14} className="mr-1" />
                              View Documents
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(provider.userId)}
                              disabled={rejectMutation.isPending}
                              data-testid={`button-reject-${provider.id}`}
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => handleApprove(provider.userId)}
                              disabled={approveMutation.isPending}
                              size="sm"
                              data-testid={`button-approve-${provider.id}`}
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">User Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search Users
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick User Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    View All Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Blocked Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Briefcase className="h-4 w-4 mr-2" />
                    Provider Profiles
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Wallet className="h-4 w-4 mr-2" />
                    Add Provider Balance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Customers:</span>
                      <span className="font-medium">158</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Providers:</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Blocked Users:</span>
                      <span className="font-medium text-red-600">3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>New This Month:</span>
                      <span className="font-medium text-green-600">42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Jobs Management Tab */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Job Management</h3>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                View All Jobs
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Job Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">89</div>
                      <p className="text-sm text-muted-foreground">Open Jobs</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">67</div>
                      <p className="text-sm text-muted-foreground">Closed Jobs</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-600">3</div>
                      <p className="text-sm text-muted-foreground">Flagged Jobs</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600">12</div>
                      <p className="text-sm text-muted-foreground">Under Review</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Job Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    Review Flagged Jobs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove Spam Jobs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Job Status
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Wallet & Pricing Tab */}
          <TabsContent value="wallet" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Wallet & Pricing Management</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Global Unlock Fee</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">₹100</div>
                  <p className="text-sm text-muted-foreground mb-4">Current unlock fee per job</p>
                  <Button size="sm" data-testid="update-unlock-fee">
                    Update Pricing
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Provider Wallet Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Total Balance:</span>
                      <span className="font-medium">₹25,400</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Providers:</span>
                      <span className="font-medium">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg. Balance:</span>
                      <span className="font-medium">₹285</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Today's Transactions:</span>
                      <span className="font-medium">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Revenue Today:</span>
                      <span className="font-medium text-green-600">₹2,400</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Transaction Logs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pricing Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Home Cleaning:</span>
                      <span className="font-medium">₹100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Plumbing:</span>
                      <span className="font-medium">₹150</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Electrical:</span>
                      <span className="font-medium">₹120</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Update Category Pricing
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" data-testid="tab-content-settings">
            <Card data-testid="settings-card">
              <CardHeader>
                <CardTitle data-testid="text-platform-settings">Platform Settings</CardTitle>
                <CardDescription data-testid="text-settings-description">
                  Configure platform-wide settings and pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Current Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Job Unlock Price:</span>
                        <span className="font-semibold">₹100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Unlocks per Job:</span>
                        <span className="font-semibold">3</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Default Service Radius:</span>
                        <span className="font-semibold">5 km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Max Service Radius:</span>
                        <span className="font-semibold">20 km</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center py-4 text-muted-foreground">
                    <p>Advanced settings panel coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
