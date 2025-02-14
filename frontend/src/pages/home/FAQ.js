import { Fragment, useState } from "react";
import { motion } from "framer-motion";
import {
  Gift,
  Info,
  Smartphone,
  Box,
  CreditCard,
  Truck,
  Repeat,
} from "lucide-react";
import LayoutOne from "../../layouts/LayoutOne";
const faqData = [
  {
    category: "General Information",
    questions: [
      {
        question: "What is Genuine Electronics?",
        answer:
          "Genuine Electronics is an online platform dedicated to providing high-quality electronic products in the Maldives.",
        icon: <Info className="text-blue-500" size={24} />,
      },
      {
        question: "Where is Genuine Electronics located?",
        answer:
          "Our main operations are based at Orchid Magu, 17100 Thinadhoo, Kaafu, Maldives.",
        icon: <Info className="text-blue-500" size={24} />,
      },
      {
        question: "How can I contact you?",
        answer:
          "You can reach us via phone at +960 7898085 or email us at genuineelectronics8@gmail.com.",
        icon: <Info className="text-blue-500" size={24} />,
      },
    ],
  },
  {
    category: "Product Information",
    questions: [
      {
        question: "What types of products do you offer?",
        answer:
          "We provide a wide range of electronics including smartphones, laptops, home appliances, and smart gadgets.",
        icon: <Smartphone className="text-green-500" size={24} />,
      },
      {
        question: "Are your products genuine and reliable?",
        answer:
          "Yes! We source our products from reputable manufacturers to ensure authenticity and reliability.",
        icon: <Box className="text-green-500" size={24} />,
      },
    ],
  },
  {
    category: "Shopping Experience",
    questions: [
      {
        question: "Is your website user-friendly for browsing and purchasing?",
        answer:
          "Our website offers easy navigation through our product catalog using Stripe for secure payments.",
        icon: <Smartphone className="text-orange-500" size={24} />,
      },
      {
        question: "Do you offer any promotions or discounts?",
        answer:
          "Yes! Keep an eye out for special offers that make shopping with us even more rewarding.",
        icon: <Gift className="text-orange-500" size={24} />,
      },
    ],
  },
  {
    category: "Cart Management",
    questions: [
      {
        question: "How do I manage my shopping cart?",
        answer:
          "You can add items by clicking 'Add to Cart,' view them by clicking the cart icon, update quantities directly in the cart, and remove items as needed.",
        icon: <Box className="text-teal-500" size={24} />,
      },
    ],
  },
  {
    category: "Payment Options",
    questions: [
      {
        question:
          "What payment methods do you accept via Stripe’s integration?",
        answer:
          "Through Stripe’s integration we support over 100 payment methods including major credit cards (Visa/Mastercard), bank transfers (where available), etc.",
        icon: <CreditCard className="text-teal-500" size={24} />,
      },
      {
        question:
          "How secure is my payment information when using card payments?",
        answer:
          "Your card details are securely processed through Stripe's system without being stored on our servers; this ensures maximum security during transactions.",
        icon: <CreditCard className="text-teal-500" size={24} />,
      },
      {
        question: "Can I use wallet money during checkout?",
        answer:
          "Yes! If available, You can apply wallet money towards purchases. The system will deduct it from your total payable amount.",
        icon: <CreditCard className="text-teal-500" size={24} />,
      },
    ],
  },
  {
    category: "Order Placement & Tracking",
    questions: [
      {
        question: "How do I place my order?",
        answer:
          "Clicking 'Place Order' after reviewing details finalizes purchases; an order confirmation message follows successful payment validation.",
        icon: <Repeat className="text-indigo-500" size={24} />,
      },
      {
        question: "Can I track my order status?",
        answer:
          "Yes! Once placed, you can view updates like 'Processing,' 'Dispatched,' or 'Delivered' under the Track Order section.",
        icon: <Repeat className="text-indigo-500" size={24} />,
      },
      {
        question: "Can I reorder past purchases easily?",
        answer:
          "Absolutely! In your Order History section, you can list past orders and click Reorder next to any previous purchase; items will be added back into your cart for quick checkout.",
        icon: <Repeat className="text-indigo-500" size={24} />,
      },
    ],
  },
  {
    category: "Delivery & Returns",
    questions: [
      {
        question: "Do you deliver across all islands within the Maldives?",
        answer:
          "Yes! We strive to deliver electronic goods across all islands within the Maldives.",
        icon: <Truck className="text-purple-500" size={24} />,
      },
      {
        question:
          "Can I return or exchange a product if it doesn’t meet expectations?",
        answer:
          "Please contact customer support within [time frame] days of receiving the item if there’s any issue.",
        icon: <Truck className="text-purple-500" size={24} />,
      },
    ],
  },
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredFaqData = faqData.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery) ||
        faq.answer.toLowerCase().includes(searchQuery)
    ),
  }));

  return (
    <Fragment>
      <LayoutOne>
        <section className="bg-gradient-to-r from-purple-100 via-purple-200 to-purple-300 py-16 px-6 text-center">
          <motion.h2
            className="text-4xl font-semibold text-gray-800 mb-12 tracking-wide"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Frequently Asked Questions
          </motion.h2>

          <input
            type="text"
            placeholder="Search FAQs..."
            className="mb-6 p-2 border rounded-md w-full max-w-md mx-auto"
            value={searchQuery}
            onChange={handleSearch}
          />

          <div className="max-w-5xl mx-auto space-y-12">
            {filteredFaqData.map((category, index) => (
              <div key={index}>
                {category.questions.length > 0 && (
                  <motion.h3
                    className="text-3xl font-semibold text-gray-700 mb-6"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {category.category}
                  </motion.h3>
                )}
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <motion.div
                      key={faqIndex}
                      className="bg-white rounded-lg shadow-lg hover:shadow-xl p-6 transition-all hover:bg-gray-50"
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: faqIndex * 0.2 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        {faq.icon}
                        <h4 className="text-xl font-semibold text-gray-800">
                          {faq.question}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-lg">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </LayoutOne>
    </Fragment>
  );
}
