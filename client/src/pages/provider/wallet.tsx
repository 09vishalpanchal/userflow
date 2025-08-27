import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ArrowLeft, Wallet, Plus, Minus, CreditCard, History, AlertCircle } from "lucide-react";

const rechargeSchema = z.object({
  amount: z.number().min(100, "Minimum recharge amount is ₹100").max(10000, "Maximum recharge amount is ₹10,000"),
});

type RechargeFormData = z.infer<typeof rechargeSchema>;

interface Transaction {
  id: string;
  type: "recharge" | "unlock";
  amount: string;
  description: string;
  createdAt: string;
}

const quickAmounts = [500, 1000, 2000, 5000];

export default function ProviderWallet() {
  const [, setLocation] = useLocation();
  const [user] = useState({ id: "provider-1", name: "John Provider" }); // This would come from auth context
  const { toast } = useToast();

  const form = useForm<RechargeFormData>({
    resolver: zodResolver(rechargeSchema),
    defaultValues: {
      amount: 500,
    },
  });

  // Get wallet information
  const { data: walletData, isLoading } = useQuery({
    queryKey: ["/api/wallet", user.id],
    enabled: !!user.id,
  });

  const wallet = walletData?.wallet;
  const transactions: Transaction[] = walletData?.transactions || [];
  const balance = wallet ? parseFloat(wallet.balance) : 0;

  const rechargeMutation = useMutation({
    mutationFn: async (data: RechargeFormData) => {
      const response = await apiRequest("POST", `/api/wallet/${user.id}/recharge`, {
        amount: data.amount,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Wallet Recharged",
        description: `₹${form.getValues().amount} has been added to your wallet.`,
      });
      // Invalidate and refetch wallet data
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", user.id] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Recharge Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RechargeFormData) => {
    rechargeMutation.mutate(data);
  };

  const getTransactionIcon = (type: string) => {
    return type === "recharge" ? (
      <Plus className="text-green-500" size={16} />
    ) : (
      <Minus className="text-red-500" size={16} />
    );
  };

  const getTransactionAmount = (transaction: Transaction) => {
    const amount = parseFloat(transaction.amount);
    return transaction.type === "recharge" ? `+₹${amount}` : `-₹${amount}`;
  };

  const getTransactionAmountClass = (type: string) => {
    return type === "recharge" ? "text-green-600" : "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" data-testid="loading-state">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="wallet-page">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8" data-testid="page-header">
          <Button
            variant="ghost"
            onClick={() => setLocation("/provider/dashboard")}
            className="mb-4"
            data-testid="button-back"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Wallet Management</h1>
          <p className="text-muted-foreground" data-testid="text-page-description">
            Manage your wallet balance and view transaction history
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wallet Balance Card */}
          <div className="lg:col-span-1">
            <Card data-testid="balance-card">
              <CardHeader className="text-center">
                <Wallet className="mx-auto mb-4 text-primary" size={48} />
                <CardTitle className="text-2xl" data-testid="text-balance-title">Wallet Balance</CardTitle>
                <div className="text-4xl font-bold text-primary" data-testid="text-current-balance">
                  ₹{balance.toFixed(2)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2" data-testid="text-unlock-info">Job Unlock Price</h4>
                    <p className="text-2xl font-bold">₹100</p>
                    <p className="text-sm text-muted-foreground">per customer contact</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground" data-testid="text-unlocks-available">
                      You can unlock {Math.floor(balance / 100)} customer contacts
                    </p>
                  </div>

                  {balance < 500 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3" data-testid="low-balance-warning">
                      <div className="flex items-center gap-2 text-yellow-700">
                        <AlertCircle size={16} />
                        <span className="font-semibold">Low Balance</span>
                      </div>
                      <p className="text-sm text-yellow-600 mt-1">
                        Consider recharging to avoid missing job opportunities
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recharge and Transactions */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recharge" className="space-y-6" data-testid="wallet-tabs">
              <TabsList className="grid w-full grid-cols-2" data-testid="tabs-list">
                <TabsTrigger value="recharge" data-testid="tab-recharge">Recharge Wallet</TabsTrigger>
                <TabsTrigger value="history" data-testid="tab-history">Transaction History</TabsTrigger>
              </TabsList>

              <TabsContent value="recharge" data-testid="tab-content-recharge">
                <Card data-testid="recharge-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" data-testid="text-recharge-title">
                      <CreditCard size={20} />
                      Recharge Wallet
                    </CardTitle>
                    <CardDescription data-testid="text-recharge-description">
                      Add money to your wallet to unlock customer contacts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-recharge">
                        {/* Quick Amount Buttons */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Quick Select</label>
                          <div className="grid grid-cols-4 gap-3">
                            {quickAmounts.map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant="outline"
                                onClick={() => form.setValue("amount", amount)}
                                data-testid={`button-quick-${amount}`}
                              >
                                ₹{amount}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Recharge Amount</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  data-testid="input-amount"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold mb-2">Payment Information</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Secure payment processing via Razorpay</li>
                            <li>• All major credit/debit cards accepted</li>
                            <li>• UPI and net banking available</li>
                            <li>• Instant balance update after payment</li>
                          </ul>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={rechargeMutation.isPending}
                          data-testid="button-recharge"
                        >
                          {rechargeMutation.isPending ? "Processing..." : `Recharge ₹${form.watch("amount") || 0}`}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" data-testid="tab-content-history">
                <Card data-testid="history-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" data-testid="text-history-title">
                      <History size={20} />
                      Transaction History
                    </CardTitle>
                    <CardDescription data-testid="text-history-description">
                      View all your wallet transactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4" data-testid="transactions-list">
                      {transactions.length === 0 ? (
                        <div className="text-center py-8" data-testid="empty-transactions">
                          <History size={48} className="mx-auto mb-4 opacity-50" />
                          <h3 className="text-lg font-semibold">No transactions yet</h3>
                          <p className="text-muted-foreground">Your transaction history will appear here</p>
                        </div>
                      ) : (
                        transactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 border rounded-lg"
                            data-testid={`transaction-${transaction.id}`}
                          >
                            <div className="flex items-center gap-3">
                              {getTransactionIcon(transaction.type)}
                              <div>
                                <p className="font-semibold" data-testid={`text-description-${transaction.id}`}>
                                  {transaction.description}
                                </p>
                                <p className="text-sm text-muted-foreground" data-testid={`text-date-${transaction.id}`}>
                                  {new Date(transaction.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${getTransactionAmountClass(transaction.type)}`}
                                data-testid={`text-amount-${transaction.id}`}
                              >
                                {getTransactionAmount(transaction)}
                              </p>
                              <Badge
                                variant={transaction.type === "recharge" ? "default" : "secondary"}
                                data-testid={`badge-type-${transaction.id}`}
                              >
                                {transaction.type === "recharge" ? "Credit" : "Debit"}
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
