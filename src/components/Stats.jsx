function Stats() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-100 to-blue-100 text-center">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-4xl font-bold text-blue-600">2,500+</h3>
          <p>Events Hosted</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-blue-600">150K+</h3>
          <p>Attendees Served</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-blue-600">80+</h3>
          <p>Countries</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-blue-600">99%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>
    </section>
  );
}

export default Stats;