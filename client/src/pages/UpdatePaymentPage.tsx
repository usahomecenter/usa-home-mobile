import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, Lock, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Enhanced validation schema
const formSchema = z.object({
  cardNumber: z.string()
    .min(15, { message: "Card number must be at least 15 digits" })
    .refine((value) => {
      const digits = value.replace(/\s/g, '');
      const isAmex = /^3[47]/.test(digits);
      const isVisa = /^4/.test(digits);
      const isMastercard = /^5[1-5]/.test(digits);
      const isDiscover = /^6(?:011|5)/.test(digits);
      
      if (isAmex && digits.length !== 15) {
        return false;
      } else if ((isVisa || isMastercard || isDiscover) && digits.length !== 16) {
        return false;
      } else if (!isAmex && !isVisa && !isMastercard && !isDiscover && !/^\d{15,16}$/.test(digits)) {
        return false;
      }
      return true;
    }, { message: "Invalid card number format" }),
  cardName: z.string().min(2, { message: "Name on card is required" }),
  expiryMonth: z.string().min(1, { message: "Expiry month is required" }),
  expiryYear: z.string().min(1, { message: "Expiry year is required" }),
  cvv: z.string()
    .min(3, { message: "CVV must be at least 3 digits" })
    .max(4, { message: "CVV must be at most 4 digits" })
    .regex(/^[0-9]+$/, { message: "CVV must contain only digits" }),
  zipCode: z.string()
    .min(5, { message: "ZIP code must be exactly 5 digits" })
    .max(5, { message: "ZIP code must be exactly 5 digits" })
    .regex(/^[0-9]+$/, { message: "ZIP code must contain only digits" }),
});

type FormData = z.infer<typeof formSchema>;

export default function UpdatePaymentPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState({ primary: false, backup: false });

  // Save form data to localStorage (excluding CVV for security)
  const saveFormData = (formType: 'primary' | 'backup', data: any) => {
    const key = `paymentForm_${formType}`;
    const dataToSave = { ...data, cvv: '' };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  };

  // Load form data from localStorage
  const loadFormData = (formType: 'primary' | 'backup') => {
    const key = `paymentForm_${formType}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return { ...JSON.parse(saved), cvv: '' };
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      zipCode: "",
    };
  };

  const primaryForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: loadFormData('primary'),
  });

  const backupForm = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit", 
    defaultValues: loadFormData('backup'),
  });

  // Temporarily disabled auto-save to fix cursor jumping
  // Will re-enable once cursor issue is resolved

  // Load saved payment data from user profile
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          console.log('Loading payment data:', userData);
          
          // Load primary payment data
          primaryForm.reset({
            cardNumber: userData.primaryCardNumber || '',
            cardName: userData.primaryCardName || '',
            expiryMonth: userData.primaryExpiryMonth || '',
            expiryYear: userData.primaryExpiryYear || '',
            zipCode: userData.primaryZipCode || '',
            cvv: '', // Never pre-fill CVV
          });

          // Load backup payment data
          backupForm.reset({
            cardNumber: userData.backupCardNumber || '',
            cardName: userData.backupCardName || '',
            expiryMonth: userData.backupExpiryMonth || '',
            expiryYear: userData.backupExpiryYear || '',
            zipCode: userData.backupZipCode || '',
            cvv: '', // Never pre-fill CVV
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchPaymentData();
  }, []); // Remove dependencies to ensure it runs on every mount

  // Format card number with spaces
  const formatCardNumber = (value: string, onChange: (value: string) => void) => {
    const digitsOnly = value.replace(/\D/g, '');
    
    // Check if it's an American Express card (starts with 34 or 37)
    const isAmex = /^3[47]/.test(digitsOnly);
    
    // Limit digits based on card type
    const maxDigits = isAmex ? 15 : 16;
    const limitedDigits = digitsOnly.slice(0, maxDigits);
    
    // Format with spaces
    let formatted;
    if (isAmex) {
      // AmEx format: 4-6-5 (3456 789012 34567)
      formatted = limitedDigits.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3');
      if (limitedDigits.length <= 4) {
        formatted = limitedDigits;
      } else if (limitedDigits.length <= 10) {
        formatted = limitedDigits.replace(/(\d{4})(\d+)/, '$1 $2');
      }
    } else {
      // Standard format: 4-4-4-4
      formatted = limitedDigits.replace(/(.{4})/g, '$1 ').trim();
    }
    
    onChange(formatted);
  };

  // Format ZIP code (digits only, max 5)
  const formatZipCode = (value: string, onChange: (value: string) => void) => {
    const digitsOnly = value.replace(/\D/g, '');
    const truncated = digitsOnly.slice(0, 5);
    
    onChange(truncated);
  };

  const handleSubmit = async (values: FormData, cardType: "primary" | "backup") => {
    try {
      setIsSubmitting(prev => ({ ...prev, [cardType]: true }));

      const response = await fetch('/api/update-payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...values,
          cardType
        }),
      });

      if (response.ok) {
        toast({
          title: "Payment Information Updated",
          description: `${cardType.charAt(0).toUpperCase() + cardType.slice(1)} payment method has been saved successfully.`,
        });
      } else {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to update payment information');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "An error occurred while updating payment information.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(prev => ({ ...prev, [cardType]: false }));
    }
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  const PaymentFormSection = ({ 
    form, 
    title, 
    description, 
    cardType, 
    icon: Icon 
  }: { 
    form: any, 
    title: string, 
    description: string, 
    cardType: "primary" | "backup",
    icon: any 
  }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit((values: FormData) => handleSubmit(values, cardType))} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      {...field}
                      onChange={(e) => {
                        // Just limit digits and let the user type normally
                        const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                        field.onChange(value);
                      }}
                      maxLength={19}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name on Card</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Month</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Month" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const month = (i + 1).toString().padStart(2, '0');
                          return (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiryYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Year</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {generateYearOptions().map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        {...field}
                        maxLength={4}
                        onChange={(e) => {
                          const digitsOnly = e.target.value.replace(/\D/g, '');
                          const limited = digitsOnly.slice(0, 4);
                          field.onChange(limited);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345"
                        {...field}
                        onChange={(e) => formatZipCode(e.target.value, field.onChange)}
                        maxLength={5}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting[cardType]}
            >
              {isSubmitting[cardType] ? (
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
          </form>
        </Form>
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
          form={primaryForm}
          title="Primary Payment Method"
          description="Your main payment method for subscription charges"
          cardType="primary"
          icon={CreditCard}
        />

        <PaymentFormSection
          form={backupForm}
          title="Backup Payment Method"
          description="Backup payment method if primary fails"
          cardType="backup"
          icon={Lock}
        />
      </div>

      <div className="mt-8 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="h-4 w-4" />
          <span>Your payment information is encrypted and secure. CVV codes are never stored.</span>
        </div>
      </div>
    </div>
  );
}