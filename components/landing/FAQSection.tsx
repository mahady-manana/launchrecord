interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "What problem does LaunchRecord solve?",
    answer:
      "Most startups struggle to clearly explain what they do, which makes them hard to understand, hard to trust, and easy to ignore. LaunchRecord identifies where your messaging, positioning, and first impression are unclear, then shows you exactly what to improve so more visitors convert into users.",
  },
  {
    question: "What is LaunchRecord?",
    answer:
      "LaunchRecord is a product that analyzes your website to help you improve clarity, positioning, and conversion. It shows how well your message is understood by users and AI systems, and highlights what is preventing you from converting more visitors.",
  },
  {
    question: "How does the audit work?",
    answer:
      "You submit your website URL, and LaunchRecord analyzes your homepage and messaging structure. It evaluates clarity, positioning, and visibility factors, then returns a report with key issues and practical improvements you can apply immediately.",
  },
  {
    question: "What does the audit evaluate?",
    answer:
      "It evaluates how clearly your product is positioned, how easy it is to understand within seconds, how consistent your messaging is, and how visible your product is in modern AI-driven discovery systems.",
  },
  {
    question: "Who should use LaunchRecord?",
    answer:
      "It is built for founders, SaaS teams, and product builders who want to improve their messaging, increase conversions, and make their product easier to understand and choose.",
  },
  {
    question: "What outcomes can I expect?",
    answer:
      "You get a clearer understanding of why users don’t convert, specific issues affecting your messaging, and practical recommendations to improve clarity, positioning, and overall conversion performance.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. The free plan includes a full website analysis with key clarity and positioning insights. Paid plans unlock deeper analysis, ongoing tracking, and more detailed recommendations.",
  },
  {
    question: "What do I do after getting the results?",
    answer:
      "You review the identified issues and apply the suggested improvements to your website. You can then re-run the analysis to measure improvement over time.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 md:px-0 px-4 bg-white">
      <div className="max-w-6xl mx-auto space-y-12 ">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about LaunchRecord, SIO-V5, and the SIDL
            framework.
          </p>
        </div>

        <div className="grid gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <h3 className="text-lg font-semibold text-slate-900 pr-4">
                    {faq.question}
                  </h3>
                  <svg
                    className="w-5 h-5 text-slate-500 transform group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
