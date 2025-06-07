import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePaymentPageSimple() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Primary payment form state
  const [primaryForm, setPrimaryForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    zipCode: ''
  });

  // Backup payment form state
  const [backupForm, setBackupForm] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    zipCode: ''
  });

  const handlePrimaryChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'zipCode') {
      value = value.replace(/\D/g, '').slice(0, 5);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setPrimaryForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBackupChange = (field: string, value: string) => {
    if (field === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
    } else if (field === 'zipCode') {
      value = value.replace(/\D/g, '').slice(0, 5);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    setBackupForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (formType: 'primary' | 'backup') => {
    setIsLoading(true);
    try {
      const formData = formType === 'primary' ? primaryForm : backupForm;
      
      const response = await fetch(`/api/payment-methods/${formType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${formType} payment method updated successfully!`,
        });
      } else {
        throw new Error('Failed to update payment method');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment method. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PaymentFormSection = ({ 
    title, 
    description, 
    formData, 
    onChange, 
    onSubmit 
  }: {
    title: string;
    description: string;
    formData: any;
    onChange: (field: string, value: string) => void;
    onSubmit: () => void;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Number</label>
          <Input
            placeholder="1234567890123456"
            value={formData.cardNumber}
            onChange={(e) => onChange('cardNumber', e.target.value)}
            maxLength={16}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Month</label>
            <Select value={formData.expiryMonth} onValueChange={(value) => onChange('expiryMonth', value)}>
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                    {String(i + 1).padStart(2, '0')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Year</label>
            <Select value={formData.expiryYear} onValueChange={(value) => onChange('expiryYear', value)}>
              <SelectTrigger>
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">CVV</label>
          <Input
            placeholder="123"
            value={formData.cvv}
            onChange={(e) => onChange('cvv', e.target.value)}
            maxLength={4}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Cardholder Name</label>
          <Input
            placeholder="John Doe"
            value={formData.cardholderName}
            onChange={(e) => onChange('cardholderName', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">ZIP Code</label>
          <Input
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => onChange('zipCode', e.target.value)}
            maxLength={5}
          />
        </div>

        <Button onClick={onSubmit} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Saving...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Save {title}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Update Payment Information</h1>
        <p className="text-muted-foreground">
          Manage your primary and backup payment methods. CVV is never stored for security.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <PaymentFormSection
          title="Primary Payment Method"
          description="Your main payment method for subscription charges"
          formData={primaryForm}
          onChange={handlePrimaryChange}
          onSubmit={() => handleSubmit('primary')}
        />

        <PaymentFormSection
          title="Backup Payment Method"
          description="Used if primary payment method fails"
          formData={backupForm}
          onChange={handleBackupChange}
          onSubmit={() => handleSubmit('backup')}
        />
      </div>
    </div>
  );
}