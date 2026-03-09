const faqItems = [
  {
    question: "Which areas do you cover?",
    answer: "We primarily support Riebeek Kasteel, Riebeek West, and nearby surrounding areas.",
  },
  {
    question: "Do you provide both fibre and wireless?",
    answer: "Yes. We provide fibre where infrastructure is available and wireless options where it is not.",
  },
  {
    question: "How quickly can support respond?",
    answer: "Most requests receive same-day acknowledgement, with urgent outages prioritized.",
  },
  {
    question: "Can you help businesses with networking?",
    answer: "Yes. We handle network design, installation, optimization, and maintenance.",
  },
];

const FaqPage = () => {
  return (
    <main className="bg-black text-white">
      <section className="mx-auto max-w-4xl px-4 pb-14 pt-32 sm:px-6 lg:pt-40">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f36f00]">FAQ</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl">Frequently Asked Questions</h1>
        <p className="mt-5 text-zinc-300">Common questions about our internet services, support, and operations.</p>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <div className="space-y-3">
          {faqItems.map((item) => (
            <details key={item.question} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <summary className="cursor-pointer list-none text-base font-semibold">{item.question}</summary>
              <p className="mt-3 text-sm text-zinc-300">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
};

export default FaqPage;
