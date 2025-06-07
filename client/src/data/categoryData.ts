export type ThirdLevelItem = {
  icon: string;
  description: string;
  translationKey?: string;
};

export type Subcategory = {
  icon: string;
  description: string;
  translationKey?: string;
  descriptionKey?: string;
  thirdLevel?: Record<string, ThirdLevelItem>;
};

export type Category = {
  icon: string;
  description: string;
  translationKey?: string;
  descriptionKey?: string;
  subcategories: Record<string, Subcategory>;
};

export type CategoryData = Record<string, Category>;

const categoryData: CategoryData = {
  "Design & Planning": {
    icon: "compass",
    description: "Expert planning and design services for your home project.",
    subcategories: {
      "Architect": {
        icon: "layout",
        description: "Professional architectural services to create your dream home design.",
        thirdLevel: {
          "Concept Development": {
            icon: "pen-tool",
            description: "Initial design concepts and ideas for your home project."
          },
          "Schematic Design": {
            icon: "layout",
            description: "Preliminary drawings and sketches to define the project's direction."
          },
          "Design Development": {
            icon: "layers",
            description: "Refining and detailing the approved schematic design."
          },
          "Construction Documentation": {
            icon: "file-text",
            description: "Detailed drawings and specifications for construction purposes."
          },
          "3D Modeling & Visualization": {
            icon: "box",
            description: "Creating realistic 3D models and renderings of your future home."
          }
        }
      },
      "Structural Engineer": {
        icon: "layers",
        description: "Engineering expertise to ensure your home's structural integrity and safety.",
        thirdLevel: {
          "Structural Analysis": {
            icon: "bar-chart-2",
            description: "Evaluating the structural behavior and stability of building designs."
          },
          "Material Selection": {
            icon: "package",
            description: "Choosing optimal structural materials for your project's requirements."
          },
          "Foundation Design": {
            icon: "grid",
            description: "Engineering safe and stable foundations for your building."
          },
          "Seismic & Wind Analysis": {
            icon: "activity",
            description: "Ensuring structures can withstand environmental forces and natural disasters."
          },
          "Reinforcement Detailing": {
            icon: "edit",
            description: "Specifying reinforcement requirements for concrete and other structural elements."
          }
        }
      },
      "Civil Engineer": {
        icon: "tool",
        description: "Site development and infrastructure planning for your property.",
        thirdLevel: {
          "Site Development": {
            icon: "map",
            description: "Planning and preparing your land for construction."
          },
          "Drainage & Water Management": {
            icon: "droplet",
            description: "Designing systems to control water flow and prevent flooding."
          },
          "Road & Infrastructure Design": {
            icon: "map-pin",
            description: "Planning access roads and related infrastructure for your property."
          },
          "Geotechnical Engineering": {
            icon: "layers",
            description: "Analyzing soil and rock mechanics to support foundation design."
          },
          "Utility Planning": {
            icon: "activity",
            description: "Coordinating the integration of electrical, water, and other utilities."
          }
        }
      },
      "Urban Planner": {
        icon: "grid",
        description: "Navigating zoning regulations and urban development requirements.",
        thirdLevel: {
          "Land Use Planning": {
            icon: "map",
            description: "Strategic planning for optimal property utilization."
          },
          "Zoning Regulations & Compliance": {
            icon: "check-square",
            description: "Ensuring your project meets all local zoning requirements."
          },
          "Community Development Plans": {
            icon: "users",
            description: "Integrating your project with broader community development goals."
          },
          "Transportation Planning": {
            icon: "truck",
            description: "Planning for access and transportation infrastructure for your project."
          },
          "Environmental Impact Assessments": {
            icon: "thermometer",
            description: "Evaluating the environmental effects of your development."
          }
        }
      },
      "Interior Designer": {
        icon: "paintbrush",
        description: "Creating beautiful and functional interior spaces for your home.",
        thirdLevel: {
          "Space Planning": {
            icon: "grid",
            description: "Optimizing room layouts and traffic flow for comfort and functionality."
          },
          "Furniture & Fixtures Selection": {
            icon: "box",
            description: "Choosing the right furniture and fixtures to suit your style and needs."
          },
          "Material & Finish Selection": {
            icon: "palette",
            description: "Selecting materials, colors, and finishes for floors, walls, and surfaces."
          },
          "Lighting Design": {
            icon: "sun",
            description: "Creating lighting plans that enhance ambiance and functionality."
          },
          "Acoustical Design": {
            icon: "volume-2",
            description: "Planning for optimal sound quality and noise control in your spaces."
          }
        }
      },
      "Landscape Architect": {
        icon: "home",
        description: "Designing outdoor spaces that complement your home and lifestyle.",
        thirdLevel: {
          "Site Analysis & Master Planning": {
            icon: "map",
            description: "Comprehensive analysis and planning of your entire outdoor property."
          },
          "Planting Design": {
            icon: "flower",
            description: "Selecting and arranging plants for beauty, function, and sustainability."
          },
          "Hardscape Design": {
            icon: "square",
            description: "Designing patios, walkways, retaining walls, and other structural elements."
          },
          "Irrigation & Drainage Systems": {
            icon: "droplet",
            description: "Planning efficient water management systems for your landscape."
          },
          "Sustainable Landscape Design": {
            icon: "leaf",
            description: "Creating environmentally responsible and low-maintenance outdoor spaces."
          }
        }
      },
      "Sustainability Consultant": {
        icon: "sun",
        description: "Expert guidance on creating an environmentally friendly and energy-efficient home.",
        thirdLevel: {
          "LEED Certification Consulting": {
            icon: "award",
            description: "Guidance on achieving recognized green building certification."
          },
          "Renewable Energy Integration": {
            icon: "sun",
            description: "Incorporating solar, wind, or geothermal systems into your home."
          },
          "Building Envelope Optimization": {
            icon: "square",
            description: "Improving insulation and air sealing for greater energy efficiency."
          },
          "Energy Modeling & Simulations": {
            icon: "activity",
            description: "Computer analysis to predict and optimize your home's energy performance."
          },
          "Green Materials & Construction Practices": {
            icon: "leaf",
            description: "Selecting sustainable, non-toxic materials and construction methods."
          }
        }
      }
    }
  },
  "Construction & Building": {
    icon: "building",
    description: "Comprehensive construction services for your home building project.",
    translationKey: "construction_building",
    subcategories: {
      "General Contractor": {
        icon: "users",
        description: "Professional oversight of your construction project from start to finish.",
        translationKey: "subcategory_general_contractors",
        thirdLevel: {
          "Residential General Contractors": {
            icon: "home",
            description: "Specialized in managing home building and renovation projects.",
            translationKey: "residential_general_contractors"
          },
          "Commercial General Contractors": {
            icon: "building",
            description: "Experienced in managing commercial property construction and renovations.",
            translationKey: "commercial_general_contractors"
          },
          "Custom Home Builders": {
            icon: "home",
            description: "Specialized in building unique, customized homes to client specifications.",
            translationKey: "custom_home_builders"
          },
          "Renovation Specialists": {
            icon: "tool",
            description: "Experts in transforming and updating existing homes and spaces.",
            translationKey: "renovation_specialists"
          }
        }
      },
      "Foundation Specialist": {
        icon: "hammer",
        description: "Expert contractors specializing in home foundation work.",
        translationKey: "subcategory_foundation_specialists",
        thirdLevel: {
          "Concrete Foundations": {
            icon: "layers",
            description: "Construction of durable concrete foundations for residential buildings.",
            translationKey: "concrete_foundations"
          },
          "Basement Construction": {
            icon: "home",
            description: "Specialized in building waterproof, finished basement spaces.",
            translationKey: "basement_construction"
          },
          "Foundation Repair": {
            icon: "tool",
            description: "Diagnosis and repair of foundation cracks, settling, and damage.",
            translationKey: "foundation_repair"
          },
          "Underpinning Services": {
            icon: "arrow-down",
            description: "Reinforcement and stabilization of existing foundations.",
            translationKey: "underpinning_services"
          }
        }
      },
      "Structural Steel & Framing": {
        icon: "layout",
        description: "Metal framework construction for your home's structure.",
        translationKey: "subcategory_framing_contractors",
        thirdLevel: {
          "Timber Framing": {
            icon: "square",
            description: "Traditional and modern wood framing for residential structures.",
            translationKey: "timber_framing"
          },
          "Steel Framing": {
            icon: "layers",
            description: "Durable steel framework installation for homes and extensions.",
            translationKey: "steel_framing"
          },
          "Wall Framing": {
            icon: "layout",
            description: "Construction of interior and exterior wall frames.",
            translationKey: "wall_framing"
          },
          "Ceiling and Floor Framing": {
            icon: "grid",
            description: "Structural framework for floors and ceilings in residential buildings.",
            translationKey: "ceiling_and_floor_framing"
          }
        }
      },
      "Masonry & Bricklayer": {
        icon: "layers",
        description: "Expert brick and stone work for foundations and structures.",
        translationKey: "subcategory_masonry_contractors"
      },
      "Carpentry": {
        icon: "scissors",
        description: "Skilled carpentry services for structural framework and wooden details.",
        translationKey: "carpentry",
        descriptionKey: "carpentry_desc"
      },
      "Welding & Metal Fabrication": {
        icon: "tool",
        description: "Expert welding and metal fabrication for structural and decorative elements.",
        translationKey: "welding_&_metal_fabrication",
        descriptionKey: "welding_&_metal_fabrication_desc",
        thirdLevel: {
          "Structural Welding": {
            icon: "layers",
            description: "Heavy-duty welding for building frames, supports, and load-bearing elements."
          },
          "Ornamental Metalwork": {
            icon: "star",
            description: "Decorative metal elements including railings, gates, and artistic installations."
          },
          "Custom Metal Fabrication": {
            icon: "scissors",
            description: "Bespoke metal components designed and created for specific project needs."
          },
          "Steel Erection": {
            icon: "arrow-up",
            description: "Assembly and installation of steel frameworks for buildings and structures."
          },
          "Mobile Welding Services": {
            icon: "truck",
            description: "On-site welding and repair services for homes and construction projects."
          }
        }
      },
      "Roofing & Cladding": {
        icon: "home",
        description: "Expert installation of all roofing types and exterior cladding for your home.",
        translationKey: "subcategory_roofing_and_cladding"
      },
      "Window & Door Installer": {
        icon: "door-open",
        description: "Professional installation of energy-efficient windows and doors.",
        translationKey: "subcategory_window_and_door_installer",
        thirdLevel: {
          "Door Installation": {
            icon: "door-open",
            description: "Interior and exterior door installation and replacement."
          },
          "Window Installation": {
            icon: "square",
            description: "Energy-efficient window installation and replacement."
          },
          "Locksmith & Hardware Installation": {
            icon: "key",
            description: "High-security locks, door hardware, and smart entry systems."
          }
        }
      },
      "Insulation Contractor": {
        icon: "thermometer",
        description: "Proper insulation services for energy efficiency and comfort.",
        translationKey: "subcategory_insulation_contractor"
      },
      "Drywall & Plasterer": {
        icon: "layout-bottom",
        description: "Expert installation and finishing of interior walls.",
        translationKey: "subcategory_drywall_and_plasterer"
      },
      "Flooring Specialist": {
        icon: "grid",
        description: "Quality installation of various flooring materials including hardwood, tile, and carpet.",
        translationKey: "subcategory_flooring_specialist"
      },
      "Painter & Sprayer": {
        icon: "paintbrush",
        description: "Professional painting and finishing touches for your home interior and exterior.",
        translationKey: "subcategory_painter_and_sprayer"
      },
      "Cabinetmaker & Millworker": {
        icon: "box",
        description: "Custom cabinets and detailed woodwork for your interior.",
        translationKey: "subcategory_cabinetmaker_and_millworker"
      },
      "Pool Builder": {
        icon: "droplet",
        description: "Professional design and construction of swimming pools and water features.",
        translationKey: "subcategory_pool_builder"
      },
      "Gardening & Landscaping Expert": {
        icon: "flower",
        description: "Comprehensive landscaping and garden design services for your outdoor spaces.",
        translationKey: "subcategory_gardening_and_landscaping_expert"
      }
    }
  },
  "MEP (Mechanical, Electrical, Plumbing)": {
    icon: "settings",
    description: "Essential MEP systems for a functional and comfortable home.",
    translationKey: "mep",
    descriptionKey: "mep_desc",
    subcategories: {
      "HVAC Technician": {
        icon: "thermometer",
        description: "Heating, ventilation, and air conditioning installation and service.",
        translationKey: "subcategory_hvac_technician"
      },
      "Electrician": {
        icon: "zap",
        description: "Professional electrical work for safe and efficient power systems.",
        translationKey: "subcategory_electrician"
      },
      "Plumber": {
        icon: "droplet",
        description: "Expert installation and repair of water supply and drainage systems.",
        translationKey: "subcategory_plumber"
      }
    }
  },
  "Utilities & Infrastructure": {
    icon: "activity",
    description: "Connecting essential utilities to your home for daily living.",
    translationKey: "utilities_infrastructure",
    descriptionKey: "utilities_infrastructure_desc",
    subcategories: {
      "Utility Connection Specialist": {
        icon: "plug",
        description: "Expert assistance with connecting to municipal utility systems.",
        translationKey: "subcategory_utility_connection"
      },
      "Septic System Expert": {
        icon: "git-branch",
        description: "Installation and maintenance of septic systems for rural properties.",
        translationKey: "subcategory_septic_system"
      }
    }
  },
  "Renewable & Solar": {
    icon: "sun",
    description: "Sustainable energy solutions for modern, efficient homes.",
    translationKey: "renewable_solar",
    descriptionKey: "renewable_solar_desc",
    subcategories: {
      "Solar Installer": {
        icon: "sun",
        description: "Professional installation of solar panels and related equipment.",
        translationKey: "subcategory_solar_installer"
      },
      "Solar Designer": {
        icon: "pen-tool",
        description: "Expert design of solar energy systems optimized for your home.",
        translationKey: "subcategory_solar_designer"
      }
    }
  },
  "Energy & Building Systems": {
    icon: "zap",
    description: "Smart and efficient building systems for modern living.",
    translationKey: "energy_building_systems",
    descriptionKey: "energy_building_systems_desc",
    subcategories: {
      "Home Automation Specialist": {
        icon: "cpu",
        description: "Integration of smart home technology for convenience and efficiency.",
        translationKey: "subcategory_home_automation",
        thirdLevel: {
          "Smart Home Control": {
            icon: "smartphone",
            description: "Central hubs and controllers for your smart home ecosystem.",
            translationKey: "smart_home_control"
          },
          "Security Automation": {
            icon: "lock",
            description: "Digital locks, biometric readers, and security monitoring systems.",
            translationKey: "security_automation"
          },
          "Smart Lighting": {
            icon: "lightbulb",
            description: "Automated lighting systems for efficiency and ambiance.",
            translationKey: "smart_lighting"
          },
          "Climate Control": {
            icon: "thermometer",
            description: "Smart thermostats and HVAC automation systems.",
            translationKey: "climate_control"
          },
          "Entertainment Systems": {
            icon: "music",
            description: "Whole-home audio and entertainment automation solutions.",
            translationKey: "entertainment_systems"
          }
        }
      }
    }
  },
  "Environmental & Compliance": {
    icon: "shield",
    description: "Ensuring your home meets environmental standards and regulations.",
    translationKey: "environmental_compliance",
    descriptionKey: "environmental_compliance_desc",
    subcategories: {
      "LEED Consultant": {
        icon: "award",
        description: "Guidance for achieving sustainable building certifications.",
        translationKey: "subcategory_leed_consultant"
      },
      "Environmental Impact Assessor": {
        icon: "bar-chart",
        description: "Evaluation of your building project's environmental effects.",
        translationKey: "subcategory_environmental_assessor"
      }
    }
  },
  "Additional Expertise": {
    icon: "tool",
    description: "Specialized services for specific home building needs.",
    translationKey: "additional_expertise",
    descriptionKey: "additional_expertise_desc",
    subcategories: {
      "Security System Installer": {
        icon: "lock",
        description: "Comprehensive home security solutions for your peace of mind.",
        translationKey: "subcategory_security_system_installer"
      },
      "Locksmith": {
        icon: "key",
        description: "Professional key, lock, and security hardware installation and maintenance.",
        translationKey: "subcategory_locksmith",
        thirdLevel: {
          "Residential Locksmith": {
            icon: "home",
            description: "Home locks, deadbolts, keyless entry systems, and master key systems.",
            translationKey: "residential_locksmith"
          },
          "Commercial Locksmith": {
            icon: "building",
            description: "Business security locks, panic hardware, and access control systems.",
            translationKey: "commercial_locksmith"
          },
          "Automotive Locksmith": {
            icon: "car",
            description: "Car key duplication, ignition repair, and transponder key programming.",
            translationKey: "automotive_locksmith"
          },
          "Emergency Lockout Service": {
            icon: "alert-circle",
            description: "24/7 emergency lockout resolution for homes, businesses, and vehicles.",
            translationKey: "emergency_lockout_service"
          },
          "Safe Installation & Repair": {
            icon: "box",
            description: "Installation, combination changes, and repairs for home and office safes.",
            translationKey: "safe_installation_repair"
          }
        }
      },
      "Soundproofing Specialist": {
        icon: "volume-2",
        description: "Creating quiet, acoustically balanced spaces in your home.",
        translationKey: "subcategory_soundproofing_specialist"
      },
      "Accessibility Expert": {
        icon: "users",
        description: "Making your home comfortable and accessible for everyone.",
        translationKey: "subcategory_accessibility_expert"
      },
      "Pest Control Professional": {
        icon: "shield",
        description: "Protecting your home from unwanted pests during and after construction.",
        translationKey: "subcategory_pest_control"
      },
      "Waste Management & Recycling Coordinator": {
        icon: "trash",
        description: "Responsible disposal and recycling of construction materials.",
        translationKey: "subcategory_waste_management"
      },
      "Metal Work & Welding Specialist": {
        icon: "tool",
        description: "Custom metal fabrication, ornamental ironwork, and specialty welding services.",
        translationKey: "metal_work_&_welding_specialist",
        descriptionKey: "metal_work_&_welding_specialist_desc",
        thirdLevel: {
          "Artistic Metalwork": {
            icon: "star",
            description: "Custom decorative metal elements and artistic metalwork for unique home features.",
            translationKey: "artistic_metalwork"
          },
          "Specialty Metals": {
            icon: "hexagon",
            description: "Working with aluminum, stainless steel, copper, bronze, and other specialty metals.",
            translationKey: "specialty_metals"
          },
          "Metal Restoration": {
            icon: "refresh-cw",
            description: "Repair and restoration of historic or antique metalwork and fixtures.",
            translationKey: "metal_restoration"
          },
          "Sheet Metal Fabrication": {
            icon: "square",
            description: "Custom sheet metal work for HVAC, roofing, and architectural features.",
            translationKey: "sheet_metal_fabrication"
          },
          "Architectural Metals": {
            icon: "award",
            description: "Specialized metal features for architectural applications and design elements.",
            translationKey: "architectural_metals"
          }
        }
      }
    }
  }
};

export default categoryData;
