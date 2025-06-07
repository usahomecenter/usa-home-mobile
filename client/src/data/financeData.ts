/**
 * Centralized finance data for USA Home application
 * This file contains finance-related service names, categories, and helper functions
 */

// List of finance service names
export const financeServices = [
  // Credit Repair Specialists
  "Credit Repair Expert", 
  "Credit Score Analyst",
  "Credit Rebuilding Advisor", 
  
  // Debt Management
  "Debt Management Counselor", 
  "Debt Settlement Negotiator",
  "Debt Consolidation Advisor", 
  
  // Mortgage & Loan Professionals
  "Mortgage Broker", 
  "Loan Officer", 
  "Mortgage Banker", 
  "FHA Loan Specialist", 
  "VA Loan Specialist",
  
  // Construction Finance Experts
  "Construction Loan Specialist", 
  "Building Project Financier", 
  "Architectural Finance Consultant",
  "Contractor Finance Advisor", 
  
  // Home Improvement Financing
  "Renovation Loan Specialist", 
  "Home Improvement Financial Advisor",
  "HELOC Specialist", 
  "Green Improvement Financier", 
  
  // Equity & Refinance Specialists
  "Refinance Specialist",
  "Equity Release Consultant", 
  "Cash-Out Refinance Specialist", 
  
  // First-Time Buyer Specialists
  "First-Time Homebuyer Counselor", 
  "Down Payment Assistance Specialist",
  "Affordable Housing Consultant", 
  
  // Investment Property Specialists (formerly Real Estate Investment Experts)
  "Investment Property Specialist", 
  "REIT Advisor",
  "Property Portfolio Manager", 
  "Real Estate Investment Consultant", 
  
  // Real Estate Professionals (formerly Real Estate & Property Professionals)
  "Real Estate Agent",
  "Property Appraiser", 
  "Escrow Officer", 
  "Real Estate Attorney",
  
  // Financial & Legal Advisors (formerly Financial Planning & Tax Experts)
  "Financial Planner", 
  "Property Tax Consultant", 
  "Estate Planning Attorney",
  "Investment Advisor",
  "Tax Specialist"
];

// Finance category names in various forms (including translations)
export const financeNames = [
  'Finance & Real Estate',
  'Finance',
  'Real Estate',
  'Finance and Real Estate',
  'التمويل والعقارات',
  'التمويل',
  'العقارات',
  'Credit Repair Specialists',
  'Debt Management',
  'Mortgage & Loan Professionals',
  'Construction Finance Experts',
  'Home Improvement Financing',
  'Equity & Refinance Specialists',
  'First-Time Buyer Specialists',
  'Investment Property Specialists',
  'Real Estate Professionals',
  'Financial & Legal Advisors'
];

// Keywords that indicate finance-related content
export const financeKeywords = [
  "Credit", 
  "Mortgage", 
  "Loan", 
  "Finance", 
  "Property", 
  "Real Estate", 
  "Investment",
  "Debt", 
  "Financial", 
  "Refinance", 
  "Equity", 
  "Appraisal", 
  "Escrow", 
  "Building Project", 
  "Advisory", 
  "Construction Loan", 
  "Home Improvement", 
  "HELOC"
];

/**
 * Check if a string contains any finance-related keywords
 * @param text String to check for finance keywords
 * @returns Boolean indicating if the text contains finance keywords
 */
export function hasFinanceKeyword(text: string | null | undefined): boolean {
  if (!text) return false;
  
  return financeKeywords.some(keyword => 
    text.toLowerCase().includes(keyword.toLowerCase())
  );
}

/**
 * Check if a string matches any finance service name
 * @param text String to check against finance service names
 * @returns Boolean indicating if the text is a finance service
 */
export function isFinanceService(text: string | null | undefined): boolean {
  if (!text) return false;
  
  return financeServices.some(service => 
    service.toLowerCase() === text.toLowerCase()
  );
}

/**
 * Check if a string is a finance category name
 * @param text String to check against finance category names
 * @returns Boolean indicating if the text is a finance category
 */
export function isFinanceCategory(text: string | null | undefined): boolean {
  if (!text) return false;
  
  return financeNames.some(name => 
    name.toLowerCase() === text.toLowerCase()
  );
}

/**
 * Comprehensive check to determine if text is finance-related
 * Checks against service names, category names, and keywords
 * @param text String to check
 * @returns Boolean indicating if the text is finance-related
 */
export function isFinanceRelated(text: string | null | undefined): boolean {
  if (!text) return false;
  
  return isFinanceService(text) || 
         isFinanceCategory(text) || 
         hasFinanceKeyword(text);
}