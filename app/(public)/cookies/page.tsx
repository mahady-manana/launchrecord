import Link from "next/link";

export default function CookiePolicyPage() {
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
          <h1 className="text-4xl font-bold">Cookie Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-slate max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you 
              visit a website. They help websites remember information about your visit, which can make it easier to 
              use the site and more useful to you.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. How We Use Cookies</h2>
            <p>We use cookies for the following purposes:</p>
            
            <h3 className="text-xl font-semibold mt-4">2.1 Essential Cookies</h3>
            <p>
              These cookies are necessary for the Service to function properly. They enable basic functions like 
              page navigation, secure access to protected areas, and form submission.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Authentication:</strong> Remember your login session</li>
              <li><strong>Security:</strong> Protect against CSRF attacks</li>
              <li><strong>Load Balancing:</strong> Distribute traffic across servers</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.2 Functional Cookies</h3>
            <p>
              These cookies remember choices you make (such as your language preference) to provide enhanced, 
              more personalized features.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Preferences:</strong> Remember your settings</li>
              <li><strong>Personalization:</strong> Provide customized content</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">2.3 Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with the Service by collecting and reporting 
              information anonymously.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Usage Statistics:</strong> Track page views and navigation patterns</li>
              <li><strong>Performance:</strong> Monitor site speed and errors</li>
              <li><strong>Improvement:</strong> Identify areas for enhancement</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Types of Cookies We Use</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-semibold">Cookie Name</th>
                    <th className="text-left py-2 px-3 font-semibold">Type</th>
                    <th className="text-left py-2 px-3 font-semibold">Duration</th>
                    <th className="text-left py-2 px-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono text-sm">next-auth.session-token</td>
                    <td className="py-2 px-3">Essential</td>
                    <td className="py-2 px-3">30 days</td>
                    <td className="py-2 px-3">Authentication session</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono text-sm">next-auth.callback-url</td>
                    <td className="py-2 px-3">Essential</td>
                    <td className="py-2 px-3">Session</td>
                    <td className="py-2 px-3">Post-login redirect</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-3 font-mono text-sm">next-auth.csrf-token</td>
                    <td className="py-2 px-3">Essential</td>
                    <td className="py-2 px-3">30 days</td>
                    <td className="py-2 px-3">CSRF protection</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Third-Party Cookies</h2>
            <p>
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics 
              and deliver advertisements on and through the Service. These may include:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Analytics Services:</strong> To understand how users interact with our Service</li>
              <li><strong>Social Media:</strong> To enable sharing and social interactions</li>
            </ul>
            <p>
              These third parties may collect information about your online activities over time and across different 
              websites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Managing Cookies</h2>
            
            <h3 className="text-xl font-semibold mt-4">5.1 Browser Settings</h3>
            <p>
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>View what cookies are stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block cookies from being set</li>
              <li>Set preferences for individual websites</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">5.2 Browser-Specific Instructions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3 className="text-xl font-semibold mt-4">5.3 Impact of Disabling Cookies</h3>
            <p>
              Please note that if you disable cookies, some features of the Service may not function properly. 
              Essential cookies are required for basic functionality like logging in.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Cookie Updates</h2>
            <p>
              We may update this Cookie Policy from time to time to reflect changes in our practices or for 
              operational, legal, or regulatory reasons. We encourage you to review this policy periodically.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at:{' '}
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
