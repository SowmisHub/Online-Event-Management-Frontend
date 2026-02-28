import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for small events and beginners.",
      features: [
        "Up to 100 attendees",
        "Basic analytics",
        "Email support",
        "Event scheduling",
      ],
      highlighted: true, // ✅ Highlight Starter
    },
    {
      name: "Pro",
      price: "$29/mo",
      description: "Best for growing businesses and teams.",
      features: [
        "Up to 1,000 attendees",
        "Advanced analytics",
        "Breakout rooms",
        "Priority support",
      ],
      highlighted: false, // ✅ Removed highlight
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale global events.",
      features: [
        "Unlimited attendees",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 premium support",
      ],
      highlighted: false,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-white px-6">
      <div className="text-center mb-16">
        <p className="text-purple-600 font-semibold mb-4">PRICING</p>
        <h2 className="text-4xl font-bold">
          Flexible plans for every{" "}
          <span className="text-blue-600">event size</span>
        </h2>
        <p className="text-gray-600 mt-4">
          Choose the perfect plan that fits your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`rounded-2xl p-10 shadow-md bg-white transition hover:shadow-xl ${
              plan.highlighted
                ? "border-2 border-purple-500 scale-105"
                : "border"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>

            <p className="text-4xl font-bold text-blue-600 mb-4">
              {plan.price}
            </p>

            <p className="text-gray-600 mb-6">{plan.description}</p>

            <ul className="space-y-3 mb-8 text-gray-600">
              {plan.features.map((feature, i) => (
                <li key={i}>✓ {feature}</li>
              ))}
            </ul>

            {plan.name === "Starter" ? (
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Started
              </button>
            ) : (
              <button
                disabled
                className="w-full py-3 rounded-lg font-medium bg-gray-100 text-gray-500 flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <Lock size={16} />
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default Pricing;