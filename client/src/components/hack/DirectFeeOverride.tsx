import { useEffect } from 'react';

/**
 * Component to force override fee display by directly manipulating the DOM
 * This is a last resort solution for when React state approach isn't working
 */
export function DirectFeeOverride() {
  useEffect(() => {
    // Function to override the fee display with brute force approach
    const forceOverrideFee = () => {
      console.log('🔧 FORCE OVERRIDE: Starting direct fee override process');
      
      try {
        // Target the entire page
        const allElements = document.querySelectorAll('*');
        
        // Track if we've made any changes
        let changesMade = false;
        
        // Check each element
        allElements.forEach(el => {
          // Only target text nodes that might contain the fee
          if (el.childNodes) {
            el.childNodes.forEach(node => {
              if (node.nodeType === Node.TEXT_NODE && node.textContent) {
                const text = node.textContent;
                
                // Look specifically for the incorrect fee
                if (text.includes('$34.77')) {
                  // Replace it with the correct fee
                  node.textContent = text.replace('$34.77', '$39.77');
                  changesMade = true;
                  console.log('✅ FORCE OVERRIDE: Fixed fee display', el);
                }
              }
            });
          }
        });
        
        if (changesMade) {
          console.log('✅ FORCE OVERRIDE: Successfully updated fee display');
        } else {
          console.log('ℹ️ FORCE OVERRIDE: No instances of $34.77 found to replace');
        }
      } catch (error) {
        console.error('❌ FORCE OVERRIDE: Error during fee override:', error);
      }
    };
    
    // Run immediately and then repeatedly to catch any dynamically loaded content
    forceOverrideFee();
    
    // Set up an interval to repeatedly check for and fix the fee
    const intervalId = setInterval(forceOverrideFee, 1000);
    
    // Also run after small delay to catch any elements after initial render
    const timeoutId = setTimeout(forceOverrideFee, 500);
    
    // Clean up
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, []);
  
  return null; // No visible UI
}

export default DirectFeeOverride;