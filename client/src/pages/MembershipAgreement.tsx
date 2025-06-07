import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MembershipAgreement() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Link href="/auth" className="flex items-center text-primary hover:underline mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Professional Membership Agreement</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <section>
            <p className="font-medium text-neutral-light">Last updated: May 04, 2025</p>
            <p>This Professional Membership Agreement ("Agreement") is entered into between you ("Professional Member," "you," or "your") and USA Home ("we," "us," or "our").</p>
          </section>

          <section>
            <h2>1. Membership Benefits and Services</h2>
            <p>As a Professional Member, you will receive the following benefits and services:</p>
            <ul>
              <li><strong>Directory Listing:</strong> Your business profile will be displayed in our professional directory, enabling potential clients to discover your services.</li>
              <li><strong>Profile Management:</strong> Access to our platform to create and manage your professional profile, including the ability to showcase your qualifications, experience, and previous work.</li>
              <li><strong>Client Connection:</strong> Opportunity to connect with potential clients seeking services in your area of expertise.</li>
              <li><strong>Review Management:</strong> Ability to receive and respond to client reviews and ratings.</li>
              <li><strong>Support Services:</strong> Access to our customer support services to assist with any platform-related issues.</li>
            </ul>
          </section>

          <section>
            <h2>2. Membership Fees and Payment</h2>
            <p>Your Professional Membership is subject to the following fee structure:</p>
            <ul>
              <li><strong>Trial Period:</strong> A complimentary 30-day free trial period from the date of your registration.</li>
              <li><strong>Monthly Fee:</strong> Following the trial period, a monthly fee of $29.77 will be automatically charged to your designated payment method.</li>
              <li><strong>Billing Cycle:</strong> Your membership fee will be billed on a monthly basis, on the same day of the month as your initial paid billing date.</li>
              <li><strong>Payment Method:</strong> You are responsible for providing and maintaining a valid payment method for recurring charges.</li>
              <li><strong>Price Changes:</strong> We reserve the right to modify subscription fees at our sole discretion. Subscription fees are subject to change at any time, provided that we will give you at least 30 days' advance notice of any change. Any price changes will be communicated to you via email and will take effect on your next billing cycle. Continued use of the service after a price change takes effect constitutes acceptance of the new subscription fee.</li>
            </ul>
          </section>

          <section>
            <h2>3. Membership Term and Renewal</h2>
            <p>Your Professional Membership operates as follows:</p>
            <ul>
              <li><strong>Initial Term:</strong> Your membership begins with the 30-day free trial period, followed by automatic enrollment in the paid monthly membership.</li>
              <li><strong>Automatic Renewal:</strong> Your membership will automatically renew each month until cancelled.</li>
              <li><strong>Cancellation:</strong> You may cancel your membership at any time through your account settings or by contacting our customer support. Cancellation will take effect at the end of your current billing period.</li>
              <li><strong>No Refunds:</strong> We do not provide refunds for partial membership periods or for periods during which you did not use the membership services.</li>
            </ul>
          </section>

          <section>
            <h2>4. Member Responsibilities</h2>
            <p>As a Professional Member, you agree to:</p>
            <ul>
              <li><strong>Accurate Information:</strong> Provide accurate, truthful, and non-misleading information about your qualifications, experience, credentials, and services.</li>
              <li><strong>Licensing and Insurance:</strong> Maintain all required professional licenses, permits, and insurance coverage for your services and promptly update your profile if there are any changes to your status.</li>
              <li><strong>Quality Service:</strong> Provide professional, high-quality services to clients you connect with through our platform.</li>
              <li><strong>Compliance:</strong> Comply with all applicable laws, regulations, and professional standards related to your services.</li>
              <li><strong>Communication:</strong> Respond to client inquiries and communications in a timely and professional manner.</li>
              <li><strong>Review Response:</strong> Respond professionally to client reviews, regardless of whether they are positive or negative.</li>
            </ul>
          </section>

          <section>
            <h2>5. Account Security</h2>
            <p>You are responsible for:</p>
            <ul>
              <li><strong>Account Protection:</strong> Maintaining the confidentiality of your account credentials and preventing unauthorized access to your account.</li>
              <li><strong>Unauthorized Use:</strong> Promptly notifying us of any unauthorized use of your account or other security breaches.</li>
              <li><strong>Device Security:</strong> Ensuring the security of devices you use to access our platform.</li>
            </ul>
          </section>

          <section>
            <h2>6. Content Ownership and License</h2>
            <p>With respect to content you provide:</p>
            <ul>
              <li><strong>Your Content:</strong> You retain ownership of all content you upload to our platform, including profile information, photographs, descriptions, and responses to reviews.</li>
              <li><strong>License to Us:</strong> You grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, and display your content for the purpose of providing and promoting our services.</li>
              <li><strong>Prohibited Content:</strong> You agree not to upload content that is illegal, infringing, defamatory, obscene, or otherwise objectionable.</li>
            </ul>
          </section>

          <section>
            <h2>7. Suspension and Termination</h2>
            <p>We reserve the right to:</p>
            <ul>
              <li><strong>Suspension:</strong> Suspend your membership if you breach this Agreement, fail to pay membership fees, or engage in conduct that could harm our platform or other users.</li>
              <li><strong>Termination:</strong> Terminate your membership for repeated or severe violations of this Agreement, fraud, or illegal activity.</li>
              <li><strong>Effect of Termination:</strong> Upon termination, your profile will be removed from our directory, and you will lose access to membership benefits. You remain responsible for any outstanding fees.</li>
            </ul>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law:</p>
            <ul>
              <li><strong>No Guarantees:</strong> We do not guarantee any specific number of client connections, inquiries, or business opportunities through our platform.</li>
              <li><strong>Service Availability:</strong> We strive to maintain platform availability but cannot guarantee uninterrupted access or specific features.</li>
              <li><strong>Indirect Damages:</strong> We are not liable for any indirect, incidental, special, or consequential damages arising from your membership or use of our platform.</li>
              <li><strong>Maximum Liability:</strong> Our total liability related to this Agreement shall not exceed the amount you paid for your membership during the 12 months preceding the claim.</li>
            </ul>
          </section>

          <section>
            <h2>9. Changes to Agreement</h2>
            <p>We may update this Agreement as follows:</p>
            <ul>
              <li><strong>Modifications:</strong> We may modify this Agreement at any time, with changes effective upon posting to our website or direct notification to you.</li>
              <li><strong>Material Changes:</strong> For material changes, we will provide at least 30 days' notice via email before the changes take effect.</li>
              <li><strong>Pricing Modifications:</strong> In addition to Section 2 ("Membership Fees and Payment"), we explicitly reserve the right to modify, change, or update subscription pricing at our sole discretion. Such pricing changes may be due to market conditions, operational costs, platform enhancements, or other business considerations.</li>
              <li><strong>Continued Use:</strong> Your continued use of our platform after changes take effect constitutes acceptance of the revised Agreement.</li>
            </ul>
          </section>

          <section>
            <h2>10. Dispute Resolution</h2>
            <p>Any disputes arising from this Agreement will be resolved as follows:</p>
            <ul>
              <li><strong>Informal Resolution:</strong> We will attempt to resolve disputes informally through direct communication.</li>
              <li><strong>Binding Arbitration:</strong> Any unresolved dispute shall be resolved through binding arbitration conducted in accordance with the American Arbitration Association's Commercial Arbitration Rules.</li>
              <li><strong>Class Action Waiver:</strong> You waive any right to participate in a class action lawsuit or class-wide arbitration.</li>
              <li><strong>Governing Law:</strong> This Agreement is governed by the laws of the state of [State], without regard to conflict of laws principles.</li>
            </ul>
          </section>

          <section>
            <h2>11. Miscellaneous</h2>
            <ul>
              <li><strong>Entire Agreement:</strong> This Agreement, together with our Terms and Conditions and Privacy Policy, constitutes the entire agreement between you and us regarding your Professional Membership.</li>
              <li><strong>Severability:</strong> If any provision of this Agreement is found to be unenforceable, the remaining provisions will remain in full force and effect.</li>
              <li><strong>Assignment:</strong> You may not assign your rights or obligations under this Agreement without our prior written consent. We may assign our rights and obligations at any time.</li>
              <li><strong>No Waiver:</strong> Our failure to enforce any right or provision of this Agreement will not be considered a waiver of such right or provision.</li>
            </ul>
          </section>

          <section>
            <h2>12. Contact Information</h2>
            <p>If you have any questions or concerns about this Membership Agreement, please contact us at:</p>
            <p>Email: membership@usahome.com</p>
            <p>USA Home Membership Team</p>
            <p>123 Main Street, Suite 100</p>
            <p>Anytown, CA 90001</p>
          </section>

          <section>
            <p>By selecting "I agree" during the registration process, you acknowledge that you have read, understood, and agree to be bound by this Professional Membership Agreement.</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}