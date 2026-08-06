function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">

      <div className="max-w-6xl mx-auto px-8 py-10">

        <div className="flex flex-col md:flex-row md:justify-between gap-10">

          {/* Left */}

          <div>

            <h2 className="text-2xl font-bold text-slate-900">
              📖 Journally
            </h2>

            <p className="mt-3 text-gray-500 leading-7 max-w-sm">
              Capture your thoughts, reflect on your journey,
              and build better habits every single day.
            </p>

          </div>

          {/* Right */}

          <div>

            <h3 className="font-semibold text-slate-800">
              Built With
            </h3>

            <div className="mt-4 flex flex-wrap gap-3">

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm">
                ⚛️ React
              </span>

              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm">
                🎨 Tailwind CSS
              </span>

              <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm">
                📊 Recharts
              </span>

              <span className="rounded-full bg-green-100 px-4 py-2 text-sm">
                📄 jsPDF
              </span>

            </div>

          </div>

        </div>

        <hr className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">

          <p className="text-gray-500 text-sm">
            © 2026 Journally. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Made with Muhamad Nur Wildan
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;