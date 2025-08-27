import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Users, UserCheck, UserX, Clock, CheckCircle, XCircle, Eye, Shield } from "lucide-react";

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
  const { toast } = useToast();

  // Get pending providers
  const { data: pendingData, isLoading } = useQuery({
    queryKey: ["/api/admin/providers/pending"],
    enabled: !!user.id,
  });

  const pendingProviders: ProviderProfile[] = pendingData?.providers || [];

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

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8" data-testid="stats-cards">
          <Card data-testid="card-pending-approvals">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock size={16} />
                Pending Approvals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600" data-testid="text-pending-count">
                {pendingProviders.length}
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-total-providers">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users size={16} />
                Total Providers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="text-total-providers">0</div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-approved-today">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck size={16} />
                Approved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600" data-testid="text-approved-today">0</div>
            </CardContent>
          </Card>

          <Card data-testid="card-rejected-today">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserX size={16} />
                Rejected Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600" data-testid="text-rejected-today">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="pending" className="space-y-6" data-testid="admin-tabs">
          <TabsList data-testid="tabs-list">
            <TabsTrigger value="pending" data-testid="tab-pending">
              Pending Approvals ({pendingProviders.length})
            </TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">User Management</TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">Platform Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" data-testid="tab-content-pending">
            <div className="space-y-4">
              {pendingProviders.length === 0 ? (
                <Card data-testid="empty-pending">
                  <CardContent className="text-center py-12">
                    <CheckCircle size={48} className="mx-auto mb-4 opacity-50 text-green-500" />
                    <h3 className="text-lg font-semibold">All caught up!</h3>
                    <p className="text-muted-foreground">No pending provider applications to review</p>
                  </CardContent>
                </Card>
              ) : (
                pendingProviders.map((provider) => (
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
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="users" data-testid="tab-content-users">
            <Card data-testid="user-management-card">
              <CardHeader>
                <CardTitle data-testid="text-user-management">User Management</CardTitle>
                <CardDescription data-testid="text-user-management-description">
                  Manage user accounts, block/unblock users, and view user statistics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground" data-testid="user-management-placeholder">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>User management interface coming soon</p>
                  <p className="text-sm">This will include user search, blocking, and analytics</p>
                </div>
              </CardContent>
            </Card>
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
