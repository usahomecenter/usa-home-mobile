import { Link } from "wouter";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
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
          <CardTitle className="text-2xl font-bold">{t('privacy_policy')}</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <section>
            <p className="font-medium text-neutral-light">Last updated: May 03, 2025</p>
            <p>{t('privacy_policy_introduction')}</p>
          </section>

          <section>
            <h2>1. {t('information_we_collect')}</h2>
            <h3>{t('personal_information')}</h3>
            <p>{t('personal_information_description')}</p>
            <ul>
              <li>{t('contact_information')}: {t('contact_information_description')}</li>
              <li>{t('account_information')}: {t('account_information_description')}</li>
              <li>{t('professional_information')}: {t('professional_information_description')}</li>
              <li>{t('payment_information')}: {t('payment_information_description')}</li>
              <li>{t('communications')}: {t('communications_description')}</li>
            </ul>

            <h3>{t('automatically_collected_information')}</h3>
            <p>{t('automatically_collected_information_description')}</p>
            <ul>
              <li>{t('usage_data')}: {t('usage_data_description')}</li>
              <li>{t('device_data')}: {t('device_data_description')}</li>
              <li>{t('location_data')}: {t('location_data_description')}</li>
              <li>{t('cookies_and_tracking')}: {t('cookies_and_tracking_description')}</li>
            </ul>
          </section>

          <section>
            <h2>2. {t('how_we_use_your_information')}</h2>
            <p>{t('information_use_description')}</p>
            <ul>
              <li>{t('provide_services')}: {t('provide_services_description')}</li>
              <li>{t('process_transactions')}: {t('process_transactions_description')}</li>
              <li>{t('user_authentication')}: {t('user_authentication_description')}</li>
              <li>{t('connect_users')}: {t('connect_users_description')}</li>
              <li>{t('improve_services')}: {t('improve_services_description')}</li>
              <li>{t('communicate')}: {t('communicate_description')}</li>
              <li>{t('marketing')}: {t('marketing_description')}</li>
              <li>{t('compliance')}: {t('compliance_description')}</li>
            </ul>
          </section>

          <section>
            <h2>3. {t('legal_basis_for_processing')}</h2>
            <p>{t('legal_basis_description')}</p>
            <ul>
              <li>{t('contractual_necessity')}: {t('contractual_necessity_description')}</li>
              <li>{t('legitimate_interests')}: {t('legitimate_interests_description')}</li>
              <li>{t('legal_compliance')}: {t('legal_compliance_description')}</li>
              <li>{t('consent')}: {t('consent_description')}</li>
            </ul>
          </section>

          <section>
            <h2>4. {t('sharing_your_information')}</h2>
            <p>{t('information_sharing_description')}</p>
            <ul>
              <li>{t('between_users')}: {t('between_users_description')}</li>
              <li>{t('service_providers')}: {t('service_providers_description')}</li>
              <li>{t('business_transfers')}: {t('business_transfers_description')}</li>
              <li>{t('legal_requirements')}: {t('legal_requirements_description')}</li>
              <li>{t('with_consent')}: {t('with_consent_description')}</li>
            </ul>
          </section>

          <section>
            <h2>5. {t('data_security')}</h2>
            <p>{t('data_security_description')}</p>
            <p>{t('data_security_limitations')}</p>
          </section>

          <section>
            <h2>6. {t('data_retention')}</h2>
            <p>{t('data_retention_description')}</p>
            <p>{t('data_retention_criteria')}</p>
          </section>

          <section>
            <h2>7. {t('your_privacy_rights')}</h2>
            <p>{t('privacy_rights_description')}</p>
            <ul>
              <li>{t('access')}: {t('access_description')}</li>
              <li>{t('correction')}: {t('correction_description')}</li>
              <li>{t('deletion')}: {t('deletion_description')}</li>
              <li>{t('restriction')}: {t('restriction_description')}</li>
              <li>{t('data_portability')}: {t('data_portability_description')}</li>
              <li>{t('objection')}: {t('objection_description')}</li>
              <li>{t('withdraw_consent')}: {t('withdraw_consent_description')}</li>
            </ul>
          </section>

          <section>
            <h2>8. {t('california_privacy_rights')}</h2>
            <p>{t('california_privacy_rights_description')}</p>
            <h3>{t('california_privacy_notice')}</h3>
            <p>{t('california_privacy_notice_description')}</p>
            <ul>
              <li>{t('personal_information_categories')}: {t('personal_information_categories_description')}</li>
              <li>{t('california_consumer_rights')}: {t('california_consumer_rights_description')}</li>
              <li>{t('do_not_sell')}: {t('do_not_sell_description')}</li>
              <li>{t('non_discrimination')}: {t('non_discrimination_description')}</li>
            </ul>
          </section>

          <section>
            <h2>9. {t('international_data_transfers')}</h2>
            <p>{t('international_data_transfers_description')}</p>
          </section>

          <section>
            <h2>10. {t('children_privacy')}</h2>
            <p>{t('children_privacy_description')}</p>
          </section>

          <section>
            <h2>11. {t('third_party_links')}</h2>
            <p>{t('third_party_links_description')}</p>
          </section>

          <section>
            <h2>12. {t('cookies_policy')}</h2>
            <p>{t('cookies_policy_description')}</p>
            <h3>{t('what_are_cookies')}</h3>
            <p>{t('what_are_cookies_description')}</p>
            <h3>{t('types_of_cookies')}</h3>
            <p>{t('types_of_cookies_description')}</p>
            <ul>
              <li>{t('essential_cookies')}: {t('essential_cookies_description')}</li>
              <li>{t('preference_cookies')}: {t('preference_cookies_description')}</li>
              <li>{t('analytics_cookies')}: {t('analytics_cookies_description')}</li>
              <li>{t('advertising_cookies')}: {t('advertising_cookies_description')}</li>
            </ul>
            <h3>{t('cookie_management')}</h3>
            <p>{t('cookie_management_description')}</p>
          </section>

          <section>
            <h2>13. {t('changes_to_privacy_policy')}</h2>
            <p>{t('changes_to_privacy_policy_description')}</p>
          </section>

          <section>
            <h2>14. {t('contact_us')}</h2>
            <p>{t('privacy_contact_us_description')}</p>
            <p>Email: support@usahome.center</p>
            <p>USA Home Privacy Team</p>
            <p>123 Main Street, Suite 100</p>
            <p>Anytown, CA 90001</p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}