// Centralized subcategory definitions to ensure consistency across the app

export type SubcategoryOption = {
  value: string;
  label: string;
};

export type SubcategoryDefinitions = {
  [key: string]: SubcategoryOption[];
};

export const subcategoryDefinitions: SubcategoryDefinitions = {
  // Design Home categories
  "Architect": [
    { value: "Concept Development", label: "Concept Development" },
    { value: "Schematic Design", label: "Schematic Design" },
    { value: "Design Development", label: "Design Development" },
    { value: "Construction Documentation", label: "Construction Documentation" },
    { value: "3D Modeling & Visualization", label: "3D Modeling & Visualization" }
  ],
  "Structural Engineer": [
    { value: "Structural Analysis", label: "Structural Analysis" },
    { value: "Material Selection", label: "Material Selection" },
    { value: "Foundation Design", label: "Foundation Design" },
    { value: "Seismic & Wind Analysis", label: "Seismic & Wind Analysis" },
    { value: "Reinforcement Detailing", label: "Reinforcement Detailing" }
  ],
  "Interior Designer": [
    { value: "Space Planning", label: "Space Planning" },
    { value: "Furniture & Fixtures Selection", label: "Furniture & Fixtures Selection" },
    { value: "Material & Finish Selection", label: "Material & Finish Selection" },
    { value: "Lighting Design", label: "Lighting Design" },
    { value: "Acoustical Design", label: "Acoustical Design" }
  ],
  "Landscape Architect": [
    { value: "Site Analysis & Master Planning", label: "Site Analysis & Master Planning" },
    { value: "Planting Design", label: "Planting Design" },
    { value: "Hardscape Design", label: "Hardscape Design" },
    { value: "Irrigation & Drainage Systems", label: "Irrigation & Drainage Systems" },
    { value: "Sustainable Landscape Design", label: "Sustainable Landscape Design" }
  ],
  "Sustainability Consultant": [
    { value: "LEED Certification consulting", label: "LEED Certification consulting" },
    { value: "Renewable Energy integration", label: "Renewable Energy integration" },
    { value: "Building Envelope Optimization", label: "Building Envelope Optimization" },
    { value: "Energy Modeling & Simulations", label: "Energy Modeling & Simulations" },
    { value: "Green Materials & Construction Practices", label: "Green Materials & Construction Practices" }
  ],
  "Urban Planner": [
    { value: "Land Use Planning", label: "Land Use Planning" },
    { value: "Zoning Regulations & compliance", label: "Zoning Regulations & compliance" },
    { value: "Community Development Plans", label: "Community Development Plans" },
    { value: "Transportation Planning", label: "Transportation Planning" },
    { value: "Environmental impact assessment", label: "Environmental impact assessment" }
  ],
  "Civil Engineer": [
    { value: "Structural Engineering", label: "Structural Engineering" },
    { value: "Site Development", label: "Site Development" },
    { value: "Transportation Engineering", label: "Transportation Engineering" },
    { value: "Water Resources", label: "Water Resources" },
    { value: "Geotechnical Engineering", label: "Geotechnical Engineering" },
    { value: "Utility Planning", label: "Utility Planning" }
  ],
  
  // Include other subcategories from all sections here
};

// Helper function to get subcategories by category
export const getSubcategoriesByCategory = (category: string): SubcategoryOption[] => {
  return subcategoryDefinitions[category] || [];
};

// Helper function to get subcategories as simple string array (for AddServiceCategoryNew.tsx)
export const getSubcategoryStrings = (category: string): string[] => {
  const subcategories = subcategoryDefinitions[category] || [];
  return subcategories.map((item: SubcategoryOption) => item.value);
};