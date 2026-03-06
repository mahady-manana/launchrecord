import Link from "next/link";

export default function PrivacyPolicyPage() {
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
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p>
              LaunchRecord (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, and password when you create an account</li>
              <li><strong>Product Information:</strong> Product name, website URL, tagline, and description when you request an audit</li>
              <li><strong>Survey Responses:</strong> Answers to positioning and business questions</li>
              <li><strong>Communications:</strong> Information you provide when contacting us</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
              <li><strong>Device Information:</strong> Browser type, operating system, device identifiers</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs</li>
              <li><strong>Cookies:</strong> See our Cookie Policy for more information</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.3 Public Information We Analyze</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Website Content:</strong> Public-facing pages of products you submit for audit</li>
              <li><strong>AI Visibility:</strong> How products appear in AI chatbot responses</li>
              <li><strong>Public Metrics:</strong> Reviews, ratings, and social proof from public sources</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve the Service</li>
              <li>Generate positioning audits and insights</li>
              <li>Communicate with you about the Service</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new features and services</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Protect the rights and safety of LaunchRecord and others</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. How We Share Your Information</h2>
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            
            <h3 className="text-xl font-semibold mt-4">4.1 With Your Consent</h3>
            <p>
              We may share your information when you have given us explicit consent to do so.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.2 Service Providers</h3>
            <p>
              We may share information with third-party vendors and service providers who perform services on our behalf, 
              such as hosting, analytics, and customer support.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.3 Legal Requirements</h3>
            <p>
              We may disclose information if required by law or in response to valid requests by public authorities.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.4 Business Transfers</h3>
            <p>
              In connection with any merger, sale, or transfer of assets, we may transfer your information as part of 
              the transaction.
            </p>

            <h3 className="text-xl font-semibold mt-4">4.5 Aggregated Data</h3>
            <p>
              We may share aggregated, anonymized data that cannot reasonably be used to identify you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information from unauthorized access, alteration, 
              disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we 
              cannot guarantee absolute security.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your personal information</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us at{' '}
              <a href="mailto:hello@launchrecord.com" className="text-primary hover:underline">
                hello@launchrecord.com
              </a>
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide the Service and fulfill the 
              purposes outlined in this policy, unless a longer retention period is required by law.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Children&apos;s Privacy</h2>
            <p>
              The Service is not intended for children under 18 years of age. We do not knowingly collect personal 
              information from children. If we become aware that we have collected information from a child, we will 
              take steps to delete it.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">9. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant changes by posting 
              the updated policy on the Service and updating the &quot;Last updated&quot; date.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">11. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{' '}
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
