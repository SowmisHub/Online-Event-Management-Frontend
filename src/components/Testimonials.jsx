import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Event Director, TechCorp",
    content: "EventHub transformed how we run conferences.",
  },
  {
    name: "Marcus Johnson",
    role: "VP Events, InnovateCo",
    content: "Truly exceptional virtual summit experience.",
  },
  {
    name: "Emily Rodriguez",
    role: "Community Lead, FutureLabs",
    content: "Everything was seamless and professional.",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-28 bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="max-w-5xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            Loved by event{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              organizers
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl bg-white shadow-md"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">"{t.content}"</p>
              <p className="font-semibold">{t.name}</p>
              <p className="text-sm text-gray-500">{t.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;