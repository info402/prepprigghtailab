import React from 'react';

/**
 * Generate a company logo URL from company name using Clearbit Logo API
 * Falls back to a placeholder if logo cannot be loaded
 */
export const getCompanyLogoUrl = (companyName: string, logoUrl?: string): string => {
  // If custom logo URL is provided, use it
  if (logoUrl) {
    return logoUrl;
  }

  // Map of common company names to their domains
  const companyDomainMap: Record<string, string> = {
    'google': 'google.com',
    'google india': 'google.com',
    'amazon': 'amazon.com',
    'microsoft': 'microsoft.com',
    'flipkart': 'flipkart.com',
    'swiggy': 'swiggy.com',
    'zomato': 'zomato.com',
    'paytm': 'paytm.com',
    'phonepe': 'phonepe.com',
    'cred': 'cred.club',
    'razorpay': 'razorpay.com',
    'zerodha': 'zerodha.com',
    'ola': 'olacabs.com',
    'byjus': 'byjus.com',
    "byju's": 'byjus.com',
    'unacademy': 'unacademy.com',
    'meesho': 'meesho.com',
    'dream11': 'dream11.com',
    'dunzo': 'dunzo.in',
    'myntra': 'myntra.com',
    'polygon': 'polygon.technology',
    'mckinsey': 'mckinsey.com',
    'mckinsey & company': 'mckinsey.com',
    'deloitte': 'deloitte.com',
    'accenture': 'accenture.com',
    'tcs': 'tcs.com',
    'infosys': 'infosys.com',
    'wipro': 'wipro.com',
    'hcl': 'hcltech.com',
    'hcl technologies': 'hcltech.com',
    'cognizant': 'cognizant.com',
    'capgemini': 'capgemini.com',
    'tech mahindra': 'techmahindra.com',
    'ibm': 'ibm.com',
    'ibm india': 'ibm.com',
    'oracle': 'oracle.com',
    'ey': 'ey.com',
  };

  const normalizedName = companyName.toLowerCase().trim();
  
  // Check if we have a mapped domain
  const domain = companyDomainMap[normalizedName];
  
  if (domain) {
    return `https://logo.clearbit.com/${domain}`;
  }

  // Try to extract domain from company name
  // Remove common suffixes and convert to domain format
  const cleanName = normalizedName
    .replace(/\s+(pvt\.?|ltd\.?|limited|inc\.?|corp\.?|corporation|india|technologies|technology|solutions|software|systems)/gi, '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  // Generate potential domain
  return `https://logo.clearbit.com/${cleanName}.com`;
};

interface CompanyLogoProps {
  companyName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Component to display company logo with fallback
 */
export const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  companyName, 
  logoUrl, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const url = getCompanyLogoUrl(companyName, logoUrl);
  const initials = companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} ${className} rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0`}>
      <img
        src={url}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain p-1"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent text-white font-bold';
            fallback.style.fontSize = size === 'sm' ? '0.75rem' : size === 'md' ? '0.875rem' : '1rem';
            fallback.textContent = initials;
            parent.appendChild(fallback);
          }
        }}
      />
    </div>
  );
};
