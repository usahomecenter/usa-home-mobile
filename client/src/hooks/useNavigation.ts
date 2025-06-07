import { useState } from "react";
import { useLocation } from "wouter";
import { NavigationState } from "@/App";

export function useNavigation() {
  const [_, setLocation] = useLocation();
  const [navState, setNavState] = useState<NavigationState>({
    currentView: 'homepage',
    breadcrumb: {
      primary: null,
      secondary: null,
      tertiary: null
    }
  });

  const goToHomePage = () => {
    setNavState({
      currentView: 'homepage',
      breadcrumb: {
        primary: null,
        secondary: null,
        tertiary: null
      }
    });
    setLocation('/');
  };

  const goToBuildHome = () => {
    setNavState({
      currentView: 'build-home',
      breadcrumb: {
        primary: 'Build Home',
        secondary: null,
        tertiary: null
      }
    });
    setLocation('/build-home');
  };

  const goToDesignHome = () => {
    setNavState({
      currentView: 'design-home',
      breadcrumb: {
        primary: 'Design Home',
        secondary: null,
        tertiary: null
      }
    });
    setLocation('/design-home');
  };

  const goToFinance = () => {
    setNavState({
      currentView: 'finance',
      breadcrumb: {
        primary: 'Finance & Real Estate',
        secondary: null,
        tertiary: null
      }
    });
    setLocation('/finance');
  };

  const goToSubcategory = (category: string) => {
    setNavState({
      currentView: 'subcategories',
      breadcrumb: {
        primary: 'Build Home',
        secondary: category,
        tertiary: null
      }
    });
    setLocation(`/subcategories/${encodeURIComponent(category)}`);
  };

  const goToThirdLevel = (category: string, subcategory: string) => {
    setNavState({
      currentView: 'third-level',
      breadcrumb: {
        primary: 'Build Home',
        secondary: category,
        tertiary: subcategory
      }
    });
    setLocation(`/third-level/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`);
  };

  return {
    navState,
    setNavState,
    goToHomePage,
    goToBuildHome,
    goToDesignHome,
    goToFinance,
    goToSubcategory,
    goToThirdLevel
  };
}
