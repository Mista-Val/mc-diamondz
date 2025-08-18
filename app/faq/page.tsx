const faqs = [
  {
    id: 1,
    question: "What's your return policy?",
    answer:
      "We accept returns up to 30 days after delivery, if the item is unused and in its original condition, and we will refund the full order amount minus the shipping costs for the return.",
  },
  {
    id: 2,
    question: 'Do you ship worldwide?',
    answer: 'Yes, we ship to most countries worldwide.',
  },
  {
    id: 3,
    question: 'How do I track my order?',
    answer:
      'Once your order has shipped, you will receive an email with a tracking number to track your package.',
  },
]

export default function FaqPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">FAQs</h2>
          <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Can’t find the answer you’re looking for? Reach out to our customer support team.
          </p>
        </div>

        <div className="mt-12">
          <dl className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-12 md:space-y-0">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <dt className="text-lg font-medium leading-6 text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
