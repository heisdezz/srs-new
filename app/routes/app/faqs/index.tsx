import PageContainer from "@/components/layouts/PageContainer";
import PageFooter from "@/components/PageFooter";
import PageHeader from "@/components/PageHeader";

export default function Faqs() {
  const faqs = [
    {
      question: "How is my price determined?",
      answer:
        "Your price is determined by various factors including the quantity, number of colors, and type of garment.",
    },
    {
      question: "Can I get my order sooner?",
      answer:
        "Expedited shipping options are available for an additional fee. Please contact us for more details.",
    },
    {
      question: "What file-format should I submit?",
      answer:
        "We prefer vector files such as AI, EPS, or PDF. High-resolution JPG or PNG files may also be acceptable.",
    },
    {
      question: "Do orders have a per size minimum?",
      answer:
        "No, there is no per size minimum, as long as the total order meets the minimum quantity.",
    },
    {
      question: "What is your minimum order quantity?",
      answer:
        "Our minimum order quantity is 12 pieces for most custom apparel orders.",
    },
    {
      question: "How long is turnaround time?",
      answer:
        "Standard turnaround time is typically 7-10 business days after artwork approval.",
    },
    {
      question: "How much do I have to pay to get started?",
      answer:
        "A deposit of 50% of the total order is required to start production.",
    },
    {
      question: "What is the 3% under allowance policy?",
      answer:
        "Due to the nature of custom printing, a 3% under allowance policy means we may deliver up to 3% fewer items than ordered, which is considered an acceptable fulfillment.",
    },
    {
      question: "If I don't like my shirts, can I return them?",
      answer:
        "Custom orders are generally non-returnable unless there is a defect in manufacturing or printing. Please contact us immediately if you have concerns.",
    },
  ];

  return (
    <>
      <div className="h-52 bg-base-300 w-full">
        <div className="container mx-auto px-4 h-full flex flex-col justify-center gap-2">
          <h2 className="text-2xl md:text-4xl font-bold">
            Frequently Asked Questions
          </h2>
          <p>Here are some frequently asked questions</p>
        </div>
      </div>
      <PageContainer>
        <div className="py-12 space-y-8">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="collapse collapse-arrow bg-base-200 ring fade shadow"
            >
              <input
                type="radio"
                name="my-accordion-2"
                defaultChecked={index === 0}
              />
              <div className="collapse-title md:text-xl font-medium">
                {faq.question}
              </div>
              <div className="collapse-content text-sm md:text-base">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
      <PageFooter />
    </>
  );
}
