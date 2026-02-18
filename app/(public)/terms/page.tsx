import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | LaunchRecord",
  description: "Read our terms of service and usage agreement.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground mb-8">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="leading-relaxed">
                By accessing and using LaunchRecord (the "Service"), you accept
                and agree to be bound by the terms and provision of this
                agreement. If you do not agree to abide by these terms, please
                do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                2. Description of Service
              </h2>
              <p className="leading-relaxed">
                LaunchRecord is a platform for discovering, sharing, and
                promoting new product launches, startups, and projects. The
                service allows users to submit their launches, browse featured
                products, and engage with the community through discussions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                3. User Accounts
              </h2>
              <p className="leading-relaxed mb-4">
                To use certain features of the Service, you may be required to
                create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>
                  Notifying us immediately of any unauthorized account access
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                4. User Content
              </h2>
              <p className="leading-relaxed mb-4">
                You are responsible for the content you submit, including
                launches, comments, and other materials. By submitting content,
                you represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>You own or have the necessary rights to the content</li>
                <li>
                  The content does not violate any third-party rights
                </li>
                <li>
                  The content is accurate and not misleading
                </li>
                <li>
                  The content does not contain malware or harmful code
                </li>
              </ul>
              <p className="leading-relaxed mt-4">
                We reserve the right to remove any content that violates these
                terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                5. Prohibited Conduct
              </h2>
              <p className="leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Use the service for any illegal purpose</li>
                <li>
                  Harass, abuse, or harm another person through the service
                </li>
                <li>
                  Submit false, inaccurate, or misleading information
                </li>
                <li>
                  Interfere with or disrupt the service or servers
                </li>
                <li>
                  Attempt to gain unauthorized access to the service
                </li>
                <li>
                  Use automated systems to access the service without permission
                </li>
                <li>
                  Impersonate any person or entity
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                6. Featured Placements
              </h2>
              <p className="leading-relaxed">
                Featured placements are subject to availability and our
                discretion. We reserve the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Determine which launches are featured
                </li>
                <li>
                  Set and modify featured placement dates
                </li>
                <li>
                  Remove featured status if content violates our terms
                </li>
                <li>
                  Refuse any submission at our discretion
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                7. Intellectual Property
              </h2>
              <p className="leading-relaxed">
                The Service and its original content, features, and
                functionality are owned by LaunchRecord and are protected by
                international copyright, trademark, patent, trade secret, and
                other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                8. Disclaimer of Warranties
              </h2>
              <p className="leading-relaxed">
                The Service is provided "as is" and "as available" without
                warranties of any kind, either express or implied. We do not
                warrant that the Service will be uninterrupted, secure, or
                error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                9. Limitation of Liability
              </h2>
              <p className="leading-relaxed">
                To the maximum extent permitted by law, LaunchRecord shall not
                be liable for any indirect, incidental, special, consequential,
                or punitive damages, or any loss of profits or revenues, whether
                incurred directly or indirectly, or any loss of data, use,
                goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                10. Indemnification
              </h2>
              <p className="leading-relaxed">
                You agree to indemnify, defend, and hold harmless LaunchRecord
                and its officers, directors, employees, and agents from any
                claims, liabilities, damages, losses, and expenses arising out
                of your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                11. Changes to Terms
              </h2>
              <p className="leading-relaxed">
                We reserve the right to modify these Terms at any time. We will
                provide notice of significant changes by posting the new Terms
                on the Service. Your continued use of the Service after changes
                constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                12. Termination
              </h2>
              <p className="leading-relaxed">
                We may terminate or suspend your account and access to the
                Service immediately, without prior notice, for conduct that we
                believe violates these Terms or is harmful to other users, us,
                or third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                13. Governing Law
              </h2>
              <p className="leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of the jurisdiction where LaunchRecord operates,
                without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">
                14. Contact Information
              </h2>
              <p className="leading-relaxed">
                If you have any questions about these Terms, please contact us
                through our support channels.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
