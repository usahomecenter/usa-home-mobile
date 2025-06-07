import { useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import UsaMap from "@/components/UsaMap";
import { languageOptions, usStates } from "@/data/languageData";

type ConsumerLocationSelectProps = {
  service: string;
  navState: NavigationState;
  setNavState: React.Dispatch<React.SetStateAction<NavigationState>>;
};

const ConsumerLocationSelect = ({ service, navState, setNavState }: ConsumerLocationSelectProps) => {
  const [, setLocation] = useLocation();
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("English");

  // Function to handle going back based on breadcrumb
  const handleBackClick = () => {
    // Go back to professional question page
    setLocation(`/find-professionals/${encodeURIComponent(service)}`);
  };

  const handleContinue = () => {
    if (selectedState) {
      // Find the language code for the selected language name to pass to the URL
      const languageCode = languageOptions.find(lang => lang.name === selectedLanguage)?.code || selectedLanguage;
      console.log(`Selected language: ${selectedLanguage}, converted to code: ${languageCode}`);
      
      const url = `/professionals/${encodeURIComponent(service)}/${encodeURIComponent(selectedState)}/${encodeURIComponent(languageCode)}`;
      console.log(`Navigating to: ${url}`);
      
      setLocation(url);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader className="text-center bg-gradient-to-r from-primary to-primary-dark text-white">
          <CardTitle className="font-heading text-2xl">Find {service} Professionals</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-heading font-bold mb-4">Select your location and language</h2>
            <p className="text-neutral-light mb-4 px-2">
              We'll use this information to find {service.length > 20 ? `${service.substring(0, 20)}...` : service} professionals in your area who speak your preferred language.
            </p>
          </div>

          <div className="mb-6">
            <Label htmlFor="state" className="mb-2 block font-medium">Select State</Label>
            <Select 
              value={selectedState} 
              onValueChange={setSelectedState}
            >
              <SelectTrigger id="state" className="w-full">
                <SelectValue placeholder="Select your state" />
              </SelectTrigger>
              <SelectContent>
                {usStates.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* US Map visualization */}
          <UsaMap 
            selectedState={selectedState} 
            onStateSelect={setSelectedState} 
          />


          <div className="mb-6">
            <Label htmlFor="language" className="mb-2 block font-medium">Preferred Language</Label>
            <div className="relative">
              <Command className="w-full rounded-lg border shadow-md">
                <CommandInput placeholder="Search languages..." className="h-9" />
                <CommandList className="max-h-[300px] overflow-auto">
                  <CommandEmpty>No language found.</CommandEmpty>
                  <CommandGroup>
                    {languageOptions.map((language) => (
                      <CommandItem
                        key={language.code}
                        value={language.name}
                        onSelect={(value) => {
                          setSelectedLanguage(value);
                        }}
                        className={selectedLanguage === language.name ? "bg-accent text-accent-foreground" : ""}
                      >
                        {language.name}
                        {selectedLanguage === language.name && (
                          <svg
                            className="ml-auto h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
              <div className="mt-2 text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedLanguage}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              onClick={handleBackClick}
              variant="outline"
              className="bg-white border border-primary text-primary hover:bg-primary hover:text-white font-button transition-colors flex items-center"
            >
              <svg 
                className="w-4 h-4 mr-2" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back
            </Button>
            
            <Button 
              onClick={handleContinue}
              disabled={!selectedState}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ConsumerLocationSelect;