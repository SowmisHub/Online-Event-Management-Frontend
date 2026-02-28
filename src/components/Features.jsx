import { motion } from "framer-motion";
import {
  CalendarDays,
  Users,
  BarChart3,
  MessageSquare,
  Video,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const features = [
  { icon: CalendarDays, title: "Smart Scheduling", description: "Drag-and-drop schedule builder with automatic conflict detection." },
  { icon: Users, title: "Attendee Management", description: "Comprehensive attendee tracking and ticketing." },
  { icon: MessageSquare, title: "Live Engagement", description: "Real-time polls, Q&A, chat rooms." },
  { icon: BarChart3, title: "Rich Analytics", description: "Detailed reports and insights." },
  { icon: Video, title: "Session Recordings", description: "On-demand video library." },
  { icon: Zap, title: "Breakout Rooms", description: "Focused discussion groups." },
  { icon: Shield, title: "Role-Based Access", description: "Separate dashboards." },
  { icon: Globe, title: "Virtual Networking", description: "AI-powered matchmaking." },
];

function FeaturesSection() {
  return (
    <section className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <span className="text-sm font-semibold text-purple-600 uppercase tracking-widest">
            Features
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4">
            Everything you need to host{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              amazing events
            </span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="p-6 rounded-2xl bg-white shadow-md hover:shadow-xl transition"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;