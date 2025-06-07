import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import platformAdapter from "@/services/mobile/platform-adapter";

// Define the different tabs and their corresponding links
const TAB_OPTIONS = [
  {
    id: "business-loan",
    name: "Business Loan",
    url: "https://www.smb-funding.com/landing-affiliate?am_id=business_credit_loan",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    )
  },
  {
    id: "credit-builder",
    name: "Credit Builder Card",
    url: "https://www.creditbuildercard.com/thenilefiscalleaders",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    )
  },
  {
    id: "credit-card-broker",
    name: "Credit Card Broker",
    url: "https://www.creditcardbroker.com/promos/feed14892",
    icon: (
      <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M18 14h.01"></path>
        <path d="M14 14h.01"></path>
        <path d="M10 14h.01"></path>
      </svg>
    )
  }
];

const BusinessLoanPage = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(TAB_OPTIONS[0].id);

  // Find the active tab object
  const currentTab = TAB_OPTIONS.find(tab => tab.id === activeTab) || TAB_OPTIONS[0];

  // Function to handle opening the external link for the current tab
  const handleOpenLink = () => {
    // Using the platform adapter to open URLs in the appropriate way based on platform
    platformAdapter.openUrl(currentTab.url);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-primary">
        Business Financing Options
      </h1>

      {/* Tabs navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200">
          {TAB_OPTIONS.map((tab) => (
            <button
              key={tab.id}
              className={`flex items-center py-3 px-4 text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content area */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{currentTab.name}</h2>
          <p className="text-gray-600 mt-2">
            {currentTab.id === "business-loan" && "Get funding for your business with competitive rates and flexible terms."}
            {currentTab.id === "credit-builder" && "Build your credit score with a secured credit card designed for credit improvement."}
            {currentTab.id === "credit-card-broker" && "Find the perfect credit card for your needs with personalized recommendations."}
          </p>
        </div>

        {/* Card with info and button */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6 text-primary">
              {currentTab.icon && (
                <div className="w-16 h-16 flex items-center justify-center bg-primary bg-opacity-10 rounded-full">
                  <div className="w-8 h-8 text-primary">
                    {currentTab.icon}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Why Choose {currentTab.name}</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">
                {currentTab.id === "business-loan" && (
                  <>
                    <li>Fast approval process with minimal paperwork</li>
                    <li>Flexible repayment options tailored to your business</li>
                    <li>Competitive rates for new and established businesses</li>
                    <li>Expert advisors to guide you through the process</li>
                  </>
                )}
                {currentTab.id === "credit-builder" && (
                  <>
                    <li>Build or rebuild your credit score</li>
                    <li>Regular reporting to all major credit bureaus</li>
                    <li>Low annual fee and deposit requirements</li>
                    <li>Path to unsecured credit options</li>
                  </>
                )}
                {currentTab.id === "credit-card-broker" && (
                  <>
                    <li>Compare multiple credit card offers in one place</li>
                    <li>Personalized recommendations based on your profile</li>
                    <li>See your approval odds before applying</li>
                    <li>Special offers and bonus reward opportunities</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={handleOpenLink}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors duration-200"
          >
            Apply Now for {currentTab.name}
            <svg className="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 text-center mt-8">
        <p>
          Disclaimer: You will be directed to external partner websites. USA Home is not responsible for the content of external sites.
        </p>
      </div>
    </div>
  );
};

export default BusinessLoanPage;