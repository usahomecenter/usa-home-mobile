import React from 'react';

// Map data - states with their abbreviations
const stateData = {
  'Alabama': 'AL',
  'Alaska': 'AK',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Pennsylvania': 'PA',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY'
};

type UsaMapProps = {
  selectedState: string;
  onStateSelect?: (state: string) => void;
};

const UsaMap: React.FC<UsaMapProps> = ({ selectedState, onStateSelect }) => {
  return (
    <div className="mt-6 mb-6 border rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-medium mb-2 text-center">United States</h3>
      <div className="aspect-video relative bg-white rounded">
        <svg
          viewBox="0 0 959 593"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g className="state-map">
            {/* Continental US states */}
            <path 
              d="M130,350 L100,375 L125,410 L150,425 L175,415 L180,380 L165,365 L145,355 Z"
              className={`state ${selectedState === 'California' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('California')}
            />
            <path 
              d="M180,330 L160,350 L180,380 L195,365 L200,340 Z"
              className={`state ${selectedState === 'Nevada' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Nevada')}
            />
            <path 
              d="M180,330 L200,340 L220,300 L200,280 L175,310 Z"
              className={`state ${selectedState === 'Oregon' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Oregon')}
            />
            <path 
              d="M175,310 L200,280 L180,250 L155,280 Z"
              className={`state ${selectedState === 'Washington' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Washington')}
            />
            <path 
              d="M200,340 L195,365 L230,365 L240,340 L230,320 L220,300 Z"
              className={`state ${selectedState === 'Idaho' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Idaho')}
            />
            <path 
              d="M230,365 L210,400 L250,400 L285,375 L270,340 L240,340 Z"
              className={`state ${selectedState === 'Utah' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Utah')}
            />
            <path 
              d="M195,365 L180,380 L175,415 L210,400 L230,365 Z"
              className={`state ${selectedState === 'Arizona' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Arizona')}
            />
            <path 
              d="M230,320 L240,340 L270,340 L275,310 L255,290 L230,290 Z"
              className={`state ${selectedState === 'Montana' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Montana')}
            />
            <path 
              d="M270,340 L285,375 L320,370 L320,340 L275,310 Z"
              className={`state ${selectedState === 'Wyoming' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Wyoming')}
            />
            <path 
              d="M250,400 L285,375 L320,370 L325,400 L290,425 Z"
              className={`state ${selectedState === 'Colorado' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Colorado')}
            />
            <path 
              d="M210,400 L175,415 L220,465 L240,465 L290,425 L250,400 Z"
              className={`state ${selectedState === 'New Mexico' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('New Mexico')}
            />
            <path 
              d="M275,310 L320,340 L340,310 L320,280 L290,280 L255,290 Z"
              className={`state ${selectedState === 'North Dakota' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('North Dakota')}
            />
            <path 
              d="M275,310 L320,340 L340,310 L320,280 L290,280 L255,290 Z"
              className={`state ${selectedState === 'South Dakota' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('South Dakota')}
            />
            <path 
              d="M320,340 L320,370 L360,370 L370,340 L340,310 Z"
              className={`state ${selectedState === 'Nebraska' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Nebraska')}
            />
            <path 
              d="M320,370 L325,400 L375,400 L395,370 L360,370 Z"
              className={`state ${selectedState === 'Kansas' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Kansas')}
            />
            <path 
              d="M240,465 L290,425 L325,400 L375,400 L370,440 L350,465 L320,480 Z"
              className={`state ${selectedState === 'Texas' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Texas')}
            />
            <path 
              d="M375,400 L395,370 L410,370 L425,400 L425,420 L370,440 Z"
              className={`state ${selectedState === 'Oklahoma' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Oklahoma')}
            />
            <path 
              d="M340,310 L370,340 L400,340 L405,310 L380,290 L320,280 Z"
              className={`state ${selectedState === 'Minnesota' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Minnesota')}
            />
            <path 
              d="M370,340 L395,370 L430,370 L440,335 L400,340 Z"
              className={`state ${selectedState === 'Iowa' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Iowa')}
            />
            <path 
              d="M395,370 L410,370 L435,400 L470,400 L480,370 L460,360 L430,370 Z"
              className={`state ${selectedState === 'Missouri' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Missouri')}
            />
            <path 
              d="M425,420 L425,400 L470,400 L480,420 L425,440 Z"
              className={`state ${selectedState === 'Arkansas' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Arkansas')}
            />
            <path 
              d="M425,440 L370,440 L350,465 L380,490 L430,480 L450,450 Z"
              className={`state ${selectedState === 'Louisiana' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Louisiana')}
            />
            <path 
              d="M480,420 L470,400 L480,370 L510,390 L520,420 Z"
              className={`state ${selectedState === 'Mississippi' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Mississippi')}
            />
            <path 
              d="M480,370 L460,360 L460,330 L490,330 L520,350 L510,390 Z"
              className={`state ${selectedState === 'Tennessee' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Tennessee')}
            />
            <path 
              d="M520,420 L510,390 L520,350 L570,370 L570,400 Z"
              className={`state ${selectedState === 'Alabama' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Alabama')}
            />
            <path 
              d="M520,350 L490,330 L510,300 L580,320 L570,370 Z"
              className={`state ${selectedState === 'Georgia' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Georgia')}
            />
            <path 
              d="M570,370 L570,400 L620,440 L640,400 L610,370 Z"
              className={`state ${selectedState === 'Florida' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Florida')}
            />
            <path 
              d="M570,370 L580,320 L610,340 L610,370 Z"
              className={`state ${selectedState === 'South Carolina' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('South Carolina')}
            />
            <path 
              d="M460,330 L490,330 L510,300 L470,280 L430,310 Z"
              className={`state ${selectedState === 'Kentucky' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Kentucky')}
            />
            <path 
              d="M510,300 L580,320 L590,280 L560,260 L470,280 Z"
              className={`state ${selectedState === 'North Carolina' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('North Carolina')}
            />
            <path 
              d="M470,280 L560,260 L540,230 L510,230 L460,260 Z"
              className={`state ${selectedState === 'Virginia' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Virginia')}
            />
            <path 
              d="M470,280 L460,260 L440,270 L430,310 Z"
              className={`state ${selectedState === 'West Virginia' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('West Virginia')}
            />
            <path 
              d="M430,310 L440,270 L405,260 L400,290 L410,320 L430,370 L460,360 L460,330 Z"
              className={`state ${selectedState === 'Illinois' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Illinois')}
            />
            <path 
              d="M440,270 L460,260 L470,240 L450,220 L430,220 L400,260 L405,260 Z"
              className={`state ${selectedState === 'Indiana' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Indiana')}
            />
            <path 
              d="M400,340 L405,310 L400,290 L410,320 L430,370 L440,335 Z"
              className={`state ${selectedState === 'Wisconsin' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Wisconsin')}
            />
            <path 
              d="M400,260 L405,260 L405,310 L380,290 Z"
              className={`state ${selectedState === 'Michigan' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Michigan')}
            />
            <path 
              d="M450,220 L470,240 L510,230 L520,210 L500,200 L470,200 L430,220 Z"
              className={`state ${selectedState === 'Ohio' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Ohio')}
            />
            <path 
              d="M510,230 L540,230 L540,210 L520,210 Z"
              className={`state ${selectedState === 'Maryland' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Maryland')}
            />
            <path 
              d="M520,210 L540,210 L550,190 L520,190 L500,200 Z"
              className={`state ${selectedState === 'Pennsylvania' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Pennsylvania')}
            />
            <path 
              d="M540,230 L560,260 L570,240 L550,220 L540,220 Z"
              className={`state ${selectedState === 'Delaware' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Delaware')}
            />
            <path 
              d="M550,220 L570,240 L580,220 L570,200 L550,190 L540,210 L540,220 Z"
              className={`state ${selectedState === 'New Jersey' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('New Jersey')}
            />
            <path 
              d="M520,190 L550,190 L570,200 L580,180 L560,165 L520,170 Z"
              className={`state ${selectedState === 'New York' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('New York')}
            />
            <path 
              d="M560,165 L580,180 L600,160 L580,140 Z"
              className={`state ${selectedState === 'Connecticut' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Connecticut')}
            />
            <path 
              d="M580,140 L600,160 L620,140 L610,120 Z"
              className={`state ${selectedState === 'Massachusetts' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Massachusetts')}
            />
            <path 
              d="M610,120 L620,140 L640,130 L620,110 Z"
              className={`state ${selectedState === 'New Hampshire' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('New Hampshire')}
            />
            <path 
              d="M620,110 L640,130 L650,110 Z"
              className={`state ${selectedState === 'Maine' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Maine')}
            />
            <path 
              d="M600,160 L620,140 L610,120 L580,140 Z"
              className={`state ${selectedState === 'Rhode Island' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Rhode Island')}
            />
            <path 
              d="M580,140 L610,120 L620,110 L600,100 L560,165 Z"
              className={`state ${selectedState === 'Vermont' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Vermont')}
            />

            {/* Alaska (simplified) */}
            <path 
              d="M100,150 L150,130 L130,180 L80,200 Z"
              className={`state ${selectedState === 'Alaska' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Alaska')}
            />

            {/* Hawaii (simplified) */}
            <path 
              d="M200,450 L220,440 L230,460 L210,470 Z"
              className={`state ${selectedState === 'Hawaii' ? 'fill-primary' : 'fill-gray-200'} stroke-gray-400`}
              onClick={() => onStateSelect?.('Hawaii')}
            />

            {/* State labels - would need proper positioning */}
            {Object.entries(stateData).map(([state, abbr]) => {
              // State label positions would need to be defined
              const position = getStatePosition(state);
              return (
                <text
                  key={abbr}
                  x={position.x}
                  y={position.y}
                  fontSize="8"
                  fill={selectedState === state ? 'white' : 'black'}
                  textAnchor="middle"
                  className="cursor-pointer"
                  onClick={() => onStateSelect?.(state)}
                >
                  {abbr}
                </text>
              );
            })}
          </g>
        </svg>
      </div>
      <p className="text-sm text-center mt-2 text-neutral-light">
        {selectedState 
          ? `You selected: ${selectedState}` 
          : "Select a state from the dropdown or click directly on the map"}
      </p>
    </div>
  );
};

// Helper function to position state labels
function getStatePosition(state: string): { x: number, y: number } {
  // This would be a lookup table for positioning state labels
  const positions: Record<string, { x: number, y: number }> = {
    'Alabama': { x: 545, y: 385 },
    'Alaska': { x: 115, y: 175 },
    'Arizona': { x: 200, y: 385 },
    'Arkansas': { x: 450, y: 410 },
    'California': { x: 130, y: 380 },
    'Colorado': { x: 285, y: 385 },
    'Connecticut': { x: 580, y: 160 },
    'Delaware': { x: 550, y: 230 },
    'Florida': { x: 600, y: 410 },
    'Georgia': { x: 545, y: 350 },
    'Hawaii': { x: 215, y: 455 },
    'Idaho': { x: 220, y: 335 },
    'Illinois': { x: 430, y: 330 },
    'Indiana': { x: 435, y: 245 },
    'Iowa': { x: 410, y: 355 },
    'Kansas': { x: 350, y: 385 },
    'Kentucky': { x: 475, y: 310 },
    'Louisiana': { x: 425, y: 460 },
    'Maine': { x: 635, y: 120 },
    'Maryland': { x: 525, y: 220 },
    'Massachusetts': { x: 615, y: 140 },
    'Michigan': { x: 390, y: 285 },
    'Minnesota': { x: 370, y: 295 },
    'Mississippi': { x: 500, y: 395 },
    'Missouri': { x: 440, y: 385 },
    'Montana': { x: 245, y: 305 },
    'Nebraska': { x: 340, y: 355 },
    'Nevada': { x: 180, y: 340 },
    'New Hampshire': { x: 630, y: 125 },
    'New Jersey': { x: 560, y: 205 },
    'New Mexico': { x: 240, y: 435 },
    'New York': { x: 545, y: 178 },
    'North Carolina': { x: 525, y: 280 },
    'North Dakota': { x: 300, y: 295 },
    'Ohio': { x: 470, y: 220 },
    'Oklahoma': { x: 395, y: 400 },
    'Oregon': { x: 180, y: 300 },
    'Pennsylvania': { x: 510, y: 195 },
    'Rhode Island': { x: 600, y: 150 },
    'South Carolina': { x: 590, y: 345 },
    'South Dakota': { x: 310, y: 325 },
    'Tennessee': { x: 490, y: 345 },
    'Texas': { x: 320, y: 455 },
    'Utah': { x: 240, y: 375 },
    'Vermont': { x: 585, y: 120 },
    'Virginia': { x: 510, y: 245 },
    'Washington': { x: 170, y: 265 },
    'West Virginia': { x: 455, y: 270 },
    'Wisconsin': { x: 410, y: 305 },
    'Wyoming': { x: 290, y: 355 }
  };
  
  return positions[state] || { x: 0, y: 0 };
}

export default UsaMap;