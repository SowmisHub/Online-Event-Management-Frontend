function Footer() {
  return (
    <footer className="bg-gray-100 py-16 px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4">
            <span className="text-black">Event</span>
            <span className="text-blue-600">Hub</span>
          </h2>
          <p className="text-gray-600">
            The all-in-one platform for creating unforgettable virtual events.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Product</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Events</li>
            <li>Speakers</li>
            <li>Sponsors</li>
            <li>Pricing</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-gray-600">
            <li>About</li>
            <li>Blog</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-gray-600">
            <li>Privacy</li>
            <li>Terms</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;