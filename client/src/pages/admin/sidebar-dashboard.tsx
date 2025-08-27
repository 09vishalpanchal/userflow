import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  CheckCircle, 
  XCircle,
  UserPlus,
  UserCheck,
  UserX,
  Activity,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function AdminSidebarDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dashboard stats query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/dashboard");
      return response.json();
    },
  });

  // Pending providers query
  const { data: pendingProviders, isLoading: providersLoading } = useQuery({
    queryKey: ['/api/admin/providers/pending'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/providers/pending");
      return response.json();
    },
  });

  // Pending users query
  const { data: pendingUsers, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users/pending'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/users/pending");
      return response.json();
    },
  });

  // Recent actions query
  const { data: recentActions } = useQuery({
    queryKey: ['/api/admin/actions/recent'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/actions/recent");
      return response.json();
    },
  });

  // Approve provider mutation
  const approveProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await apiRequest("POST", `/api/admin/providers/${providerId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({
        title: "Provider Approved",
        description: "Provider has been approved successfully.",
      });
    },
  });

  // Reject provider mutation
  const rejectProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const response = await apiRequest("POST", `/api/admin/providers/${providerId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/providers/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({
        title: "Provider Rejected",
        description: "Provider has been rejected.",
        variant: "destructive",
      });
    },
  });

  // Approve user mutation
  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/approve`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({
        title: "User Approved",
        description: "User has been approved successfully.",
      });
    },
  });

  // Reject user mutation
  const rejectUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest("POST", `/api/admin/users/${userId}/reject`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users/pending'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      toast({
        title: "User Rejected",
        description: "User has been rejected.",
        variant: "destructive",
      });
    },
  });

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "approvals", label: "Approvals", icon: UserCheck, badge: (pendingProviders?.providers?.length || 0) + (pendingUsers?.users?.length || 0) },
    { id: "users", label: "Users", icon: Users },
    { id: "providers", label: "Providers", icon: Briefcase },
    { id: "jobs", label: "Jobs", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "reports", label: "Reports", icon: Activity },
    { id: "messages", label: "Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = () => {
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    setLocation("/");
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.totalUsers || "0"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Providers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.activeProviders || "0"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.stats?.totalJobs || "0"}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(pendingProviders?.providers?.length || 0) + (pendingUsers?.users?.length || 0)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setSelectedTab("approvals")}
            >
              <UserCheck size={16} className="mr-2" />
              Review Pending Approvals
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setSelectedTab("users")}
            >
              <Users size={16} className="mr-2" />
              Manage Users
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setSelectedTab("providers")}
            >
              <Briefcase size={16} className="mr-2" />
              Manage Providers
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActions?.actions?.length > 0 ? (
              <div className="space-y-2">
                {recentActions.actions.slice(0, 5).map((action: any, index: number) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{action.description}</span>
                    <span className="text-muted-foreground ml-auto">{action.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No recent activity</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderApprovals = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pending Approvals</h2>
      
      <Tabs defaultValue="providers" className="w-full">
        <TabsList>
          <TabsTrigger value="providers">
            Provider Approvals ({pendingProviders?.providers?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="users">
            User Approvals ({pendingUsers?.users?.length || 0})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          {providersLoading ? (
            <div>Loading...</div>
          ) : pendingProviders?.providers?.length > 0 ? (
            <div className="grid gap-4">
              {pendingProviders.providers.map((provider: any) => (
                <Card key={provider.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{provider.businessName}</CardTitle>
                        <CardDescription>
                          Phone: {provider.phoneNumber} | Services: {provider.serviceCategories?.join(", ")}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {provider.businessDetails}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveProviderMutation.mutate(provider.id)}
                        disabled={approveProviderMutation.isPending}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectProviderMutation.mutate(provider.id)}
                        disabled={rejectProviderMutation.isPending}
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pending provider approvals</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {usersLoading ? (
            <div>Loading...</div>
          ) : pendingUsers?.users?.length > 0 ? (
            <div className="grid gap-4">
              {pendingUsers.users.map((user: any) => (
                <Card key={user.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{user.name || user.phoneNumber}</CardTitle>
                        <CardDescription>
                          Type: {user.userType} | Phone: {user.phoneNumber}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Pending</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => approveUserMutation.mutate(user.id)}
                        disabled={approveUserMutation.isPending}
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectUserMutation.mutate(user.id)}
                        disabled={rejectUserMutation.isPending}
                      >
                        <XCircle size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No pending user approvals</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderOverview();
      case "approvals":
        return renderApprovals();
      case "users":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">User Management</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">User management features coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "providers":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Provider Management</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Provider management features coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "jobs":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Job Management</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Job management features coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "analytics":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "reports":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Reports</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Report generation coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "messages":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Messages</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Message management coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Settings panel coming soon</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-background flex" data-testid="admin-dashboard">
      {/* Sidebar */}
      <div className={`bg-white border-r transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-16'} flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setSelectedTab(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  selectedTab === item.id
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <Icon size={20} />
                {isSidebarOpen && (
                  <>
                    <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {statsLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </div>
  );
}