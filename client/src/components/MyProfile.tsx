import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
// Safe language hook import with error handling
import { usStates } from "@/data/languageData";
import { Loader2 } from "lucide-react";
import { resizeImage, isFileTooLarge } from "@/utils/imageUtils";


interface MyProfileProps {
  user: User;
}

export function MyProfile({ user }: MyProfileProps) {
  // Simple translation function without language provider dependency
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'edit_profile': 'Edit Profile',
      'professional': 'Professional',
      'contact_information': 'Contact Information',
      'email': 'Email',
      'phone': 'Phone',
      'social_media': 'Social Media',
      'none_added': 'None Added',
      'professional_details': 'Professional Details',
      'states_serviced': 'States Serviced',
      'languages_spoken': 'Languages Spoken',
      'service_category': 'Service Category',
      'not_specified': 'Not Specified',
      'profile_updated': 'Profile Updated',
      'profile_update_success': 'Your profile has been updated successfully',
      'profile_picture_updated': 'Profile Picture Updated',
      'profile_picture_update_success': 'Your profile picture has been updated successfully',
      'profile_picture_update_failed': 'Profile Picture Update Failed',
      'profile_update_failed': 'Profile Update Failed',
      'save_changes': 'Save Changes',
      'cancel': 'Cancel',
      'change_photo': 'Change Photo',
      'full_name': 'Full Name',
      'business_name': 'Business Name',
      'website_url': 'Website URL',
      'years_experience': 'Years of Experience',
      'certifications': 'Certifications',
      'service_areas': 'Service Areas',
      'business_description': 'Business Description',
      'facebook': 'Facebook',
      'instagram': 'Instagram',
      'tiktok': 'TikTok',
      'service_categories': 'Service Categories',
      'primary_service': 'Primary Service'
    };
    return translations[key] || key;
  };
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditing, setIsEditing] = useState(false);
  // State to track the current profile image for immediate display after upload
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(user.profileImageUrl || null);
  
  // Effect to update profile image when user data changes
  useEffect(() => {
    if (user.profileImageUrl && user.profileImageUrl !== currentProfileImage) {
      setCurrentProfileImage(user.profileImageUrl);
    }
  }, [user.profileImageUrl]);
  // Define a type for the profile data that allows for both string and string[] types
  type ProfileFormData = {
    fullName: string;
    email: string;
    phone: string;
    businessName: string;
    websiteUrl: string;
    facebookUrl: string;
    instagramUrl: string;
    tiktokUrl: string;
    languagesSpoken: string;
    stateLocation: string;
    statesServiced: string;
    yearsExperience: string;
    certifications: string;
    serviceAreas: string;
    businessDescription: string;
  };
  
  // Helper function to nicely format state lists for display in the profile form
  const formatStatesForDisplay = (user: User): string => {
    let states: string[] = [];
    
    // Add statesServiced array if it exists
    if (user.statesServiced && Array.isArray(user.statesServiced) && user.statesServiced.length > 0) {
      // Filter out any undefined or empty values
      const validStates = user.statesServiced
        .filter(state => state && state !== 'undefined' && state !== '');
      states = [...states, ...validStates];
    }
    
    // Add stateLocation if it exists and isn't already in the array
    if (user.stateLocation && user.stateLocation.trim() !== '') {
      if (!states.includes(user.stateLocation)) {
        states.push(user.stateLocation);
      }
    }
    
    // Remove duplicates and return as comma-separated string
    return Array.from(new Set(states)).join(', ');
  };
  
  // Helper function to format languages for display
  const formatLanguagesForDisplay = (user: User): string => {
    if (user.languagesSpoken && Array.isArray(user.languagesSpoken) && user.languagesSpoken.length > 0) {
      return user.languagesSpoken
        .filter(lang => lang && lang !== 'undefined' && lang !== '')
        .join(', ');
    }
    return "";
  };

  const [profileData, setProfileData] = useState<ProfileFormData>({
    fullName: user.fullName || "",
    email: user.email || "",
    phone: user.phone || "",
    businessName: user.businessName || "",
    websiteUrl: user.websiteUrl || "",
    facebookUrl: user.facebookUrl || "",
    instagramUrl: user.instagramUrl || "",
    tiktokUrl: user.tiktokUrl || "",
    languagesSpoken: formatLanguagesForDisplay(user),
    stateLocation: user.stateLocation || "",
    statesServiced: formatStatesForDisplay(user),
    yearsExperience: user.yearsExperience?.toString() || "",
    certifications: user.certifications || "",
    serviceAreas: user.serviceAreas || "",
    businessDescription: user.businessDescription || "",
  });
  
  // Define a type for the server data that can include arrays
  type ServerProfileData = {
    fullName?: string;
    email?: string;
    phone?: string;
    businessName?: string;
    websiteUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    tiktokUrl?: string;
    languagesSpoken?: string | string[];
    stateLocation?: string;
    statesServiced?: string | string[];
    yearsExperience?: string;
    certifications?: string;
    serviceAreas?: string;
    businessDescription?: string;
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ServerProfileData) => {
      console.log("Sending profile update request with data:", data);
      
      const response = await apiRequest(
        "PATCH", 
        `/api/professionals/${user.id}`, 
        data
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }
      
      const updatedProfileData = await response.json();
      console.log("Profile updated successfully, received:", updatedProfileData);
      return updatedProfileData;
    },
    onSuccess: (data) => {
      // Update user object with the latest data
      Object.assign(user, data);
      
      // Also store updated profile data in localStorage for immediate use
      try {
        // Always store social media data, even if empty strings
        const socialMediaData = {
          facebookUrl: data.facebookUrl || profileData.facebookUrl || '',
          instagramUrl: data.instagramUrl || profileData.instagramUrl || '',
          tiktokUrl: data.tiktokUrl || profileData.tiktokUrl || ''
        };
        
        localStorage.setItem('profile_social_media', JSON.stringify(socialMediaData));
        console.log("Social media info saved to localStorage:", socialMediaData);
      } catch (error) {
        console.error("Error saving profile data to localStorage:", error);
      }
      
      toast({
        title: t('profile_updated'),
        description: t('profile_update_success'),
      });
      
      setIsEditing(false);
      
      // Force query invalidation and immediate re-fetch
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      queryClient.refetchQueries({ queryKey: ["/api/user"] });
      
      // Immediate page refresh to show all updates
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    onError: (error: Error) => {
      toast({
        title: t('profile_update_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        // Check if the initial file is too large (5MB)
        if (isFileTooLarge(file, 5)) {
          throw new Error('Image is too large. Maximum size is 5MB. Please use a smaller image.');
        }
        
        // Resize and convert image to base64 - this significantly reduces file size
        const base64Image = await resizeImage(file, 600, 600, 0.8);
        
        // Save the base64 image to localStorage for debugging - will be removed in production
        console.log("Profile image saved to localStorage for later upload");
        localStorage.setItem('tempProfileImage', base64Image);
        
        const response = await fetch('/api/profile-image/upload', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageBase64: base64Image }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to upload image");
        }
        
        return response.json();
      } catch (error) {
        console.error('Failed to upload profile image:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      // Set the profile image URL for immediate display
      if (data && data.profileImageUrl) {
        setCurrentProfileImage(data.profileImageUrl);
        
        // Also update the user object directly for immediate UI update
        user.profileImageUrl = data.profileImageUrl;
        
        // Store in localStorage for persistence between page refreshes
        localStorage.setItem('profileImageUrl', data.profileImageUrl);
        
        console.log("Profile image updated successfully:", data.profileImageUrl);
      }
      
      toast({
        title: t('profile_picture_updated'),
        description: t('profile_picture_update_success'),
      });
      
      // Update user data with new profile image in the background
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: t('profile_picture_update_failed'),
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: t('invalid_file_type'),
        description: t('please_upload_image'),
        variant: "destructive",
      });
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: t('file_too_large'),
        description: t('max_file_size_5mb'),
        variant: "destructive",
      });
      return;
    }
    
    // Upload the file
    uploadImageMutation.mutate(file);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Debug log what is about to be submitted
    console.log("Profile form data being submitted:", profileData);

    // Log states and languages specifically
    console.log("States being submitted:", profileData.statesServiced);
    console.log("Languages being submitted:", profileData.languagesSpoken);
    
    // Create a fresh object for processed data
    const processedData: Record<string, any> = { 
      fullName: profileData.fullName,
      email: profileData.email,
      phone: profileData.phone,
      businessName: profileData.businessName,
      websiteUrl: profileData.websiteUrl,
      facebookUrl: profileData.facebookUrl,
      instagramUrl: profileData.instagramUrl,
      tiktokUrl: profileData.tiktokUrl,
      yearsExperience: profileData.yearsExperience,
      certifications: profileData.certifications,
      serviceAreas: profileData.serviceAreas,
      businessDescription: profileData.businessDescription,
      stateLocation: profileData.stateLocation
    };
    
    // LANGUAGE HANDLING - Force array conversion
    if (profileData.languagesSpoken && profileData.languagesSpoken.trim()) {
      // Convert to a clean array
      const languagesArray = profileData.languagesSpoken
        .split(',')
        .map(lang => lang.trim())
        .filter(lang => lang && lang !== 'undefined' && lang !== 'null');
      
      // Only add if we have languages
      if (languagesArray.length > 0) {
        processedData.languagesSpoken = languagesArray;
        console.log("Languages being saved:", languagesArray);
      }
    }
    
    // STATE HANDLING - Force array conversion
    if (profileData.statesServiced && profileData.statesServiced.trim()) {
      // Convert to a clean array 
      const statesArray = profileData.statesServiced
        .split(',')
        .map(state => state.trim())
        .filter(state => state && state !== 'undefined' && state !== 'null');
      
      // De-duplicate and save only if we have states
      if (statesArray.length > 0) {
        processedData.statesServiced = Array.from(new Set(statesArray));
        console.log("States being saved:", processedData.statesServiced);
      }
    }
    
    // Send the processed data to the server with explicit arrays
    console.log("Final data being sent to server:", processedData);
    updateProfileMutation.mutate(processedData);
  };
  
  const handleCancel = () => {
    setProfileData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      businessName: user.businessName || "",
      websiteUrl: user.websiteUrl || "",
      facebookUrl: user.facebookUrl || "",
      instagramUrl: user.instagramUrl || "",
      tiktokUrl: user.tiktokUrl || "",
      languagesSpoken: formatLanguagesForDisplay(user),
      stateLocation: user.stateLocation || "",
      statesServiced: formatStatesForDisplay(user),
      yearsExperience: user.yearsExperience?.toString() || "",
      certifications: user.certifications || "",
      serviceAreas: user.serviceAreas || "",
      businessDescription: user.businessDescription || "",
    });
    setIsEditing(false);
  };
  
  if (isEditing) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {t('edit_your_profile')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex flex-col items-center justify-center mb-6">
              <Avatar className="h-32 w-32 mb-2">
                {(currentProfileImage || user.profileImageUrl) ? (
                  <AvatarImage 
                    src={currentProfileImage || user.profileImageUrl || ''} 
                    alt={`${user.fullName || user.username}'s profile`} 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                    {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <Label 
                htmlFor="profile-image-upload" 
                className="px-4 py-2 text-sm rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
              >
                {t('change_profile_picture')}
              </Label>
              <Input 
                id="profile-image-upload" 
                type="file" 
                accept="image/*"
                className="sr-only"
                onChange={handleProfileImageUpload}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">{t('full_name')}</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('your_full_name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  placeholder={t('your_email')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder={t('your_phone')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="businessName">{t('business_name')}</Label>
                <Input
                  id="businessName"
                  name="businessName"
                  value={profileData.businessName}
                  onChange={handleInputChange}
                  placeholder={t('your_business_name')}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">{t('website')}</Label>
                <Input
                  id="websiteUrl"
                  name="websiteUrl"
                  value={profileData.websiteUrl}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="facebookUrl">{t('facebook_url')}</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  value={profileData.facebookUrl}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagramUrl">{t('instagram_url')}</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  value={profileData.instagramUrl}
                  onChange={handleInputChange}
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tiktokUrl">{t('tiktok_url')}</Label>
                <Input
                  id="tiktokUrl"
                  name="tiktokUrl"
                  value={profileData.tiktokUrl}
                  onChange={handleInputChange}
                  placeholder="https://tiktok.com/@yourhandle"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="languagesSpoken">{t('languages_spoken')}</Label>
                <Input
                  id="languagesSpoken"
                  name="languagesSpoken"
                  value={profileData.languagesSpoken}
                  onChange={handleInputChange}
                  placeholder={t('languages_hint')}
                />
                <p className="text-xs text-muted-foreground">
                  {t('languages_format_hint')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stateLocation">{t('primary_state')}</Label>
                <Select
                  value={profileData.stateLocation}
                  onValueChange={(value) => handleSelectChange('stateLocation', value)}
                >
                  <SelectTrigger id="stateLocation">
                    <SelectValue placeholder={t('select_primary_state')} />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="statesServiced">{t('states_serviced')}</Label>
                <div className="space-y-2">
                  {/* Selected states display */}
                  <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
                    {(() => {
                      const currentStates = profileData.statesServiced
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s && s !== 'undefined');
                      
                      if (currentStates.length === 0) {
                        return <span className="text-muted-foreground text-sm">{t('no_states_selected')}</span>;
                      }
                      
                      return currentStates.map((state, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                        >
                          {state}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedStates = currentStates.filter((_, i) => i !== index);
                              setProfileData(prev => ({
                                ...prev,
                                statesServiced: updatedStates.join(', ')
                              }));
                            }}
                            className="ml-1 hover:text-blue-600"
                          >
                            ×
                          </button>
                        </span>
                      ));
                    })()}
                  </div>
                  
                  {/* Add state selector */}
                  <Select
                    onValueChange={(value) => {
                      const currentStates = profileData.statesServiced
                        .split(',')
                        .map(s => s.trim())
                        .filter(s => s && s !== 'undefined');
                      
                      if (!currentStates.includes(value)) {
                        const updatedStates = [...currentStates, value];
                        setProfileData(prev => ({
                          ...prev,
                          statesServiced: updatedStates.join(', ')
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('add_state')} />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t('states_multiselect_hint')}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsExperience">{t('years_experience')}</Label>
                <Input
                  id="yearsExperience"
                  name="yearsExperience"
                  type="number"
                  min="0"
                  value={profileData.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="0"
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="certifications">{t('certifications')}</Label>
                <Input
                  id="certifications"
                  name="certifications"
                  value={profileData.certifications}
                  onChange={handleInputChange}
                  placeholder={t('certifications_hint')}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serviceAreas">{t('service_areas')}</Label>
                <Input
                  id="serviceAreas"
                  name="serviceAreas"
                  value={profileData.serviceAreas}
                  onChange={handleInputChange}
                  placeholder={t('service_areas_hint')}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="businessDescription">{t('business_description')}</Label>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={profileData.businessDescription}
                  onChange={handleInputChange}
                  placeholder={t('business_description_hint')}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleCancel}
              >
                {t('cancel')}
              </Button>
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('saving')}</>
                ) : (
                  t('save')
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          {/* Removed "your_profile" text as requested */}
        </CardTitle>
        <Button onClick={() => setIsEditing(true)}>
          {t('edit_profile')}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column - Personal Information */}
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                {(currentProfileImage || user.profileImageUrl) ? (
                  <AvatarImage 
                    src={currentProfileImage || user.profileImageUrl || ''} 
                    alt={`${user.fullName || user.username}'s profile`} 
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="text-xl">
                    {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {user.fullName || user.username}
                </h2>
                <p className="text-muted-foreground">
                  {user.businessName || t('professional')}
                </p>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 mt-6">{t('contact_information')}</h3>
            <ul className="space-y-3">
              {user.businessName && (
                <li className="flex items-center">
                  <span className="font-medium mr-2">{t('business_name')}:</span>
                  <span>{user.businessName}</span>
                </li>
              )}
              <li className="flex items-center">
                <span className="font-medium mr-2">{t('email')}:</span>
                <span>{user.email}</span>
              </li>
              {user.phone && (
                <li className="flex items-center">
                  <span className="font-medium mr-2">{t('phone')}:</span>
                  <span>{user.phone}</span>
                </li>
              )}
              {user.websiteUrl && (
                <li className="flex items-center">
                  <span className="font-medium mr-2">{t('website')}:</span>
                  <a 
                    href={user.websiteUrl.startsWith('http') ? user.websiteUrl : `https://${user.websiteUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {user.websiteUrl.replace(/^https?:\/\//, '')}
                  </a>
                </li>
              )}
              
              {/* Social Media Icons */}
              <li className="flex items-center mt-3">
                <span className="font-medium mr-2">{t('social_media')}:</span>
                <div className="flex space-x-4">
                  {/* Facebook - always show with opacity controlled by presence */}
                  <a 
                    href={user.facebookUrl ? (user.facebookUrl.startsWith('http') ? user.facebookUrl : `https://${user.facebookUrl}`) : "#"}
                    target={user.facebookUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white ${!user.facebookUrl ? "opacity-30 pointer-events-none" : "hover:bg-blue-700"}`}
                    title="Facebook"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01z" />
                    </svg>
                  </a>
                  
                  {/* Instagram - always show with opacity controlled by presence */}
                  <a 
                    href={user.instagramUrl ? (user.instagramUrl.startsWith('http') ? user.instagramUrl : `https://${user.instagramUrl}`) : "#"}
                    target={user.instagramUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 text-white ${!user.instagramUrl ? "opacity-30 pointer-events-none" : ""}`}
                    title="Instagram"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772a4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.054-.058 1.37-.058 4.04 0 2.67.01 2.986.058 4.04.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.67 0 2.986-.01 4.04-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.04-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 0 0-.748-1.15 3.098 3.098 0 0 0-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.04-.058zm0 3.063a5.135 5.135 0 1 1 0 10.27 5.135 5.135 0 0 1 0-10.27zm0 8.468a3.333 3.333 0 1 0 0-6.666 3.333 3.333 0 0 0 0 6.666zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                  </a>
                  
                  {/* TikTok - always show with opacity controlled by presence */}
                  <a 
                    href={user.tiktokUrl ? (user.tiktokUrl.startsWith('http') ? user.tiktokUrl : `https://${user.tiktokUrl}`) : "#"}
                    target={user.tiktokUrl ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-full bg-black text-white ${!user.tiktokUrl ? "opacity-30 pointer-events-none" : ""}`}
                    title="TikTok"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
                    </svg>
                  </a>
                  
                  {!user.facebookUrl && !user.instagramUrl && !user.tiktokUrl && (
                    <span className="text-gray-500 italic ml-2">{t('none_added')}</span>
                  )}
                </div>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 mt-6">{t('professional_details')}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="font-medium mr-2">{t('states_serviced')}:</span>
                <span>
                  {Array.isArray(user.statesServiced) && user.statesServiced.length > 0 
                    ? user.statesServiced.join(', ')
                    : user.stateLocation || t('not_specified')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">{t('languages_spoken')}:</span>
                <span>
                  {Array.isArray(user.languagesSpoken) && user.languagesSpoken.length > 0 
                    ? user.languagesSpoken.join(', ')
                    : t('not_specified')}
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-medium mr-2">{t('service_category')}:</span>
                <span>
                  {user.serviceCategory || t('not_specified')}
                </span>
              </li>
              {user.serviceCategories && user.serviceCategories.length > 0 && (
                <li className="flex items-start">
                  <span className="font-medium mr-2">{t('service_categories')}:</span>
                  <span>
                    {user.serviceCategories.join(', ')}
                  </span>
                </li>
              )}
              {user.serviceAreas && (
                <li className="flex items-start">
                  <span className="font-medium mr-2">{t('service_areas')}:</span>
                  <span>{user.serviceAreas}</span>
                </li>
              )}
              {user.yearsExperience && (
                <li className="flex items-start">
                  <span className="font-medium mr-2">{t('years_experience')}:</span>
                  <span>{user.yearsExperience} years</span>
                </li>
              )}
              {user.certifications && (
                <li className="flex items-start">
                  <span className="font-medium mr-2">{t('certifications')}:</span>
                  <span>{user.certifications}</span>
                </li>
              )}
            </ul>
            
            {user.businessDescription && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">{t('business_description')}</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {user.businessDescription}
                </p>
              </div>
            )}
          </div>
        </div>
        

      </CardContent>
    </Card>
  );
}