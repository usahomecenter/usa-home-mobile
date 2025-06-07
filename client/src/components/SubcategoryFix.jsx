// Add this at the top of your getSubcategoriesForCategory function in ThreeStepServiceAdder.jsx
// Make sure this specific code is included in your subcategory handling:

if (category === "Civil Engineer") {
  return [
    { value: "Structural Engineering", label: "Structural Engineering" },
    { value: "Site Development", label: "Site Development" },
    { value: "Transportation Engineering", label: "Transportation Engineering" },
    { value: "Water Resources", label: "Water Resources" },
    { value: "Geotechnical Engineering", label: "Geotechnical Engineering" },
    { value: "Utility Planning", label: "Utility Planning" }
  ];
}
else if (category === "Urban Planner") {
  return [
    { value: "Land Use Planning", label: "Land Use Planning" },
    { value: "Zoning Regulations & compliance", label: "Zoning Regulations & compliance" },
    { value: "Community Development Plans", label: "Community Development Plans" },
    { value: "Transportation Planning", label: "Transportation Planning" },
    { value: "Environmental impact assessment", label: "Environmental impact assessment" }
  ];
}
