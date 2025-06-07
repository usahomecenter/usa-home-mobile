import {
  DollarSign,
  Home,
  FileText,
  TrendingUp,
  Users,
  BadgePercent,
  Building,
  LandPlot,
  PiggyBank,
  Award,
  BarChart,
  Banknote,
  Scale,
  HelpCircle,
  PenTool,
  Wrench,
  CreditCard,
  Leaf,
  RefreshCw,
  Unlock,
  Grid,
  Shield,
  Book,
  Calendar
} from "lucide-react";

type FinanceIconProps = {
  category?: string;
  serviceName?: string;
  className?: string;
  size?: number;
};

export function FinanceIcon({ category, serviceName, className = "h-6 w-6", size = 6 }: FinanceIconProps) {
  // First check for direct service name matches
  if (serviceName) {
    switch (serviceName) {
      case "Credit Repair Expert":
        return <RefreshCw className={className} size={size} />;
      case "Debt Management Counselor":
        return <CreditCard className={className} size={size} />;
      case "Credit Score Analyst":
        return <BarChart className={className} size={size} />;
      case "Credit Dispute Specialist":
        return <FileText className={className} size={size} />;
      case "Credit Rebuilding Advisor":
        return <TrendingUp className={className} size={size} />;
      case "Mortgage Broker":
        return <Banknote className={className} size={size} />;
      case "Loan Officer":
        return <FileText className={className} size={size} />;
      case "Mortgage Banker":
        return <DollarSign className={className} size={size} />;
      case "FHA Loan Specialist":
        return <Home className={className} size={size} />;
      case "Construction Loan Specialist":
        return <Building className={className} size={size} />;
      case "Building Project Financier":
        return <Building className={className} size={size} />;
      case "Architectural Finance Consultant":
        return <PenTool className={className} size={size} />;
      case "Contractor Finance Advisor":
        return <Wrench className={className} size={size} />;
      case "Renovation Loan Specialist":
        return <Wrench className={className} size={size} />;
      case "Home Improvement Financial Advisor":
        return <Wrench className={className} size={size} />;
      case "HELOC Specialist":
        return <Home className={className} size={size} />;
      case "Green Improvement Financier":
        return <Leaf className={className} size={size} />;
      case "Refinance Specialist":
        return <RefreshCw className={className} size={size} />;
      case "Equity Release Consultant":
        return <Unlock className={className} size={size} />;
      case "Debt Consolidation Advisor":
        return <CreditCard className={className} size={size} />;
      case "Debt Settlement Negotiator":
        return <Scale className={className} size={size} />;
      case "Cash-Out Refinance Specialist":
        return <Banknote className={className} size={size} />;
      case "First-Time Homebuyer Counselor":
        return <Home className={className} size={size} />;
      case "Down Payment Assistance Specialist":
        return <DollarSign className={className} size={size} />;
      case "Affordable Housing Consultant":
        return <Home className={className} size={size} />;
      case "Investment Property Specialist":
        return <Building className={className} size={size} />;
      case "REIT Advisor":
        return <BarChart className={className} size={size} />;
      case "Property Portfolio Manager":
        return <Grid className={className} size={size} />;
      case "Real Estate Investment Consultant":
        return <BarChart className={className} size={size} />;
      case "Real Estate Agent":
        return <LandPlot className={className} size={size} />;
      case "Property Appraiser":
        return <LandPlot className={className} size={size} />;
      case "Escrow Officer":
        return <Shield className={className} size={size} />;
      case "Real Estate Attorney":
        return <Book className={className} size={size} />;
      case "Financial Planner":
        return <Calendar className={className} size={size} />;
      case "Property Tax Consultant":
        return <Scale className={className} size={size} />;
      case "Estate Planning Attorney":
        return <Book className={className} size={size} />;
    }
  }
  
  // Then check for category matches
  if (category) {
    switch (category) {
      case "Credit Repair & Debt Management Specialists":
        return <RefreshCw className={className} size={size} />;
      case "Mortgage & Loan Professionals":
        return <Banknote className={className} size={size} />;
      case "Construction Finance Specialists":  
        return <Building className={className} size={size} />;
      case "Home Improvement Financing":
        return <Wrench className={className} size={size} />;
      case "Refinancing Specialists":
        return <RefreshCw className={className} size={size} />;
      case "First-Time Homebuyer Programs":
        return <PiggyBank className={className} size={size} />;
      case "Investment Property Financing":
        return <BarChart className={className} size={size} />;
      case "Real Estate Professionals":
        return <Home className={className} size={size} />;
      case "Financial Planning Services":
        return <BadgePercent className={className} size={size} />;
    }
  }
  
  // Default fallback
  return <DollarSign className={className} size={size} />;
}