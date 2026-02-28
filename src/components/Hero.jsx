import { Typewriter } from "react-simple-typewriter";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-purple-100 via-blue-100 to-white pt-24">  
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(#00000020 1px, transparent 1px), linear-gradient(90deg,#00000020 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center px-6">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 rounded-full bg-white/70 backdrop-blur-md shadow-md">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-gray-700">
            The Future of Virtual Events
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight mb-6 text-gray-900">
          Create{" "}
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent inline-block min-w-[220px] md:min-w-[350px]">
            <Typewriter
              words={["Unforgettable", "Interactive", "Seamless", "Powerful"]}
              loop
              cursor
              cursorStyle="|"
              typeSpeed={80}
              deleteSpeed={50}
              delaySpeed={1500}
            />
          </span>
          <br />
          Virtual Events
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          All-in-one platform for organizing, managing, and delivering
          world-class virtual events with real-time engagement tools.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/events"
            className="px-8 py-4 rounded-xl text-white text-lg bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:opacity-90 transition flex items-center justify-center"
          >
            Explore Events
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            to="/signup"
            className="px-8 py-4 rounded-xl border text-lg bg-white/70 backdrop-blur-md hover:bg-gray-100 transition flex items-center justify-center"
          >
            
            Get Started Free
          </Link>
        </div>

        {/* Trusted Companies */}
        <div className="mt-20">
          <p className="text-sm text-gray-500 mb-6 uppercase tracking-widest">
            Trusted by innovative companies worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-40 text-lg font-semibold text-gray-700">
            <span>TechCorp</span>
            <span>InnovateCo</span>
            <span>FutureLabs</span>
            <span>EventPro</span>
            <span>GlobalNet</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;