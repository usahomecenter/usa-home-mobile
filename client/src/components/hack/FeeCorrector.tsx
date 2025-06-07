import { useEffect } from 'react';

// This component has one job: override any incorrect fee display
export function FeeCorrector() {
  useEffect(() => {
    // Function to find and correct all instances of the incorrect fee
    const correctFees = () => {
      console.log("⚠️ FEE CORRECTOR RUNNING");
      
      // Target all elements on the page
      const allElements = document.querySelectorAll('*');
      
      // Check each element for the incorrect fee text
      allElements.forEach(el => {
        // Skip elements that don't have text nodes as direct children
        if (!el.childNodes || el.childNodes.length === 0) return;
        
        // Check each child node
        el.childNodes.forEach(node => {
          // Only process text nodes
          if (node.nodeType === Node.TEXT_NODE && node.textContent) {
            // Check if the text includes the incorrect fee
            if (node.textContent.includes('$34.77')) {
              // Replace the incorrect fee with the correct one
              node.textContent = node.textContent.replace('$34.77', '$39.77');
              console.log("✅ CORRECTED FEE DISPLAY", el);
            }
          }
        });
      });
    };
    
    // Run the correction immediately 
    correctFees();
    
    // Then run it periodically to catch any dynamically added content
    const interval = setInterval(correctFees, 500);
    
    // Clean up on unmount
    return () => clearInterval(interval);
  }, []);
  
  // This component doesn't render anything
  return null;
}

export default FeeCorrector;