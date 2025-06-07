import React from 'react';
import { useTranslation } from '@/hooks/useLanguage';
import { Link } from 'wouter';

const PrivacyPolicyPage = () => {
  const { translate } = useTranslation();
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Link href="/">
          <a className="text-blue-600 hover:underline">
            ← {translate('home')}
          </a>
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">USA Home Privacy Policy</h1>
      <p className="text-gray-500 mb-6">Last Updated: May 14, 2025</p>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p>
          USA Home ("we," "our," or "us") respects your privacy and is committed to protecting the personal information that you share with us. This Privacy Policy explains how we collect, use, and disclose information through our mobile application and related services (collectively, the "Services").
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
        <h3 className="text-xl font-medium mt-6 mb-3">2.1 Information You Provide to Us</h3>
        <p>
          We collect information you provide directly to us, including:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Account information: When you create an account, we collect your name, email address, username, and password.</li>
          <li>Profile information: Professional users may provide additional information such as contact details, professional qualifications, service areas, and photos.</li>
          <li>Communications: When you contact us or communicate with others through our Services.</li>
          <li>Transaction information: If you make a payment through our Services, we collect payment information, billing address, and related transaction details.</li>
        </ul>

        <h3 className="text-xl font-medium mt-6 mb-3">2.2 Information We Collect Automatically</h3>
        <p>
          When you use our Services, we may automatically collect:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Device information: Information about your device, including IP address, device type, operating system, and browser type.</li>
          <li>Usage information: Information about how you use our Services, including the pages you visit and features you use.</li>
          <li>Location information: With your consent, we may collect precise location information from your device.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Provide, maintain, and improve our Services</li>
          <li>Process transactions and send related information</li>
          <li>Connect service providers with potential clients</li>
          <li>Send administrative information, such as updates or security alerts</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Personalize your experience</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Detect, prevent, and address technical issues and fraudulent transactions</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Information Sharing</h2>
        <p>
          We may share your information in the following circumstances:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>With other users as part of the normal operation of the Services (e.g., when consumers view professional profiles)</li>
          <li>With vendors, consultants, and service providers who need access to perform work on our behalf</li>
          <li>In response to a legal request if required by law</li>
          <li>To protect the rights, property, and safety of our users or others</li>
          <li>In connection with a business transfer or transaction</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Your Choices</h2>
        <p>
          You can access and update certain information through your account settings. You may also:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Opt out of promotional communications by following the instructions in those messages</li>
          <li>Disable location permissions in your device settings</li>
          <li>Request deletion of your account by contacting us</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Security</h2>
        <p>
          We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access. However, no security system is impenetrable, and we cannot guarantee the security of your information.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
        <p>
          Our Services are not directed to children under 13, and we do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p className="mt-2">
          Email: support@usahome.center<br />
          Address: 123 Main Street, Anytown, USA 12345
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;