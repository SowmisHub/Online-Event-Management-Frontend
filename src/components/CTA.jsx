function CTA() {
  return (
    <section className="py-24 bg-gradient-to-r from-purple-100 to-blue-100">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl p-16 text-center shadow-lg">
        <h2 className="text-4xl font-bold mb-6">
          Ready to create your next{" "}
          <span className="text-blue-600">event?</span>
        </h2>

        <p className="text-gray-600 mb-8">
          Join thousands of organizers who trust EventHub to deliver unforgettable virtual experiences.
        </p>

        <div className="flex justify-center gap-6">
          <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg">
            Get Started Free →
          </button>
          <button className="border px-8 py-3 rounded-lg">
            Browse Events
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTA;