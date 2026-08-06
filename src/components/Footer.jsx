function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10 text-center">

        <h3 className="text-xl font-bold text-slate-800">
          📖 Journally
        </h3>

        <p className="mt-2 text-gray-500">
          Write • Reflect • Grow
        </p>

        <p className="mt-6 text-sm text-gray-400">
          Made with using React, Vite & Tailwind CSS
        </p>

        <p className="mt-2 text-sm text-gray-400">
          © {new Date().getFullYear()} Journally. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;