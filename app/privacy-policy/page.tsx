export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-4xl font-bold mb-8 text-black">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none text-black/80 space-y-6">
          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
            <p>
              EduPanel ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold text-black mb-2">Personal Information</h3>
            <p>
              We collect information you voluntarily provide, such as:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Name and email address</li>
              <li>Account credentials and profile information</li>
              <li>Student and classroom data (for educators)</li>
              <li>Communication preferences</li>
            </ul>

            <h3 className="text-xl font-semibold text-black mb-2 mt-4">Automatically Collected Information</h3>
            <p>
              When you access our platform, we automatically collect:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Device information (browser type, IP address)</li>
              <li>Usage data and analytics</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
            <p>
              We use collected information to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide and maintain our services</li>
              <li>Process transactions and send related information</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Improve and personalize your experience</li>
              <li>Detect and prevent fraudulent activities</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Cookies</h2>
            <p>
              We use cookies to enhance your experience on our platform. You can control cookie settings through your browser preferences. However, disabling cookies may limit functionality.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Third-Party Services</h2>
            <p>
              We may share information with third-party service providers who assist us in operating our website and conducting our business, subject to confidentiality agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@edupanel.com
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-black mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy periodically. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
            </p>
            <p className="mt-4 text-sm text-black/60">
              <strong>Last Updated:</strong> May 14, 2026
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-200 text-center">
          <a 
            href="/" 
            className="text-amber-600 hover:text-amber-700 font-medium transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
