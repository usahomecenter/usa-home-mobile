import { useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UsaMap from "@/components/UsaMap";

type ProfessionalLocationSelectProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

// US States
const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
  "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
  "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
  "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"
];

// World Languages (comprehensive list) - directly define here in case of import issues
const languages = [
  "Abkhaz", "Afar", "Afrikaans", "Akan", "Albanian", "Amharic", "Arabic", "Aragonese", "Armenian", "Assamese",
  "Avaric", "Avestan", "Aymara", "Azerbaijani", "Bambara", "Bashkir", "Basque", "Belarusian", "Bengali", "Bihari",
  "Bislama", "Bosnian", "Breton", "Bulgarian", "Burmese", "Catalan", "Chamorro", "Chechen", "Chichewa", "Chinese",
  "Chinese (Simplified)", "Chinese (Traditional)", "Chuvash", "Cornish", "Corsican", "Cree", "Croatian", "Czech", 
  "Danish", "Divehi", "Dutch", "Dzongkha", "English", "Esperanto", "Estonian", "Ewe", "Faroese", "Fijian", "Finnish",
  "French", "Fula", "Galician", "Georgian", "German", "Greek", "Guaraní", "Gujarati", "Haitian", "Hausa", "Hebrew",
  "Herero", "Hindi", "Hiri Motu", "Hungarian", "Interlingua", "Indonesian", "Irish", "Igbo", "Inupiaq", "Icelandic", 
  "Italian", "Japanese", "Javanese", "Kalaallisut", "Kannada", "Kanuri", "Kashmiri", "Kazakh", "Khmer", "Kikuyu", 
  "Kinyarwanda", "Kirghiz", "Komi", "Kongo", "Korean", "Kurdish", "Kwanyama", "Lao", "Latin", "Latvian", "Limburgish",
  "Lingala", "Lithuanian", "Luba-Katanga", "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese",
  "Manx", "Māori", "Marathi", "Marshallese", "Mongolian", "Nauru", "Navajo", "Ndonga", "Nepali", "North Ndebele",
  "Northern Sami", "Norwegian", "Norwegian Bokmål", "Norwegian Nynorsk", "Nuosu", "Occitan", "Ojibwe", "Oriya",
  "Oromo", "Ossetian", "Pāli", "Pashto", "Persian", "Polish", "Portuguese", "Punjabi", "Quechua", "Romanian",
  "Romansh", "Russian", "Samoan", "Sango", "Sanskrit", "Sardinian", "Scottish Gaelic", "Serbian", "Shona", "Sindhi",
  "Sinhala", "Slovak", "Slovene", "Somali", "South Ndebele", "Southern Sotho", "Spanish", "Sundanese", "Swahili",
  "Swati", "Swedish", "Tagalog", "Tahitian", "Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Tibetan", "Tigrinya",
  "Tonga", "Tsonga", "Tswana", "Turkish", "Turkmen", "Twi", "Uighur", "Ukrainian", "Urdu", "Uzbek", "Venda",
  "Vietnamese", "Volapük", "Walloon", "Welsh", "Western Frisian", "Wolof", "Xhosa", "Yiddish", "Yoruba", "Zhuang",
  "Zulu"
];

const ProfessionalLocationSelect = ({ service, navState, setNavState }: ProfessionalLocationSelectProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedStates.length === 0) {
      newErrors.state = "Please select at least one state of operation";
    }

    if (selectedLanguages.length === 0) {
      newErrors.language = "Please select at least one language";
    }

    // Basic URL validation
    if (websiteUrl) {
      try {
        // Add http if missing
        const urlToCheck = websiteUrl.startsWith('http') ? websiteUrl : `http://${websiteUrl}`;
        new URL(urlToCheck);
      } catch (e) {
        newErrors.websiteUrl = "Please enter a valid website URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (validateForm()) {
      try {
        // Store selected states and languages in localStorage for later use
        localStorage.setItem("selectedStates", JSON.stringify(selectedStates));
        localStorage.setItem("selectedLanguages", JSON.stringify(selectedLanguages));
        
        // Update the user profile with states and languages as arrays
        const response = await apiRequest("PATCH", "/api/update-profile", {
          // Store the first selected state in the legacy field for backward compatibility
          stateLocation: selectedStates[0],
          // Use the new array fields
          statesServiced: selectedStates,
          languagesSpoken: selectedLanguages,
          websiteUrl: websiteUrl || null
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update profile");
        }
        
        toast({
          title: "Profile Updated",
          description: `Your profile has been updated with ${selectedStates.length} states and ${selectedLanguages.length} languages.`,
        });
        
        setLocation(`/professional-payment/${encodeURIComponent(service)}`);
      } catch (error) {
        console.error('Profile update error:', error);
        toast({
          title: "Update Failed",
          description: error instanceof Error ? error.message : "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Form Incomplete",
        description: "Please fix the errors in the form.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">Complete Your Professional Profile</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Service Area and Information</h2>
            <p className="text-neutral-light mb-4 px-2">
              Tell us where you provide {service.length > 20 ? `${service.substring(0, 20)}...` : service} services and any additional information to help clients find you.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="state" className="mb-2 block font-medium">States of Operation</Label>
              <div className={`border rounded-md p-2 ${errors.state ? "border-red-500" : "border-input"}`}>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedStates.map(state => (
                    <div key={state} className="bg-primary text-white px-2 py-1 rounded-md flex items-center text-sm">
                      <span>{state}</span>
                      <button 
                        type="button"
                        onClick={() => setSelectedStates(prev => prev.filter(s => s !== state))}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <Select 
                    onValueChange={(state) => {
                      if (state && !selectedStates.includes(state)) {
                        setSelectedStates(prev => [...prev, state]);
                      }
                    }}
                  >
                    <SelectTrigger id="state" className="w-full">
                      <SelectValue placeholder="Add a state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states
                        .filter(state => !selectedStates.includes(state))
                        .map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-neutral-light mt-1">
                Select all states where you provide services. Add at least one state.
              </p>
              {errors.state && <p className="text-sm text-red-500 mt-1">{errors.state}</p>}
            </div>

            {/* US Map visualization is kept for reference but no longer used with multi-select 
            <UsaMap 
              selectedState={selectedStates[0] || ""} 
              onStateSelect={(state) => {
                if (state && !selectedStates.includes(state)) {
                  setSelectedStates(prev => [...prev, state]);
                }
              }} 
            />
            */}

            <div className="space-y-2">
              <Label htmlFor="language" className="mb-2 block font-medium">Languages Spoken</Label>
              <div className={`border rounded-md p-2 ${errors.language ? "border-red-500" : "border-input"}`}>
                <div className="flex flex-wrap gap-1 mb-2">
                  {selectedLanguages.map(language => (
                    <div key={language} className="bg-primary text-white px-2 py-1 rounded-md flex items-center text-sm">
                      <span>{language}</span>
                      <button 
                        type="button"
                        onClick={() => setSelectedLanguages(prev => prev.filter(l => l !== language))}
                        className="ml-1 text-white hover:text-gray-200"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
                <div className="relative">
                  <Command className="w-full rounded-lg border shadow-md">
                    <CommandInput placeholder="Search languages..." className="h-9" />
                    <CommandList className="max-h-[300px] overflow-auto">
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages
                          .filter(language => !selectedLanguages.includes(language))
                          .map((language) => (
                            <CommandItem
                              key={language}
                              value={language}
                              onSelect={(value) => {
                                setSelectedLanguages(prev => [...prev, value]);
                              }}
                            >
                              {language}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              </div>
              <p className="text-xs text-neutral-light mt-1">
                Select all languages you speak fluently. This helps match you with clients who speak these languages.
              </p>
              {errors.language && <p className="text-sm text-red-500 mt-1">{errors.language}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="mb-2 block font-medium">Website URL (Optional)</Label>
              <Input
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="www.yourcompany.com"
                className={errors.websiteUrl ? "border-red-500" : ""}
              />
              {errors.websiteUrl && <p className="text-sm text-red-500 mt-1">{errors.websiteUrl}</p>}
              <p className="text-xs text-neutral-light mt-1">
                Enter your business website to allow potential clients to learn more about your services
              </p>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                onClick={handleContinue}
                className="bg-primary text-white hover:bg-primary-dark"
              >
                Continue
                <svg 
                  className="w-4 h-4 ml-2" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessionalLocationSelect;