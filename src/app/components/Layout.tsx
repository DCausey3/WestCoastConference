import { Link, Outlet } from 'react-router';
// import logo from '/src/imports/cropped-wcclologo-2.png';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Navigation Bar */}
      <nav className="bg-[#0A1F44] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center">
            {/* <img src={logo} alt="WCCLO Logo" className="h-16 w-16" /> */}
          </Link>

          <div className="flex gap-8">
            <Link to="/" className="text-white hover:text-[#C9A84C] transition-colors">Home</Link>
            <Link to="/about" className="text-white hover:text-[#C9A84C] transition-colors">About</Link>
            <Link to="/officers" className="text-white hover:text-[#C9A84C] transition-colors">Officers</Link>
            <Link to="/churches" className="text-white hover:text-[#C9A84C] transition-colors">Churches</Link>
            <Link to="/events" className="text-white hover:text-[#C9A84C] transition-colors">Events</Link>
            <Link to="/resources" className="text-white hover:text-[#C9A84C] transition-colors">Resources</Link>
            <Link to="/contact" className="text-white hover:text-[#C9A84C] transition-colors">Contact</Link>
          </div>

          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#C9A84C] transition-colors">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0A1F44] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-[#C9A84C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                About WCCLO
              </h4>
              <p className="text-white/80 text-sm">
                The West Coast Conference Lay Organization serves the AME Church community across Florida.
              </p>
            </div>

            <div>
              <h4 className="text-[#C9A84C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Quick Links
              </h4>
              <div className="flex flex-col gap-2">
                <Link to="/" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Home</Link>
                <Link to="/about" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">About</Link>
                <Link to="/officers" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Officers</Link>
                <Link to="/churches" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Churches</Link>
                <Link to="/events" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Events</Link>
                <Link to="/resources" className="text-white/80 hover:text-[#C9A84C] transition-colors text-sm">Resources</Link>
              </div>
            </div>

            <div>
              <h4 className="text-[#C9A84C] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Contact
              </h4>
              <p className="text-white/80 text-sm">
                West Coast Conference<br />
                Florida AME Church<br />
                info@wcclo.org
              </p>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-[#C9A84C]" style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.125rem' }}>
              As Lay Persons Working With God...
            </p>
            <p className="text-white/60 text-sm mt-2">
              © 2026 West Coast Conference Lay Organization. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
