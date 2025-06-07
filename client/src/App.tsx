import { useState, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/hooks/useLanguage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import categoryData from "@/data/categoryData";
import ServiceSync from "./components/ServiceSync";
import ScrollToTop from "./components/ScrollToTop";
import { SubscriptionAlert } from "./components/SubscriptionAlert";
// Mobile-specific imports
import { isMobileApp } from "./mobile.config";
import { initializeMobileServices } from "./services/mobile";
import MobileLayout from "./components/MobileLayout";
import HomePage from "@/pages/HomePage";
import BuildHome from "@/pages/BuildHome";
import Subcategories from "@/pages/Subcategories";
import ThirdLevel from "@/pages/ThirdLevel";
import DesignHome from "@/pages/DesignHome";
import FinanceRealEstate from "@/pages/FinanceRealEstate";
import BusinessLoanPage from "@/pages/BusinessLoanPage"; 
import DataDeletionPage from "@/pages/DataDeletionPage";
import AppStoreAssetsPage from "@/pages/AppStoreAssetsPage";
import AppStoreDownloads from "@/pages/AppStoreDownloads";
import ScreenshotCapture from "@/pages/ScreenshotCapture";
import TabletScreenshots from "@/pages/TabletScreenshots";
import Tablet7InchScreenshots from "@/pages/Tablet7InchScreenshots";
import ChromebookScreenshots from "@/pages/ChromebookScreenshots";
import GooglePlayFormatter from "@/pages/GooglePlayFormatter";

import AboutUsPage from "@/pages/AboutUsPage";
import NotFound from "@/pages/not-found";
// Import professional finder components
import ProfessionalQuestion from "./pages/ProfessionalQuestion";
import ConsumerLocationSelect from "./pages/ConsumerLocationSelect";
import ProfessionalListing from "./pages/ProfessionalListing";
import ProfessionalListingQuestion from "./pages/ProfessionalListingQuestion";
import ProfessionalSignup from "./pages/ProfessionalSignup";
import ProfessionalLocationSelect from "./pages/ProfessionalLocationSelect";
import ProfessionalPayment from "./pages/ProfessionalPayment";
import ProfessionalDocumentUpload from "./pages/ProfessionalDocumentUpload";
import ProfessionalSuccess from "./pages/ProfessionalSuccess";
import SupportPage from "./pages/SupportPage";
import ProviderLoginPage from "./pages/ProviderLoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import UpdatePaymentFixed from "./pages/UpdatePaymentFixed";
import UpdatePaymentRobust from "./pages/UpdatePaymentRobust";
import ProfessionalSignupPage from "./pages/ProfessionalSignupPage";
import MyProfilePage from "./pages/MyProfilePage";
import AccountPage from "./pages/AccountPage";
import SimpleAccountDisplay from "./pages/SimpleAccountDisplay";
import DirectAccountPage from "./pages/DirectAccountPage";
import SimpleMyAccount from "./pages/SimpleMyAccount";
import SimpleAccount from "./pages/SimpleAccount";
import FinalAccountPage from "./pages/FinalAccountPage";
import ServiceManager from "./pages/ServiceManager";
import BasicPage from "./pages/BasicPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import ServiceSyncFix from "./pages/ServiceSyncFix";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Support from "./pages/support";
import PrivacyPolicyNew from "./pages/privacy-policy";
import MembershipAgreement from "./pages/MembershipAgreement";
import SubscriptionDemo from "./pages/SubscriptionDemo";
import TestPage from "./pages/TestPage";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import CheckoutPage from "./pages/CheckoutPage";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import AddServiceCategory from "./pages/AddServiceCategory";
import AddServiceCategoryNew from "./pages/AddServiceCategoryNew";
import ProfessionalAdditionalServiceSuccess from "./pages/ProfessionalAdditionalServiceSuccess";
import AlreadyListed from "./pages/AlreadyListed";
import SecureAdminPanel from "./pages/SecureAdminPanel";
import SecureAdminAccess from "./pages/SecureAdminAccess";

export type NavigationState = {
  currentView: 'homepage' | 'build-home' | 'subcategories' | 'third-level' | 'design-home' | 'finance';
  breadcrumb: {
    primary: string | null;
    secondary: string | null;
    tertiary: string | null;
  };
};

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [navState, setNavState] = useState<NavigationState>({
    currentView: 'homepage',
    breadcrumb: {
      primary: null,
      secondary: null,
      tertiary: null
    }
  });

  // Initialize language HTML attributes and mobile services
  useEffect(() => {
    // Import the utility function to update HTML lang attribute
    import('@/lib/languageUtils').then(utils => {
      utils.updateHtmlLang();
    });
    
    // Initialize mobile services if running in a mobile app
    if (isMobileApp()) {
      console.log('Mobile app detected - initializing mobile services');
      initializeMobileServices().catch(error => {
        console.error('Failed to initialize mobile services:', error);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <TooltipProvider>
            <ScrollToTop />
            <div className="flex flex-col bg-neutral-bg text-neutral font-body">
              <MobileLayout>
                <Header navState={navState} setNavState={setNavState} />
                <main className="container mx-auto px-2 md:px-4 py-2 md:py-8">
                <SubscriptionAlert />
                <Switch>
                  {/* SECURE ADMIN PANEL - Access via direct URL only */}
                  <Route path="/secure-admin-portal-2025">
                    <SecureAdminPanel />
                  </Route>
                  
                  <Route path="/">
                    <HomePage setNavState={setNavState} />
                  </Route>
                  <Route path="/build-home">
                    <BuildHome navState={navState} setNavState={setNavState} />
                  </Route>
                  <Route path="/subcategories/:category">
                    {(params) => {
                      const category = decodeURIComponent(params.category);
                      console.log("Routing to subcategories for category:", category);
                      
                      // Get all design subcategories
                      const designSubcategories = Object.keys(categoryData["Design & Planning"].subcategories);
                      
                      // Check if the category is actually a Design & Planning subcategory (like Architect, Structural Engineer, etc.)
                      if (designSubcategories.includes(category)) {
                        console.log(`Special case: Direct routing to ${category} under Design & Planning`);
                        return (
                          <ThirdLevel 
                            category="Design & Planning" 
                            subcategory={category} 
                            navState={navState} 
                            setNavState={setNavState} 
                          />
                        );
                      }
                      
                      return (
                        <Subcategories 
                          category={category} 
                          navState={navState} 
                          setNavState={setNavState} 
                        />
                      );
                    }}
                  </Route>
                  <Route path="/third-level/:category/:subcategory">
                    {(params) => {
                      const category = decodeURIComponent(params.category);
                      const subcategory = decodeURIComponent(params.subcategory);
                      console.log("Routing to third-level for:", { category, subcategory });
                      
                      // Handle all Design Home / Design & Planning cases consistently
                      if (category === "Design Home" || 
                          (category === "Design & Planning" && 
                           Object.keys(categoryData["Design & Planning"].subcategories).includes(subcategory))) {
                        console.log(`Special case: Using Design & Planning for ${subcategory}`);
                        return (
                          <ThirdLevel 
                            category="Design & Planning" 
                            subcategory={subcategory} 
                            navState={navState} 
                            setNavState={setNavState} 
                          />
                        );
                      }
                      
                      return (
                        <ThirdLevel 
                          category={category} 
                          subcategory={subcategory} 
                          navState={navState} 
                          setNavState={setNavState} 
                        />
                      );
                    }}
                  </Route>
                  <Route path="/design-home">
                    <DesignHome setNavState={setNavState} />
                  </Route>
                  <Route path="/finance">
                    <FinanceRealEstate setNavState={setNavState} navState={navState} />
                  </Route>
                  <Route path="/finance/category/:categoryName">
                    {(params) => (
                      <FinanceRealEstate 
                        setNavState={setNavState}
                        navState={navState}
                        categoryParam={decodeURIComponent(params.categoryName)}
                      />
                    )}
                  </Route>
                  <Route path="/finance/category/:categoryName/:serviceName">
                    {(params) => (
                      <ProfessionalQuestion 
                        service={decodeURIComponent(params.serviceName)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  {/* Professional finder routes */}
                  <Route path="/find-professionals/:service">
                    {(params) => (
                      <ProfessionalQuestion 
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/location-select/:service">
                    {(params) => (
                      <ConsumerLocationSelect
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/professionals/:service/:state/:language">
                    {(params) => (
                      <ProfessionalListing
                        service={decodeURIComponent(params.service)}
                        state={decodeURIComponent(params.state)}
                        language={decodeURIComponent(params.language)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  {/* Professional signup routes */}
                  <Route path="/professional-listing-question/:service">
                    {(params) => (
                      <ProfessionalListingQuestion
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/professional-signup/:service">
                    {(params) => {
                      // Check if the user is already logged in
                      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
                      const additionalService = decodeURIComponent(params.service);
                      
                      // If user is already logged in, don't show signup form
                      // Instead redirect to add service category flow
                      if (isLoggedIn) {
                        console.log("User already logged in, redirecting to add service flow");
                        // Save the service to add
                        localStorage.setItem('additionalServiceCategory', additionalService);
                        // Redirect to add service category page
                        window.location.href = "/add-service-category";
                        return null;
                      }
                      
                      // Otherwise continue with normal signup
                      return (
                        <ProfessionalSignup
                          service={additionalService}
                          navState={navState}
                          setNavState={setNavState}
                        />
                      );
                    }}
                  </Route>
                  <Route path="/professional-location/:service">
                    {(params) => (
                      <ProfessionalLocationSelect
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/professional-payment/:service">
                    {(params) => {
                      // Check if this is an additional service being added for an existing user
                      const isAdditionalService = localStorage.getItem('additionalServiceCategory') !== null;
                      
                      // If this is an additional service, redirect to AddServiceCategory
                      if (isAdditionalService) {
                        window.location.href = "/add-service-category";
                        return null;
                      }
                      
                      // Otherwise use the original ProfessionalPayment for new users
                      return (
                        <ProfessionalPayment
                          service={decodeURIComponent(params.service)}
                          navState={navState}
                          setNavState={setNavState}
                        />
                      );
                    }}
                  </Route>
                  <Route path="/professional-document-upload/:service">
                    {(params) => (
                      <ProfessionalDocumentUpload
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/professional-success/:service">
                    {(params) => (
                      <ProfessionalSuccess
                        service={decodeURIComponent(params.service)}
                        navState={navState}
                        setNavState={setNavState}
                      />
                    )}
                  </Route>
                  <Route path="/about-us">
                    <AboutUsPage />
                  </Route>
                  <Route path="/support">
                    <SupportPage />
                  </Route>
                  <Route path="/provider-login">
                    <ProviderLoginPage />
                  </Route>
                  <Route path="/forgot-password">
                    <ForgotPasswordPage />
                  </Route>
                  <Route path="/reset-password">
                    <ResetPasswordPage />
                  </Route>

                  <Route path="/update-payment">
                    <UpdatePaymentRobust />
                  </Route>
                  <Route path="/professional-signup-page">
                    <ProfessionalSignupPage />
                  </Route>
                  <Route path="/professional-signup-page/:service">
                    {(params) => (
                      <ProfessionalSignupPage />
                    )}
                  </Route>
                  <Route path="/my-profile">
                    <MyProfilePage />
                  </Route>
                  <Route path="/my-account">
                    <SimpleMyAccount />
                  </Route>
                  <Route path="/account">
                    <Redirect to="/my-account" />
                  </Route>
                  <Route path="/terms-and-conditions">
                    <TermsAndConditions />
                  </Route>
                  <Route path="/privacy-policy">
                    <PrivacyPolicyNew />
                  </Route>
                  <Route path="/support">
                    <Support />
                  </Route>
                  <Route path="/membership-agreement">
                    <MembershipAgreement />
                  </Route>
                  <Route path="/subscription-demo">
                    <SubscriptionDemo />
                  </Route>
                  <Route path="/subscription-management">
                    <SubscriptionManagement />
                  </Route>
                  <Route path="/checkout">
                    <CheckoutPage />
                  </Route>
                  <Route path="/subscription-success">
                    <SubscriptionSuccess />
                  </Route>
                  <Route path="/test-page">
                    <TestPage />
                  </Route>
                  <Route path="/business-loan">
                    <BusinessLoanPage />
                  </Route>
                  <Route path="/data-deletion">
                    <DataDeletionPage key="updated" />
                  </Route>
                  <Route path="/secure-admin-access-2025">
                    <SecureAdminAccess />
                  </Route>
                  <Route path="/admin">
                    <SecureAdminPanel />
                  </Route>

                  <Route path="/app-store-assets">
                    <AppStoreAssetsPage />
                  </Route>
                  <Route path="/app-store-downloads">
                    <AppStoreDownloads />
                  </Route>
                  <Route path="/screenshot-capture">
                    <ScreenshotCapture />
                  </Route>
                  <Route path="/tablet-screenshots">
                    <TabletScreenshots />
                  </Route>
                  <Route path="/tablet-7inch-screenshots">
                    <Tablet7InchScreenshots />
                  </Route>
                  <Route path="/chromebook-screenshots">
                    <ChromebookScreenshots />
                  </Route>
                  <Route path="/google-play-formatter">
                    <GooglePlayFormatter />
                  </Route>

                  <Route path="/add-service-category">
                    <AddServiceCategoryNew />
                  </Route>
                  <Route path="/sync-services">
                    <ServiceSyncFix />
                  </Route>
                  <Route path="/professional-additional-service-success">
                    <ProfessionalAdditionalServiceSuccess />
                  </Route>
                  <Route path="/already-listed">
                    <AlreadyListed />
                  </Route>
                  <Route>
                    <NotFound />
                  </Route>
                </Switch>
                </main>
                
                <Footer />
              </MobileLayout>
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;