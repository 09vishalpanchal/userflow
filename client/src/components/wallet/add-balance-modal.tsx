import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { QrCode, CreditCard, Wallet, IndianRupee, CheckCircle } from "lucide-react";

interface AddBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  currentBalance: number;
}

const QUICK_AMOUNTS = [500, 1000, 2000, 5000];

export function AddBalanceModal({ isOpen, onClose, providerId, currentBalance }: AddBalanceModalProps) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"qr" | "razorpay">("qr");
  const [showPayment, setShowPayment] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rechargeWalletMutation = useMutation({
    mutationFn: async (rechargeAmount: number) => {
      const response = await apiRequest("POST", `/api/wallet/${providerId}/recharge`, {
        amount: rechargeAmount
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Balance Added Successfully!",
        description: `₹${amount} has been added to your wallet. New balance: ₹${data.newBalance}`,
      });
      
      // Refresh wallet data
      queryClient.invalidateQueries({ queryKey: ["/api/wallet", providerId] });
      
      // Close modal and reset state
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to add balance. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setAmount("");
    setShowPayment(false);
    setPaymentMethod("qr");
    onClose();
  };

  const handleAmountSubmit = () => {
    const rechargeAmount = parseFloat(amount);
    if (!rechargeAmount || rechargeAmount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum recharge amount is ₹100",
        variant: "destructive",
      });
      return;
    }

    if (rechargeAmount > 50000) {
      toast({
        title: "Invalid Amount",
        description: "Maximum recharge amount is ₹50,000",
        variant: "destructive",
      });
      return;
    }

    setShowPayment(true);
  };

  const handlePayment = () => {
    const rechargeAmount = parseFloat(amount);
    
    if (paymentMethod === "qr") {
      // Simulate QR code payment completion
      setTimeout(() => {
        rechargeWalletMutation.mutate(rechargeAmount);
      }, 2000);
    } else {
      // For Razorpay, we would integrate with their SDK
      // For now, simulate payment success
      setTimeout(() => {
        rechargeWalletMutation.mutate(rechargeAmount);
      }, 1500);
    }
  };

  const setQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="add-balance-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Add Balance to Wallet
          </DialogTitle>
        </DialogHeader>

        {!showPayment ? (
          // Amount Selection
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Balance</p>
              <div className="flex items-center justify-center gap-1 text-2xl font-bold text-green-600">
                <IndianRupee size={20} />
                <span>{currentBalance.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="amount">Enter Amount</Label>
              <div className="relative mt-1">
                <IndianRupee size={16} className="absolute left-3 top-3 text-gray-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                  min="100"
                  max="50000"
                  data-testid="amount-input"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Minimum: ₹100 | Maximum: ₹50,000
              </p>
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <Label className="text-sm">Quick Select</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {QUICK_AMOUNTS.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickAmount(quickAmount)}
                    className="h-10"
                    data-testid={`quick-amount-${quickAmount}`}
                  >
                    ₹{quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleAmountSubmit}
              className="w-full"
              disabled={!amount || parseFloat(amount) < 100}
              data-testid="proceed-payment"
            >
              Proceed to Payment
            </Button>
          </div>
        ) : (
          // Payment Method Selection
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Amount to Add</p>
              <div className="flex items-center justify-center gap-1 text-xl font-bold">
                <IndianRupee size={18} />
                <span>₹{amount}</span>
              </div>
            </div>

            <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "qr" | "razorpay")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr" className="flex items-center gap-2">
                  <QrCode size={16} />
                  QR Code
                </TabsTrigger>
                <TabsTrigger value="razorpay" className="flex items-center gap-2">
                  <CreditCard size={16} />
                  Razorpay
                </TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="space-y-4">
                <Card>
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-lg">Scan QR Code to Pay</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <QrCode size={64} className="mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">QR Code will appear here</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mb-4">
                      UPI • Google Pay • PhonePe • Paytm
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Scan with any UPI app to complete payment
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="razorpay" className="space-y-4">
                <Card>
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-lg">Razorpay Payment</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="w-48 h-32 mx-auto bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <CreditCard size={48} className="mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-medium">Secure Payment</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="mb-4">
                      Cards • UPI • Netbanking • Wallets
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Powered by Razorpay secure payment gateway
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPayment(false)}
                className="flex-1"
                data-testid="back-to-amount"
              >
                Back
              </Button>
              <Button
                onClick={handlePayment}
                disabled={rechargeWalletMutation.isPending}
                className="flex-1"
                data-testid="pay-now"
              >
                {rechargeWalletMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} />
                    Pay Now
                  </div>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}