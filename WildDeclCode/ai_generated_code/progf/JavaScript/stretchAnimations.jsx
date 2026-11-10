// SVG Animations for each stretch (Supported via standard programming aids with some modifications)
const stretchAnimations = {
    1: (
      <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
    {/* <!-- Background --> */}
    {/* <rect width="300" height="400" fill="#f8f9fa" rx="10" ry="10" /> */}
    
    {/* <!-- Body --> */}
    <ellipse cx="150" cy="200" rx="40" ry="60" fill="#64b5f6" stroke="#2286c3" strokeWidth="2" />
    
    {/* <!-- Neck --> */}
    <path d="M150,120 Q150,140 150,150" stroke="#2286c3" strokeWidth="10" strokeLinecap="round" fill="none">
      <animate attributeName="d" values="M150,120 Q150,140 150,150;
                                       M150,120 Q170,140 150,150;
                                       M150,120 Q150,140 150,150;
                                       M150,120 Q130,140 150,150;
                                       M150,120 Q150,140 150,150" 
               dur="4s" repeatCount="indefinite" />
    </path>
    
    {/* <!-- Head --> */}
    <g>
      <circle cx="150" cy="100" r="30" fill="#ffcc80" stroke="#f57c00" strokeWidth="2" />
      
      {/* <!-- Face --> */}
      <ellipse cx="140" cy="95" rx="3" ry="5" fill="#333" />
      <ellipse cx="160" cy="95" rx="3" ry="5" fill="#333" />
      <path d="M140,115 Q150,125 160,115" stroke="#333" strokeWidth="2" fill="none">
        <animate attributeName="d" 
                 values="M140,115 Q150,125 160,115;
                        M140,115 Q150,120 160,115;
                        M140,115 Q150,125 160,115;" 
                 dur="4s" 
                 repeatCount="indefinite" />
      </path>
      
      {/* <!-- Hair --> */}
      <path d="M120,90 Q150,60 180,90" stroke="#5d4037" strokeWidth="10" fill="none" />
      
      {/* <!-- Whole head animation --> */}
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 150 150; 20 150 150; 0 150 150; -20 150 150; 0 150 150"
        dur="4s"
        repeatCount="indefinite"
        additive="sum"
      />
    </g>
    
    {/* <!-- Arms --> */}
    <path d="M110,200 Q100,230 90,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
    <path d="M190,200 Q200,230 210,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
    
    {/* <!-- Hands --> */}
    <circle cx="90" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
    <circle cx="210" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
    
    {/* <!-- Legs --> */}
    <path d="M130,260 Q125,300 120,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
    <path d="M170,260 Q175,300 180,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
    
    {/* <!-- Feet --> */}
    <ellipse cx="115" cy="345" rx="15" ry="8" fill="#5d4037" />
    <ellipse cx="185" cy="345" rx="15" ry="8" fill="#5d4037" />
    
    {/* <!-- Text --> */}
    {/* <text x="150" y="380" textAnchor="middle" fontFamily="Arial" fontSize="16" font-weight="bold" fill="#333">Neck Stretch Exercise</text> */}
    
    {/* <!-- Directional arrows for the neck movement --> */}
    <g opacity="0.6">
      <path d="M190,100 L210,100 L200,90 Z" fill="#f44336">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
      </path>
      <path d="M110,100 L90,100 L100,90 Z" fill="#f44336">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="2s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
    ),
    2: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400">
  
      {/* <!-- Body --> */}
      <ellipse cx="150" cy="200" rx="40" ry="60" fill="#64b5f6" stroke="#2286c3" strokeWidth="2" />
    
      {/* <!-- Neck --> */}
      <path id="neck" d="M150,120 Q150,140 150,150" stroke="#2286c3" strokeWidth="10" strokeLinecap="round" fill="none">
        {/* <animate attributeName="d" values="M150,120 Q150,140 150,150;
                                         M150,120 Q170,140 150,150;
                                         M150,120 Q150,140 150,150;
                                         M150,120 Q130,140 150,150;
                                         M150,120 Q150,140 150,150" 
                 dur="4s" repeatCount="indefinite" /> */}
      </path>
    
      {/* <!-- Head --> */}
      <g id="head">
        <circle cx="150" cy="100" r="30" fill="#ffcc80" stroke="#f57c00" strokeWidth="2" />
        
        {/* <!-- Face --> */}
        <ellipse cx="140" cy="95" rx="3" ry="5" fill="#333" />
        <ellipse cx="160" cy="95" rx="3" ry="5" fill="#333" />
        <path d="M140,115 Q150,125 160,115" stroke="#333" strokeWidth="2" fill="none">
          <animate attributeName="d" 
                   values="M140,115 Q150,125 160,115;
                          M140,115 Q150,120 160,115;
                          M140,115 Q150,125 160,115;" 
                   dur="4s" 
                   repeatCount="indefinite" />
        </path>
        
        {/* <!-- Hair --> */}
        <path d="M120,90 Q150,60 180,90" stroke="#5d4037" strokeWidth="10" fill="none" />
        
        {/* <!-- Whole head animation --> */}
        {/* <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          values="0 150 130; 20 150 130; 0 150 130; -20 150 130; 0 150 130"
          dur="4s"
          repeatCount="indefinite"
          additive="sum" /> */}
      </g>
    
      {/* <!-- Arms --> */}
      <g id="leftArm" transform="rotate(0 110 200)">
        <path d="M110,200 Q100,230 90,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="90" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0 110 200; 30 110 200; 60 110 200; 30 110 200; 0 110 200; -30 110 200; 0 110 200" dur="6s" repeatCount="indefinite" />
      </g>
    
      <g id="rightArm" transform="rotate(0 190 200)">
        <path d="M190,200 Q200,230 210,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="210" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
        <animateTransform attributeName="transform" attributeType="XML" type="rotate" values="0 190 200; -30 190 200; -60 190 200; -30 190 200; 0 190 200; 30 190 200; 0 190 200" dur="6s" repeatCount="indefinite" />
      </g>
    
      {/* <!-- Legs --> */}
      <path d="M130,260 Q125,300 120,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M170,260 Q175,300 180,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
    
      {/* <!-- Feet --> */}
      <ellipse cx="115" cy="345" rx="15" ry="8" fill="#5d4037" />
      <ellipse cx="185" cy="345" rx="15" ry="8" fill="#5d4037" />
    </svg>
    ),
    3: (
      <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        {/* <!-- Body --> */}
        <ellipse cx="150" cy="200" rx="40" ry="60" fill="#64b5f6" stroke="#2286c3" strokeWidth="2" />
        
        {/* <!-- Neck --> */}
        <path d="M150,120 Q150,140 150,150" stroke="#2286c3" strokeWidth="10" strokeLinecap="round" fill="none" />
        
        {/* <!-- Head --> */}
        <g id="hamstring-head">
          <circle cx="150" cy="100" r="30" fill="#ffcc80" stroke="#f57c00" strokeWidth="2" />
          
          {/* <!-- Face --> */}
          <ellipse cx="140" cy="95" rx="3" ry="5" fill="#333" />
          <ellipse cx="160" cy="95" rx="3" ry="5" fill="#333" />
          <path d="M140,115 Q150,125 160,115" stroke="#333" strokeWidth="2" fill="none">
            <animate attributeName="d" 
                     values="M140,115 Q150,125 160,115;
                            M140,115 Q150,120 160,115;
                            M140,115 Q150,125 160,115;" 
                     dur="4s" 
                     repeatCount="indefinite" />
          </path>
          
          {/* <!-- Hair --> */}
          <path d="M120,90 Q150,60 180,90" stroke="#5d4037" strokeWidth="10" fill="none" />
        </g>
        
        {/* <!-- Upper Body Group - for bending animation --> */}
        <g id="upper-body">
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="0 150 200; 30 150 200; 60 150 200; 60 150 200; 30 150 200; 0 150 200"
            dur="4s"
            repeatCount="indefinite"
          />
          
          {/* <!-- Arms --> */}
          <path d="M110,200 Q100,230 90,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M190,200 Q200,230 210,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
          
          {/* <!-- Hands --> */}
          <circle cx="90" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
          <circle cx="210" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
        </g>
        
        {/* <!-- Legs --> */}
        <path d="M130,260 Q125,300 120,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M170,260 Q175,300 180,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
        
        {/* <!-- Feet --> */}
        <ellipse cx="115" cy="345" rx="15" ry="8" fill="#5d4037" />
        <ellipse cx="185" cy="345" rx="15" ry="8" fill="#5d4037" />
        
        {/* <!-- Directional arrows for the bending movement --> */}
        <g opacity="0.6">
          <path d="M150,150 L150,130 L140,140 Z" fill="#f44336">
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    ),
    4: (
      <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        {/* <!-- Body --> */}
        <ellipse cx="150" cy="200" rx="40" ry="60" fill="#64b5f6" stroke="#2286c3" strokeWidth="2" />
        
        {/* <!-- Neck --> */}
        <path d="M150,120 Q150,140 150,150" stroke="#2286c3" strokeWidth="10" strokeLinecap="round" fill="none" />
        
        {/* <!-- Head --> */}
        <g id="quad-head">
          <circle cx="150" cy="100" r="30" fill="#ffcc80" stroke="#f57c00" strokeWidth="2" />
          
          {/* <!-- Face --> */}
          <ellipse cx="140" cy="95" rx="3" ry="5" fill="#333" />
          <ellipse cx="160" cy="95" rx="3" ry="5" fill="#333" />
          <path d="M140,115 Q150,125 160,115" stroke="#333" strokeWidth="2" fill="none">
            <animate attributeName="d" 
                     values="M140,115 Q150,125 160,115;
                            M140,115 Q150,120 160,115;
                            M140,115 Q150,125 160,115;" 
                     dur="4s" 
                     repeatCount="indefinite" />
          </path>
          
          {/* <!-- Hair --> */}
          <path d="M120,90 Q150,60 180,90" stroke="#5d4037" strokeWidth="10" fill="none" />
        </g>
        
        {/* <!-- Left Arm --> */}
        <path d="M110,200 Q100,230 90,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
        <circle cx="90" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
        
        {/* <!-- Right Arm - reaching back to grab foot --> */}
        <path d="M190,200 Q210,230 210,280" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none">
          <animate 
            attributeName="d" 
            values="M190,200 Q210,230 210,280;
                   M190,200 Q220,240 230,290;
                   M190,200 Q210,230 210,280;" 
            dur="3s" 
            repeatCount="indefinite" />
        </path>
        <circle cx="210" cy="280" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1">
          <animate 
            attributeName="cy" 
            values="280;290;280" 
            dur="3s" 
            repeatCount="indefinite" />
          <animate 
            attributeName="cx" 
            values="210;230;210" 
            dur="3s" 
            repeatCount="indefinite" />
        </circle>
        
        {/* <!-- Left Leg - standing leg --> */}
        <path d="M130,260 Q125,300 120,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
        <ellipse cx="115" cy="345" rx="15" ry="8" fill="#5d4037" />
        
        {/* <!-- Right Leg - bent leg --> */}
        <path d="M170,260 Q190,290 200,300" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none">
          <animate 
            attributeName="d" 
            values="M170,260 Q190,290 200,300;
                   M170,260 Q200,280 220,290;
                   M170,260 Q190,290 200,300;" 
            dur="3s" 
            repeatCount="indefinite" />
        </path>
        <ellipse cx="205" cy="300" rx="15" ry="8" fill="#5d4037">
          <animate 
            attributeName="cy" 
            values="300;290;300" 
            dur="3s" 
            repeatCount="indefinite" />
          <animate 
            attributeName="cx" 
            values="205;225;205" 
            dur="3s" 
            repeatCount="indefinite" />
        </ellipse>
        
        {/* <!-- Directional arrows for the quad stretch movement --> */}
        <g opacity="0.6">
          <path d="M180,270 L200,260 L190,250 Z" fill="#f44336">
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    ),
    5: (
      <svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
    {/* <!-- Legs - fixed position, not rotating --> */}
    <g id="legs">
      {/* <!-- Left leg --> */}
      <path d="M130,260 Q125,300 120,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
      {/* <!-- Right leg --> */}
      <path d="M170,260 Q175,300 180,340" stroke="#1565c0" strokeWidth="12" strokeLinecap="round" fill="none" />
      
      {/* <!-- Feet --> */}
      <ellipse cx="115" cy="345" rx="15" ry="8" fill="#5d4037" />
      <ellipse cx="185" cy="345" rx="15" ry="8" fill="#5d4037" />
    </g>
    
    {/* <!-- Upper body with rotation animation from waist --> */}
    <g id="upper-body">
      {/* <!-- Set the pivot point (waist joint) as center of rotation --> */}
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        values="0 150 260; 15 150 260; 0 150 260; -15 150 260; 0 150 260"
        dur="4s"
        repeatCount="indefinite"
      />
      
      {/* <!-- Body --> */}
      <ellipse cx="150" cy="200" rx="40" ry="60" fill="#64b5f6" stroke="#2286c3" strokeWidth="2" />
      
      {/* <!-- Neck --> */}
      <path d="M150,120 Q150,140 150,150" stroke="#2286c3" strokeWidth="10" strokeLinecap="round" fill="none" />
      
      {/* <!-- Head --> */}
      <g id="head">
        <circle cx="150" cy="100" r="30" fill="#ffcc80" stroke="#f57c00" strokeWidth="2" />
        
        {/* <!-- Face --> */}
        <ellipse cx="140" cy="95" rx="3" ry="5" fill="#333" />
        <ellipse cx="160" cy="95" rx="3" ry="5" fill="#333" />
        <path d="M140,115 Q150,125 160,115" stroke="#333" strokeWidth="2" fill="none">
          <animate attributeName="d" 
                   values="M140,115 Q150,125 160,115;
                          M140,115 Q150,120 160,115;
                          M140,115 Q150,125 160,115;" 
                   dur="4s" 
                   repeatCount="indefinite" />
        </path>
        
        {/* <!-- Hair --> */}
        <path d="M120,90 Q150,60 180,90" stroke="#5d4037" strokeWidth="10" fill="none" />
      </g>
      
      {/* <!-- Left Arm - down --> */}
      <path d="M110,200 Q100,230 90,260" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="90" cy="260" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
      
      {/* <!-- Right Arm - raised overhead --> */}
      <path d="M190,200 Q210,150 230,100" stroke="#2286c3" strokeWidth="8" strokeLinecap="round" fill="none" />
      <circle cx="230" cy="100" r="10" fill="#ffcc80" stroke="#f57c00" strokeWidth="1" />
    </g>
    
    {/* <!-- Directional arrows for the side bend movement --> */}
    <g opacity="0.6">
      <path d="M190,150 L210,150 L200,140 Z" fill="#f44336">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="0s" repeatCount="indefinite" />
      </path>
      <path d="M110,150 L90,150 L100,140 Z" fill="#f44336">
        <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" begin="2s" repeatCount="indefinite" />
      </path>
    </g>
    
    {/* <!-- Timer display --> */}
    <circle cx="150" cy="613" r="40" fill="#4285f4" fillOpacity="0.2" />
    <text x="150" y="625" fontFamily="Arial" fontSize="30" textAnchor="middle" fill="#4285f4">30</text>
  </svg>
    ),
  };
  
  export default stretchAnimations;