import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditions() {
  const { t } = useLanguage();
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Link href="/auth" className="flex items-center text-primary hover:underline mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t('back')}
      </Link>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{t('terms_and_conditions')}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <section>
            <h2>1. {t('agreement_to_terms')}</h2>
            <p>{t('terms_introduction')}</p>
            <p>{t('terms_agreement_notice')}</p>
          </section>

          <section>
            <h2>2. {t('intellectual_property_rights')}</h2>
            <p>{t('intellectual_property_description')}</p>
          </section>

          <section>
            <h2>3. {t('user_representations')}</h2>
            <p>{t('user_representations_description')}</p>
            <ul>
              <li>{t('eligibility_clause')}</li>
              <li>{t('accurate_information_clause')}</li>
              <li>{t('legal_compliance_clause')}</li>
              <li>{t('password_security_clause')}</li>
            </ul>
          </section>

          <section>
            <h2>4. {t('professional_services')}</h2>
            <p>{t('professional_services_description')}</p>
            <p>{t('professional_services_disclaimer')}</p>
          </section>

          <section>
            <h2>5. {t('professional_listings')}</h2>
            <p>{t('professional_listings_description')}</p>
            <ul>
              <li>{t('accurate_listing_clause')}</li>
              <li>{t('professional_credentials_clause')}</li>
              <li>{t('service_description_clause')}</li>
              <li>{t('prohibited_services_clause')}</li>
            </ul>
          </section>

          <section>
            <h2>6. {t('prohibited_activities')}</h2>
            <p>{t('prohibited_activities_description')}</p>
            <ul>
              <li>{t('data_scraping_clause')}</li>
              <li>{t('systematic_retrieval_clause')}</li>
              <li>{t('competitive_use_clause')}</li>
              <li>{t('fraudulent_activity_clause')}</li>
              <li>{t('harassment_clause')}</li>
              <li>{t('circumvention_clause')}</li>
            </ul>
          </section>

          <section>
            <h2>7. {t('user_generated_contributions')}</h2>
            <p>{t('user_generated_contributions_description')}</p>
            <p>{t('user_generated_contributions_license')}</p>
          </section>

          <section>
            <h2>8. {t('contribution_license')}</h2>
            <p>{t('contribution_license_description')}</p>
          </section>

          <section>
            <h2>9. {t('reviews')}</h2>
            <p>{t('reviews_description')}</p>
            <p>{t('reviews_guidelines')}</p>
            <p>{t('reviews_removal_policy')}</p>
          </section>

          <section>
            <h2>10. {t('professional_subscription')}</h2>
            <p>{t('professional_subscription_description')}</p>
            <p>{t('professional_subscription_billing')}</p>
            <p>{t('professional_subscription_cancellation')}</p>
          </section>

          <section>
            <h2>11. {t('fee_changes')}</h2>
            <p>{t('fee_changes_description')}</p>
          </section>

          <section>
            <h2>12. {t('cancellations')}</h2>
            <p>{t('cancellations_description')}</p>
          </section>

          <section>
            <h2>13. {t('site_management')}</h2>
            <p>{t('site_management_description')}</p>
          </section>

          <section>
            <h2>14. {t('privacy_policy')}</h2>
            <p>{t('privacy_policy_reference')}</p>
            <p><Link href="/privacy-policy" className="text-primary hover:underline">{t('privacy_policy')}</Link></p>
          </section>

          <section>
            <h2>15. {t('term_and_termination')}</h2>
            <p>{t('term_and_termination_description')}</p>
          </section>

          <section>
            <h2>16. {t('modifications_and_interruptions')}</h2>
            <p>{t('modifications_and_interruptions_description')}</p>
          </section>

          <section>
            <h2>17. {t('governing_law')}</h2>
            <p>{t('governing_law_description')}</p>
          </section>

          <section>
            <h2>18. {t('dispute_resolution')}</h2>
            <p>{t('dispute_resolution_description')}</p>
            <p>{t('dispute_resolution_informal')}</p>
            <p>{t('dispute_resolution_binding_arbitration')}</p>
            <p>{t('dispute_resolution_restrictions')}</p>
            <p>{t('dispute_resolution_time_limitation')}</p>
          </section>

          <section>
            <h2>19. {t('corrections')}</h2>
            <p>{t('corrections_description')}</p>
          </section>

          <section>
            <h2>20. {t('disclaimer')}</h2>
            <p>{t('disclaimer_description')}</p>
          </section>

          <section>
            <h2>21. {t('limitations_of_liability')}</h2>
            <p>{t('limitations_of_liability_description')}</p>
          </section>

          <section>
            <h2>22. {t('indemnification')}</h2>
            <p>{t('indemnification_description')}</p>
          </section>

          <section>
            <h2>23. {t('user_data')}</h2>
            <p>{t('user_data_description')}</p>
          </section>

          <section>
            <h2>24. {t('electronic_communications')}</h2>
            <p>{t('electronic_communications_description')}</p>
          </section>

          <section>
            <h2>25. {t('california_users_and_residents')}</h2>
            <p>{t('california_users_and_residents_description')}</p>
          </section>

          <section>
            <h2>26. {t('miscellaneous')}</h2>
            <p>{t('miscellaneous_description')}</p>
          </section>

          <section>
            <h2>27. {t('contact_us')}</h2>
            <p>{t('terms_contact_us_description')}</p>
            <p>Email: support@usahome.com</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}