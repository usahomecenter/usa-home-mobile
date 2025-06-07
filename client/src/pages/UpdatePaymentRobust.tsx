import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLanguage } from "@/hooks/useLanguage";

// Completely isolated form state management
interface FormData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  zipCode: string;
}

const INITIAL_FORM_DATA: FormData = {
  cardNumber: "",
  cardholderName: "",
  expiryMonth: "",
  expiryYear: "",
  cvv: "",
  zipCode: "",
};

// Individual form component with complete isolation
function PaymentForm({ 
  formType, 
  title, 
  onSave 
}: { 
  formType: 'primary' | 'backup'; 
  title: string; 
  onSave: (data: FormData) => void;
}) {
  // Each form has its own completely independent state with unique key
  const [formData, setFormData] = useState<FormData>(() => ({
    cardNumber: "",
    cardholderName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    zipCode: "",
  }));
  const [isSaving, setIsSaving] = useState(false);

  // Update individual field with complete isolation using unique identifier
  const updateField = useCallback((field: keyof FormData, value: string) => {
    console.log(`🔍 ${formType} form updating ${field}:`, value);
    setFormData(prev => {
      const newData = {
        ...prev,
        [field]: value
      };
      console.log(`🔍 ${formType} form new state:`, newData);
      return newData;
    });
  }, [formType]);

  // Format card number with proper spacing
  const formatCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.startsWith('34') || digitsOnly.startsWith('37')) {
      // American Express: 4-6-5 format
      return digitsOnly.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (match, p1, p2, p3) => {
        let formatted = p1;
        if (p2) formatted += ' ' + p2;
        if (p3) formatted += ' ' + p3;
        return formatted;
      }).substring(0, 17);
    } else {
      // Other cards: 4-4-4-4 format
      return digitsOnly.replace(/(\d{4})(?=\d)/g, '$1 ').substring(0, 19);
    }
  };

  // Handle card number input
  const handleCardNumber = (e: React.FormEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.currentTarget.value);
    updateField('cardNumber', formatted);
  };

  // Handle CVV input
  const handleCvv = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '');
    const isAmex = formData.cardNumber.replace(/\s/g, '').startsWith('34') || 
                   formData.cardNumber.replace(/\s/g, '').startsWith('37');
    const maxLength = isAmex ? 4 : 3;
    updateField('cvv', value.substring(0, maxLength));
  };

  // Handle ZIP code input
  const handleZip = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.replace(/\D/g, '');
    updateField('zipCode', value.substring(0, 5));
  };

  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(formData);
    } finally {
      setIsSaving(false);
    }
  };

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, '0'),
    label: String(i + 1).padStart(2, '0')
  }));

  // Generate years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => ({
    value: String(currentYear + i),
    label: String(currentYear + i)
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form autoComplete="off" data-form-type={formType}>
        <div>
          <label className="block text-sm font-medium mb-2">Card Number</label>
          <Input
            id={`${formType}-card-number`}
            name={`${formType}-card-number-${Date.now()}`}
            value={formData.cardNumber}
            onInput={handleCardNumber}
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            autoComplete="new-password"
            data-form-type="cc-number"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cardholder Name</label>
          <Input
            id={`${formType}-cardholder-name`}
            name={`${formType}-cardholder-name-${Date.now()}`}
            value={formData.cardholderName}
            onChange={(e) => updateField('cardholderName', e.target.value)}
            placeholder="John Doe"
            autoComplete="new-password"
            data-form-type="cc-name"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm font-medium mb-2">Month</label>
            <Select 
              value={formData.expiryMonth} 
              onValueChange={(value) => updateField('expiryMonth', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Select 
              value={formData.expiryYear} 
              onValueChange={(value) => updateField('expiryYear', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="YYYY" />
              </SelectTrigger>
              <SelectContent>
                {years.map(year => (
                  <SelectItem key={year.value} value={year.value}>
                    {year.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">CVV</label>
            <Input
              id={`${formType}-cvv`}
              name={`${formType}-cvv-${Date.now()}`}
              value={formData.cvv}
              onInput={handleCvv}
              placeholder="123"
              maxLength={4}
              autoComplete="new-password"
              data-lpignore="true"
              data-1p-ignore="true"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">ZIP Code</label>
          <Input
            id={`${formType}-zip-code`}
            name={`${formType}-zip-code-${Date.now()}`}
            value={formData.zipCode}
            onInput={handleZip}
            placeholder="12345"
            maxLength={5}
            autoComplete="new-password"
            data-lpignore="true"
            data-1p-ignore="true"
          />
        </div>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? 'Saving...' : `Save ${title}`}
        </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function UpdatePaymentRobust() {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSavePrimary = async (data: FormData) => {
    try {
      console.log('🔍 Primary form data being sent:', {
        cardNumber: data.cardNumber ? `${data.cardNumber.slice(0, 4)}...${data.cardNumber.slice(-4)}` : 'empty',
        cardholderName: data.cardholderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        zipCode: data.zipCode
      });

      await apiRequest('POST', '/api/save-payment-method', {
        type: 'primary',
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardholderName: data.cardholderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        zipCode: data.zipCode
      });

      toast({
        title: "Success",
        description: "Primary payment method saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save primary payment method",
        variant: "destructive",
      });
    }
  };

  const handleSaveBackup = async (data: FormData) => {
    try {
      await apiRequest('POST', '/api/save-payment-method', {
        type: 'backup',
        cardNumber: data.cardNumber.replace(/\s/g, ''),
        cardholderName: data.cardholderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        zipCode: data.zipCode
      });

      toast({
        title: "Success",
        description: "Backup payment method saved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save backup payment method",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Please log in to update payment information.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Update Payment Info
          </h1>
          <p className="text-gray-600">
            Manage your payment methods securely
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <PaymentForm
            key="primary-form"
            formType="primary"
            title="Primary Payment Method"
            onSave={handleSavePrimary}
          />
          
          <PaymentForm
            key="backup-form"
            formType="backup"
            title="Backup Payment Method"
            onSave={handleSaveBackup}
          />
        </div>
      </div>
    </div>
  );
}