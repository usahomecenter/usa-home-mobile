import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePaymentFixed() {
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

  // Use refs to manage cursor position
  const primaryCardRef = useRef<HTMLInputElement>(null);
  const backupCardRef = useRef<HTMLInputElement>(null);

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 16 digits (or 15 for AmEx)
    const limited = digitsOnly.slice(0, 16);
    
    // Format with spaces
    if (limited.startsWith('34') || limited.startsWith('37')) {
      // American Express: 4-6-5 format
      return limited.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').slice(0, 17);
    } else {
      // Other cards: 4-4-4-4 format
      return limited.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>, formType: 'primary' | 'backup') => {
    const input = e.target;
    const value = input.value;
    const cursorPosition = input.selectionStart || 0;
    
    const formatted = formatCardNumber(value);
    
    if (formType === 'primary') {
      setPrimaryForm(prev => ({ ...prev, cardNumber: formatted }));
    } else {
      setBackupForm(prev => ({ ...prev, cardNumber: formatted }));
    }
    
    // Restore cursor position after state update
    setTimeout(() => {
      if (input.selectionStart !== null) {
        input.setSelectionRange(cursorPosition, cursorPosition);
      }
    }, 0);
  };

  const handleFieldChange = (field: string, value: string, formType: 'primary' | 'backup') => {
    if (field === 'cardNumber') {
      handleCardNumberChange(value, formType);
      return;
    }

    // Handle other field validations
    if (field === 'zipCode') {
      value = value.replace(/\D/g, '').slice(0, 5);
    } else if (field === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 4);
    }
    
    if (formType === 'primary') {
      setPrimaryForm(prev => ({ ...prev, [field]: value }));
    } else {
      setBackupForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (formType: 'primary' | 'backup') => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Payment Information Updated",
        description: `${formType === 'primary' ? 'Primary' : 'Backup'} payment method saved successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update payment information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const PaymentForm = ({ 
    title, 
    description, 
    formData, 
    formType, 
    icon: Icon 
  }: {
    title: string;
    description: string;
    formData: typeof primaryForm;
    formType: 'primary' | 'backup';
    icon: any;
  }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <Input
            ref={formType === 'primary' ? primaryCardRef : backupCardRef}
            value={formData.cardNumber}
            onChange={(e) => handleCardNumberChange(e, formType)}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cardholder Name</label>
          <Input
            value={formData.cardholderName}
            onChange={(e) => handleFieldChange('cardholderName', e.target.value, formType)}
            placeholder="John Doe"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <Select value={formData.expiryMonth} onValueChange={(value) => handleFieldChange('expiryMonth', value, formType)}>
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

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select value={formData.expiryYear} onValueChange={(value) => handleFieldChange('expiryYear', value, formType)}>
              <SelectTrigger>
                <SelectValue placeholder="YY" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i} value={String(new Date().getFullYear() + i).slice(-2)}>
                    {String(new Date().getFullYear() + i).slice(-2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CVV</label>
            <Input
              value={formData.cvv}
              onChange={(e) => handleFieldChange('cvv', e.target.value, formType)}
              placeholder="123"
              maxLength={4}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <Input
            value={formData.zipCode}
            onChange={(e) => handleFieldChange('zipCode', e.target.value, formType)}
            placeholder="12345"
            maxLength={5}
          />
        </div>

        <Button 
          onClick={() => handleSubmit(formType)}
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
        <PaymentForm
          title="Primary Payment Method"
          description="Your main payment method for subscription charges"
          formData={primaryForm}
          formType="primary"
          icon={CreditCard}
        />

        <PaymentForm
          title="Backup Payment Method"
          description="Used if primary payment method fails"
          formData={backupForm}
          formType="backup"
          icon={Lock}
        />
      </div>
    </div>
  );
}