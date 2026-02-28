function Speakers() {
  const speakers = [
    {
      name: "Sarah Chen",
      role: "Event Director",
      company: "TechCorp",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Marcus Johnson",
      role: "VP Events",
      company: "InnovateCo",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "Emily Rodriguez",
      role: "Community Lead",
      company: "FutureLabs",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      name: "David Kim",
      role: "Product Manager",
      company: "GlobalNet",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-white px-6">
      <div className="text-center mb-16">
        <p className="text-purple-600 font-semibold mb-4">SPEAKERS</p>
        <h2 className="text-4xl font-bold">
          Meet our amazing{" "}
          <span className="text-blue-600">speakers</span>
        </h2>
        <p className="text-gray-600 mt-4">
          Industry leaders sharing insights and expertise.
        </p>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {speakers.map((speaker, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 text-center hover:shadow-xl transition"
          >
            <img
              src={speaker.image}
              alt={speaker.name}
              className="w-28 h-28 mx-auto rounded-full object-cover mb-6"
            />

            <h3 className="text-xl font-semibold">{speaker.name}</h3>
            <p className="text-gray-600">{speaker.role}</p>
            <p className="text-blue-600 text-sm">{speaker.company}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Speakers;