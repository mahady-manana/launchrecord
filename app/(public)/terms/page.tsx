import Link from "next/link";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing or using LaunchRecord (&quot;the Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). 
              If you do not agree to these Terms, you must not access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Description of Service</h2>
            <p>
              LaunchRecord provides AI-powered positioning analysis and audit services for SaaS products. 
              The Service includes but is not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>SIO-V5 positioning audits</li>
              <li>AEO (Answer Engine Optimization) visibility analysis</li>
              <li>Competitive positioning insights</li>
              <li>Strategic recommendations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p>
              To access certain features of the Service, you may be required to create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the Service to send spam or unsolicited communications</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by LaunchRecord and are protected 
              by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Disclaimer of Warranties</h2>
            <p>
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, 
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, 
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, LAUNCHRECORD SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
              SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED 
              DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. AI-Powered Analysis Disclaimer</h2>
            <p>
              You acknowledge that the Service uses AI-powered analysis to generate insights and recommendations. 
              While we strive for accuracy, you understand that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-generated insights are estimates and should not be treated as absolute facts</li>
              <li>The Service analyzes publicly available information only</li>
              <li>Results may vary based on changes in AI models and algorithms</li>
              <li>The Service does not guarantee specific business outcomes</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless LaunchRecord and its officers, directors, employees, 
              and agents from any claims, liabilities, damages, losses, and expenses arising out of your use of the 
              Service or violation of these Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to the Service immediately, 
              without prior notice, for conduct that we believe violates these Terms or is harmful to other users, 
              us, or third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes 
              by posting the updated Terms on the Service and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where 
              LaunchRecord operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:{' '}
              <a href="mailto:hello@launchrecord.com" className="text-primary hover:underline">
                hello@launchrecord.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
