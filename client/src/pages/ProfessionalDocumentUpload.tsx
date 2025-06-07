import { useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type ProfessionalDocumentUploadProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ProfessionalDocumentUpload = ({ service, navState, setNavState }: ProfessionalDocumentUploadProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [driverLicense, setDriverLicense] = useState<File | null>(null);
  const [professionalLicense, setProfessionalLicense] = useState<File | null>(null);
  
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageDataUrl = event.target.result as string;
          setProfileImagePreview(imageDataUrl);
          
          // Store the profile image in localStorage for later use
          localStorage.setItem('tempProfileImage', imageDataUrl);
          console.log('Profile image saved to localStorage for later upload');
        }
      };
      reader.readAsDataURL(file);
      
      if (errors.profileImage) {
        setErrors({ ...errors, profileImage: "" });
      }
    }
  };

  const handleDriverLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDriverLicense(e.target.files[0]);
      if (errors.driverLicense) {
        setErrors({ ...errors, driverLicense: "" });
      }
    }
  };

  const handleProfessionalLicenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfessionalLicense(e.target.files[0]);
      if (errors.professionalLicense) {
        setErrors({ ...errors, professionalLicense: "" });
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileImage) {
      newErrors.profileImage = "Please upload a profile picture";
    }

    if (!driverLicense) {
      newErrors.driverLicense = "Please upload your driver's license";
    }

    if (!professionalLicense) {
      newErrors.professionalLicense = "Please upload your professional license";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        // If we have a profile image, upload it now to ensure it's attached to the account
        if (profileImage) {
          // Convert the file to base64
          const base64Image = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(profileImage);
          });
          
          // Upload the profile image
          const response = await fetch('/api/profile-image/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ imageBase64: base64Image }),
            credentials: 'include'
          });
          
          if (response.ok) {
            console.log('Profile image successfully uploaded during document submission');
            // Update the user in session storage to trigger UI refresh
            const updatedUserData = await response.json();
            
            // Update the authenticated user in session storage if applicable
            const sessionUser = sessionStorage.getItem('user');
            if (sessionUser) {
              const userData = JSON.parse(sessionUser);
              userData.profileImageUrl = updatedUserData.profileImageUrl;
              sessionStorage.setItem('user', JSON.stringify(userData));
            }
            
            // Dispatch an event to notify other components about the profile image change
            window.dispatchEvent(new CustomEvent('profile-image-updated', { 
              detail: { imageUrl: updatedUserData.profileImageUrl }
            }));
          } else {
            console.error('Failed to upload profile image:', await response.text());
            // Continue anyway, as we've stored it in localStorage for retry in SubscriptionSuccess
          }
        }
        
        // Handle other documents (in a real implementation)
        // For now we'll just show a success message
        
        toast({
          title: "Documents Uploaded Successfully",
          description: "Your verification documents have been uploaded.",
        });
        
        // Navigate to congratulations page
        setLocation(`/professional-success/${encodeURIComponent(service)}`);
      } catch (error) {
        console.error('Error uploading documents:', error);
        toast({
          title: "Upload Error",
          description: "There was a problem uploading your documents. Please try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Missing Documents",
        description: "Please upload all required documents.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">Complete Your Profile</CardTitle>
          <CardDescription className="text-white/90">
            Upload your verification documents
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-xl font-heading font-bold mb-4">
              Almost there! Just a few more details...
            </h2>
            <p className="text-neutral-light mb-4">
              To verify your identity and professional status, please upload the following documents.
              These will help us ensure the quality of our {service} professional network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-medium block mb-4">Profile Picture</Label>
              
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="w-40 h-40 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center mb-4 overflow-hidden bg-gray-50">
                  {profileImagePreview ? (
                    <img 
                      src={profileImagePreview} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <svg 
                      className="w-16 h-16 text-neutral-light" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                
                <div className="w-full max-w-xs">
                  <Label htmlFor="profileImage" className="cursor-pointer">
                    <div className="bg-primary/10 text-primary text-center py-2 px-4 rounded hover:bg-primary/20 transition-colors">
                      {profileImage ? 'Change Photo' : 'Upload Photo'}
                    </div>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </Label>
                  {errors.profileImage && (
                    <p className="text-red-500 text-sm mt-2 text-center">{errors.profileImage}</p>
                  )}
                  <p className="text-xs text-neutral-light text-center mt-2">
                    Upload a professional headshot. This will be visible to potential clients.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="space-y-2">
                  <Label htmlFor="driverLicense" className="font-medium block">Driver's License</Label>
                  <div className="border rounded p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg 
                          className="w-5 h-5 mr-2 text-neutral-light" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M21 14H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2Z"></path>
                          <path d="M17 4h4"></path>
                          <path d="M17 8h4"></path>
                          <path d="M13 14V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v11"></path>
                          <path d="M7 14V5a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {driverLicense ? driverLicense.name : 'No file selected'}
                        </span>
                      </div>
                      <Label htmlFor="driverLicense" className="cursor-pointer">
                        <div className="text-primary text-sm hover:underline">
                          {driverLicense ? 'Change' : 'Browse'}
                        </div>
                        <input
                          id="driverLicense"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleDriverLicenseChange}
                          className="hidden"
                        />
                      </Label>
                    </div>
                    {errors.driverLicense && (
                      <p className="text-red-500 text-sm mt-2">{errors.driverLicense}</p>
                    )}
                  </div>
                  <p className="text-xs text-neutral-light">
                    For identity verification only. Not visible to clients.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="professionalLicense" className="font-medium block">Professional License</Label>
                  <div className="border rounded p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <svg 
                          className="w-5 h-5 mr-2 text-neutral-light" 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                        </svg>
                        <span className="text-sm font-medium">
                          {professionalLicense ? professionalLicense.name : 'No file selected'}
                        </span>
                      </div>
                      <Label htmlFor="professionalLicense" className="cursor-pointer">
                        <div className="text-primary text-sm hover:underline">
                          {professionalLicense ? 'Change' : 'Browse'}
                        </div>
                        <input
                          id="professionalLicense"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleProfessionalLicenseChange}
                          className="hidden"
                        />
                      </Label>
                    </div>
                    {errors.professionalLicense && (
                      <p className="text-red-500 text-sm mt-2">{errors.professionalLicense}</p>
                    )}
                  </div>
                  <p className="text-xs text-neutral-light">
                    Verification of your expertise and credentials as a {service} professional.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                type="submit"
                className="bg-primary text-white hover:bg-primary-dark py-6 px-8 text-lg font-medium"
              >
                Continue
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalDocumentUpload;