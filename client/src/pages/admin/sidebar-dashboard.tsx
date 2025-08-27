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

  // Total wallets query
  const { data: walletsData } = useQuery({
    queryKey: ['/api/admin/wallets/total'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/wallets/total");
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
  const { data: pendingUsers, isLoading: pendingUsersLoading } = useQuery({
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
    { id: "transactions", label: "Transactions", icon: Activity },
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
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₹{walletsData?.totalBalance || "0.00"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {walletsData?.walletCount || 0} wallets
              </p>
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
          {pendingUsersLoading ? (
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

  // All users query
  const { data: allUsersData } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/users");
      return response.json();
    },
  });

  // Add balance modal state
  const [addBalanceModal, setAddBalanceModal] = useState({
    isOpen: false,
    providerId: '',
    currentBalance: 0,
    amount: ''
  });

  const addBalanceMutation = useMutation({
    mutationFn: async ({ providerId, amount }: { providerId: string, amount: number }) => {
      const response = await apiRequest("POST", "/api/admin/wallet/add-balance", {
        providerId,
        amount,
        adminId: "admin-1" // This would come from auth context
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Balance Added Successfully",
        description: `₹${addBalanceModal.amount} has been added to provider wallet`,
      });
      setAddBalanceModal({ isOpen: false, providerId: '', currentBalance: 0, amount: '' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/wallets/total'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add balance",
        variant: "destructive",
      });
    },
  });

  const handleAddBalance = (providerId: string, currentBalance: number) => {
    setAddBalanceModal({
      isOpen: true,
      providerId,
      currentBalance,
      amount: ''
    });
  };

  const submitAddBalance = () => {
    const amount = parseFloat(addBalanceModal.amount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }
    addBalanceMutation.mutate({ providerId: addBalanceModal.providerId, amount });
  };

  // Users management state
  const [usersFilters, setUsersFilters] = useState({
    search: '',
    userType: 'all',
    status: 'all',
    page: 1,
    limit: 10
  });

  // Users query with pagination and filters
  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users/paginated', usersFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: usersFilters.search,
        userType: usersFilters.userType,
        status: usersFilters.status,
        page: usersFilters.page.toString(),
        limit: usersFilters.limit.toString()
      });
      const response = await apiRequest("GET", `/api/admin/users/paginated?${params}`);
      return response.json();
    },
  });

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Total: {usersData?.total || 0} users
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="user-search">Search Users</Label>
              <Input
                id="user-search"
                placeholder="Name or phone..."
                value={usersFilters.search}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <Label>User Type</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={usersFilters.userType}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, userType: e.target.value, page: 1 }))}
              >
                <option value="all">All Types</option>
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={usersFilters.status}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <Label>Per Page</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={usersFilters.limit}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {usersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : usersData?.users?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
            <p className="text-gray-600">No users match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {usersData?.users?.map((user: any) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={user.userType === 'provider' ? 'default' : 'secondary'}>
                        {user.userType}
                      </Badge>
                      <span className="font-medium">{user.name || user.phoneNumber}</span>
                      {user.userType === 'provider' && (
                        <Badge variant="outline" className="text-green-600">
                          <Wallet size={12} className="mr-1" />
                          ₹{user.walletBalance || '0.00'}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Phone: {user.phoneNumber} | Joined: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant={user.isApproved ? 'default' : 'destructive'}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                      <Badge variant={user.isBlocked ? 'destructive' : 'default'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {user.userType === 'provider' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddBalance(user.id, parseFloat(user.walletBalance || '0'))}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Balance
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((usersFilters.page - 1) * usersFilters.limit) + 1} to{' '}
                  {Math.min(usersFilters.page * usersFilters.limit, usersData?.total || 0)} of{' '}
                  {usersData?.total || 0} users
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersFilters.page <= 1}
                    onClick={() => setUsersFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {usersFilters.page} of {usersData?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={usersFilters.page >= (usersData?.totalPages || 1)}
                    onClick={() => setUsersFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  // Jobs management state
  const [jobsFilters, setJobsFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    page: 1,
    limit: 10
  });

  // Jobs query
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['/api/admin/jobs/paginated', jobsFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: jobsFilters.search,
        category: jobsFilters.category,
        status: jobsFilters.status,
        page: jobsFilters.page.toString(),
        limit: jobsFilters.limit.toString()
      });
      const response = await apiRequest("GET", `/api/admin/jobs/paginated?${params}`);
      return response.json();
    },
  });

  // Transactions management state
  const [transactionsFilters, setTransactionsFilters] = useState({
    search: '',
    type: 'all',
    page: 1,
    limit: 10
  });

  // Transactions query
  const { data: transactionsData, isLoading: transactionsLoading } = useQuery({
    queryKey: ['/api/admin/transactions/paginated', transactionsFilters],
    queryFn: async () => {
      const params = new URLSearchParams({
        search: transactionsFilters.search,
        type: transactionsFilters.type,
        page: transactionsFilters.page.toString(),
        limit: transactionsFilters.limit.toString()
      });
      const response = await apiRequest("GET", `/api/admin/transactions/paginated?${params}`);
      return response.json();
    },
  });

  const renderProviders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Provider Management</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Total: {usersData?.users?.filter((u: any) => u.userType === 'provider').length || 0} providers
          </Badge>
        </div>
      </div>

      {/* Use same filters as users but only show providers */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="provider-search">Search Providers</Label>
              <Input
                id="provider-search"
                placeholder="Business name or phone..."
                value={usersFilters.search}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={usersFilters.status}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div>
              <Label>Per Page</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={usersFilters.limit}
                onChange={(e) => setUsersFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Providers List */}
      {usersLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : usersData?.users?.filter((user: any) => user.userType === 'provider').length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Providers Found</h3>
            <p className="text-gray-600">No providers match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {usersData?.users?.filter((user: any) => user.userType === 'provider').map((provider: any) => (
            <Card key={provider.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{provider.businessName || provider.name || provider.phoneNumber}</CardTitle>
                    <CardDescription>
                      {provider.serviceCategories?.join(", ") || "No categories set"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-600">
                      <Wallet size={12} className="mr-1" />
                      ₹{provider.walletBalance || '0.00'}
                    </Badge>
                    <Badge variant={provider.isApproved ? 'default' : 'destructive'}>
                      {provider.isApproved ? 'Approved' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {provider.businessDetails || "No business details provided"}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Location: {provider.location || "Not specified"} | 
                      Rating: {provider.rating ? `${provider.rating}⭐` : "No ratings"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddBalance(provider.id, parseFloat(provider.walletBalance || '0'))}
                        className="text-green-600 hover:text-green-700"
                      >
                        <Plus size={14} className="mr-1" />
                        Add Balance
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View Profile
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
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Job Management</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Total: {jobsData?.total || 0} jobs
          </Badge>
        </div>
      </div>

      {/* Job Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="job-search">Search Jobs</Label>
              <Input
                id="job-search"
                placeholder="Title or description..."
                value={jobsFilters.search}
                onChange={(e) => setJobsFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <Label>Category</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={jobsFilters.category}
                onChange={(e) => setJobsFilters(prev => ({ ...prev, category: e.target.value, page: 1 }))}
              >
                <option value="all">All Categories</option>
                <option value="Home Cleaning">Home Cleaning</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical Work">Electrical Work</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Painting">Painting</option>
                <option value="Gardening">Gardening</option>
              </select>
            </div>
            <div>
              <Label>Status</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={jobsFilters.status}
                onChange={(e) => setJobsFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <Label>Per Page</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={jobsFilters.limit}
                onChange={(e) => setJobsFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      {jobsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : jobsData?.jobs?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Found</h3>
            <p className="text-gray-600">No jobs match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {jobsData?.jobs?.map((job: any) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{job.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{job.category}</Badge>
                        <Badge variant={job.urgency === 'urgent' ? 'destructive' : job.urgency === 'asap' ? 'default' : 'secondary'}>
                          {job.urgency}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">₹{job.budget}</div>
                      <div className="text-sm text-muted-foreground">{job.location}</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Posted: {new Date(job.createdAt).toLocaleDateString()} | 
                      Proposals: {job.proposals || 0}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((jobsFilters.page - 1) * jobsFilters.limit) + 1} to{' '}
                  {Math.min(jobsFilters.page * jobsFilters.limit, jobsData?.total || 0)} of{' '}
                  {jobsData?.total || 0} jobs
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={jobsFilters.page <= 1}
                    onClick={() => setJobsFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {jobsFilters.page} of {jobsData?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={jobsFilters.page >= (jobsData?.totalPages || 1)}
                    onClick={() => setJobsFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transaction Management</h2>
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            Total: {transactionsData?.total || 0} transactions
          </Badge>
        </div>
      </div>

      {/* Transaction Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="transaction-search">Search Transactions</Label>
              <Input
                id="transaction-search"
                placeholder="Transaction ID or description..."
                value={transactionsFilters.search}
                onChange={(e) => setTransactionsFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>
            <div>
              <Label>Type</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={transactionsFilters.type}
                onChange={(e) => setTransactionsFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
              >
                <option value="all">All Types</option>
                <option value="recharge">Recharge</option>
                <option value="unlock">Unlock</option>
                <option value="refund">Refund</option>
              </select>
            </div>
            <div>
              <Label>Per Page</Label>
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={transactionsFilters.limit}
                onChange={(e) => setTransactionsFilters(prev => ({ ...prev, limit: parseInt(e.target.value), page: 1 }))}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      {transactionsLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      ) : transactionsData?.transactions?.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Activity className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600">No transactions match your current filters.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transactionsData?.transactions?.map((transaction: any) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge variant={transaction.type === 'recharge' ? 'default' : transaction.type === 'unlock' ? 'secondary' : 'destructive'}>
                        {transaction.type}
                      </Badge>
                      <span className="font-medium">₹{transaction.amount}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{transaction.description}</p>
                    <div className="text-xs text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye size={14} className="mr-1" />
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {((transactionsFilters.page - 1) * transactionsFilters.limit) + 1} to{' '}
                  {Math.min(transactionsFilters.page * transactionsFilters.limit, transactionsData?.total || 0)} of{' '}
                  {transactionsData?.total || 0} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={transactionsFilters.page <= 1}
                    onClick={() => setTransactionsFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {transactionsFilters.page} of {transactionsData?.totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={transactionsFilters.page >= (transactionsData?.totalPages || 1)}
                    onClick={() => setTransactionsFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (selectedTab) {
      case "overview":
        return renderOverview();
      case "approvals":
        return renderApprovals();
      case "users":
        return renderUsers();
      case "providers":
        return renderProviders();
      // Handled above with providers case
      case "jobs":
        return renderJobs();
      case "transactions":
        return renderTransactions();
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

      {/* Add Balance Modal */}
      <Dialog open={addBalanceModal.isOpen} onOpenChange={(open) => 
        setAddBalanceModal(prev => ({ ...prev, isOpen: open }))
      }>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet size={20} />
              Add Balance to Provider Wallet
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <div className="flex items-center justify-center gap-1 text-xl font-bold text-green-600">
                <IndianRupee size={18} />
                <span>{addBalanceModal.currentBalance.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="admin-amount">Amount to Add</Label>
              <div className="relative mt-1">
                <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="admin-amount"
                  type="number"
                  placeholder="Enter amount"
                  value={addBalanceModal.amount}
                  onChange={(e) => setAddBalanceModal(prev => ({ ...prev, amount: e.target.value }))}
                  className="pl-10"
                  min="1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setAddBalanceModal({ isOpen: false, providerId: '', currentBalance: 0, amount: '' })}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={submitAddBalance}
                disabled={addBalanceMutation.isPending}
                className="flex-1"
              >
                {addBalanceMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus size={16} />
                    Add Balance
                  </div>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}