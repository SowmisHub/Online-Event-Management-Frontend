function Sponsors() {
  const sponsors = [
    {
      name: "TechCorp",
      logo: "https://dummyimage.com/160x80/6366f1/ffffff&text=TechCorp",
    },
    {
      name: "InnovateX",
      logo: "https://dummyimage.com/160x80/8b5cf6/ffffff&text=InnovateX",
    },
    {
      name: "FutureLabs",
      logo: "https://dummyimage.com/160x80/3b82f6/ffffff&text=FutureLabs",
    },
    {
      name: "GlobalNet",
      logo: "https://dummyimage.com/160x80/06b6d4/ffffff&text=GlobalNet",
    },
    {
      name: "EventPro",
      logo: "https://dummyimage.com/160x80/9333ea/ffffff&text=EventPro",
    },
    {
      name: "NextWave",
      logo: "https://dummyimage.com/160x80/2563eb/ffffff&text=NextWave",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-white px-6">
      <div className="text-center mb-16">
        <p className="text-purple-600 font-semibold mb-4">SPONSORS</p>
        <h2 className="text-4xl font-bold">
          Trusted by leading{" "}
          <span className="text-blue-600">brands worldwide</span>
        </h2>
        <p className="text-gray-600 mt-4">
          Our partners help us deliver world-class virtual events.
        </p>
      </div>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="bg-white p-10 rounded-2xl shadow-md flex items-center justify-center hover:shadow-xl transition"
          >
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              className="h-16 object-contain"
            />
          </div>
        ))}
      </div>

      {/* Become Sponsor CTA */}
      <div className="mt-24 text-center">
        <h3 className="text-3xl font-bold mb-6">
          Want to become a{" "}
          <span className="text-blue-600">sponsor?</span>
        </h3>
        <p className="text-gray-600 mb-8">
          Partner with us and connect with thousands of event attendees.
        </p>

        <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg shadow-lg hover:opacity-90">
          Contact Us →
        </button>
      </div>
    </section>
  );
}

export default Sponsors;