import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | LaunchRecord",
  description: "Learn how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-white mb-8">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Introduction
              </h2>
              <p className="leading-relaxed">
                LaunchRecord ("we," "us," or "our") is committed to protecting
                your privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our
                service. Please read this policy carefully to understand our
                practices regarding your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                2.1 Personal Information
              </h3>
              <p className="leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create an account (name, email address, username)</li>
                <li>Submit a product launch</li>
                <li>Comment on launches</li>
                <li>Contact our support team</li>
                <li>Subscribe to our newsletter</li>
              </ul>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                2.2 Automatically Collected Information
              </h3>
              <p className="leading-relaxed mb-4">
                When you access the Service, we may automatically collect:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Device information (browser type, operating system)</li>
                <li>IP address and general location</li>
                <li>Pages visited and time spent</li>
                <li>Referring website addresses</li>
                <li>Click statistics and engagement metrics</li>
              </ul>

              <h3 className="text-xl font-medium text-white mt-6 mb-3">
                2.3 Cookies and Similar Technologies
              </h3>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to enhance
                your experience, analyze site traffic, and personalize content.
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. How We Use Your Information
              </h2>
              <p className="leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide, maintain, and improve the Service</li>
                <li>Create and manage your account</li>
                <li>Process and display your product launches</li>
                <li>Send you service-related communications</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect and prevent fraudulent activity</li>
                <li>Generate aggregated, anonymized statistics</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. Information Sharing and Disclosure
              </h2>
              <p className="leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to
                third parties. We may share information in the following
                circumstances:
              </p>

              <h3 className="text-xl font-medium text-white mt-4 mb-3">
                4.1 Public Information
              </h3>
              <p className="leading-relaxed mb-4">
                Information you choose to make public, such as your profile
                name, submitted launches, and comments, will be visible to
                other users and visitors.
              </p>

              <h3 className="text-xl font-medium text-white mt-4 mb-3">
                4.2 Service Providers
              </h3>
              <p className="leading-relaxed mb-4">
                We may share information with trusted third-party service
                providers who assist us in operating our service, conducting
                business, or serving users, subject to confidentiality
                agreements.
              </p>

              <h3 className="text-xl font-medium text-white mt-4 mb-3">
                4.3 Legal Requirements
              </h3>
              <p className="leading-relaxed mb-4">
                We may disclose information if required by law, regulation,
                legal process, or governmental request, or to protect the
                rights, property, and safety of LaunchRecord, our users, or
                others.
              </p>

              <h3 className="text-xl font-medium text-white mt-4 mb-3">
                4.4 Business Transfers
              </h3>
              <p className="leading-relaxed">
                In connection with any merger, sale of company assets,
                financing, or acquisition of all or a portion of our business,
                user information may be transferred as part of the transaction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Data Security
              </h2>
              <p className="leading-relaxed">
                We implement reasonable security measures to protect your
                personal information from unauthorized access, alteration,
                disclosure, or destruction. However, no method of transmission
                over the Internet or electronic storage is 100% secure, and we
                cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Data Retention
              </h2>
              <p className="leading-relaxed">
                We retain personal information for as long as necessary to
                fulfill the purposes outlined in this policy, unless a longer
                retention period is required by law. When information is no
                longer needed, we will delete or anonymize it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
                <li>Restrict or object to certain processing</li>
                <li>Withdraw consent (where processing is consent-based)</li>
              </ul>
              <p className="leading-relaxed mt-4">
                To exercise these rights, please contact us using the
                information provided at the end of this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Third-Party Links
              </h2>
              <p className="leading-relaxed">
                The Service may contain links to third-party websites or
                services. We are not responsible for the privacy practices or
                content of these third-party sites. We encourage you to review
                their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Children's Privacy
              </h2>
              <p className="leading-relaxed">
                The Service is not intended for children under the age of 13.
                We do not knowingly collect personal information from children
                under 13. If we become aware that we have collected such
                information, we will take steps to delete it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. International Data Transfers
              </h2>
              <p className="leading-relaxed">
                Your information may be transferred to and processed in
                countries other than your country of residence. We ensure
                appropriate safeguards are in place to protect your information
                in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                11. Changes to This Policy
              </h2>
              <p className="leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of significant changes by posting the new policy on
                the Service and updating the "Last updated" date. Your
                continued use of the Service after changes constitutes
                acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                12. Contact Us
              </h2>
              <p className="leading-relaxed">
                If you have any questions, concerns, or requests regarding this
                Privacy Policy or our data practices, please contact us through
                our support channels.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                13. California Privacy Rights (CCPA)
              </h2>
              <p className="leading-relaxed mb-4">
                California residents have additional rights under the California
                Consumer Privacy Act:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to know what personal information is collected</li>
                <li>Right to know if personal information is sold or disclosed</li>
                <li>Right to opt-out of the sale of personal information</li>
                <li>Right to delete personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
              </ul>
              <p className="leading-relaxed mt-4">
                We do not sell personal information as defined by the CCPA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                14. European Privacy Rights (GDPR)
              </h2>
              <p className="leading-relaxed mb-4">
                European Economic Area residents have the following rights under
                the General Data Protection Regulation:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Right to access personal data</li>
                <li>Right to rectification of inaccurate data</li>
                <li>Right to erasure ("right to be forgotten")</li>
                <li>Right to restrict processing</li>
                <li>Right to data portability</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
