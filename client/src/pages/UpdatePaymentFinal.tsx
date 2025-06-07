import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UpdatePaymentFinal() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Use refs for uncontrolled inputs - this eliminates cursor jumping
  const primaryCardRef = useRef<HTMLInputElement>(null);
  const primaryNameRef = useRef<HTMLInputElement>(null);
  const primaryCvvRef = useRef<HTMLInputElement>(null);
  const primaryZipRef = useRef<HTMLInputElement>(null);
  
  const backupCardRef = useRef<HTMLInputElement>(null);
  const backupNameRef = useRef<HTMLInputElement>(null);
  const backupCvvRef = useRef<HTMLInputElement>(null);
  const backupZipRef = useRef<HTMLInputElement>(null);
  
  // State only for select dropdowns
  const [primaryMonth, setPrimaryMonth] = useState('');
  const [primaryYear, setPrimaryYear] = useState('');
  const [backupMonth, setBackupMonth] = useState('');
  const [backupYear, setBackupYear] = useState('');
  
  // Track if form has been initialized to prevent clearing
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Add state to track which form is currently active
  const [activeForm, setActiveForm] = useState<'primary' | 'backup' | null>(null);

  const formatCardNumber = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '');
    const limited = digitsOnly.slice(0, 16);
    
    if (limited.startsWith('34') || limited.startsWith('37')) {
      return limited.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').slice(0, 17);
    } else {
      return limited.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
    }
  };

  const handleCardInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const cursorPos = input.selectionStart || 0;
    const oldValue = input.value;
    const formatted = formatCardNumber(input.value);
    
    // Calculate how many spaces were added before cursor position
    const oldDigitsBeforeCursor = oldValue.slice(0, cursorPos).replace(/\D/g, '').length;
    const newValueDigitsOnly = formatted.replace(/\D/g, '');
    
    input.value = formatted;
    
    // Find the new cursor position by counting digits
    let newCursorPos = 0;
    let digitCount = 0;
    
    for (let i = 0; i < formatted.length && digitCount < oldDigitsBeforeCursor; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
      }
      newCursorPos = i + 1;
    }
    
    // Set cursor position after the formatting
    setTimeout(() => {
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleCvvInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/\D/g, '').slice(0, 4);
  };

  const handleZipInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    input.value = input.value.replace(/\D/g, '').slice(0, 5);
  };

  const getFormData = (formType: 'primary' | 'backup') => {
    const refs = formType === 'primary' 
      ? { card: primaryCardRef, name: primaryNameRef, cvv: primaryCvvRef, zip: primaryZipRef }
      : { card: backupCardRef, name: backupNameRef, cvv: backupCvvRef, zip: backupZipRef };
    
    const months = formType === 'primary' ? primaryMonth : backupMonth;
    const years = formType === 'primary' ? primaryYear : backupYear;

    return {
      cardNumber: refs.card.current?.value || '',
      cardholderName: refs.name.current?.value || '',
      cvv: refs.cvv.current?.value || '',
      zipCode: refs.zip.current?.value || '',
      expiryMonth: months,
      expiryYear: years
    };
  };

  const handleSubmit = async (formType: 'primary' | 'backup') => {
    setIsLoading(true);
    
    try {
      const formData = getFormData(formType);
      
      // Basic validation
      if (!formData.cardNumber || !formData.cardholderName || !formData.cvv || !formData.zipCode || !formData.expiryMonth || !formData.expiryYear) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }

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
    formType, 
    icon: Icon 
  }: {
    title: string;
    description: string;
    formType: 'primary' | 'backup';
    icon: any;
  }) => {
    const refs = formType === 'primary' 
      ? { card: primaryCardRef, name: primaryNameRef, cvv: primaryCvvRef, zip: primaryZipRef }
      : { card: backupCardRef, name: backupNameRef, cvv: backupCvvRef, zip: backupZipRef };
    
    const months = formType === 'primary' ? primaryMonth : backupMonth;
    const years = formType === 'primary' ? primaryYear : backupYear;
    const setMonth = formType === 'primary' ? setPrimaryMonth : setBackupMonth;
    const setYear = formType === 'primary' ? setPrimaryYear : setBackupYear;

    return (
      <Card key={`form-${formType}`}>
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
              ref={refs.card}
              onInput={handleCardInput}
              onFocus={() => setActiveForm(formType)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              key={`card-${formType}`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cardholder Name</label>
            <Input
              ref={refs.name}
              onFocus={() => setActiveForm(formType)}
              placeholder="John Doe"
              key={`name-${formType}`}
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <Select value={months} onValueChange={setMonth}>
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
              <Select value={years} onValueChange={setYear}>
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
                ref={refs.cvv}
                onInput={handleCvvInput}
                onFocus={() => setActiveForm(formType)}
                placeholder="123"
                maxLength={4}
                key={`cvv-${formType}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">ZIP Code</label>
            <Input
              ref={refs.zip}
              onInput={handleZipInput}
              onFocus={() => setActiveForm(formType)}
              placeholder="12345"
              maxLength={5}
              key={`zip-${formType}`}
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
  };

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
          formType="primary"
          icon={CreditCard}
        />

        <PaymentForm
          title="Backup Payment Method"
          description="Used if primary payment method fails"
          formType="backup"
          icon={Lock}
        />
      </div>
    </div>
  );
}