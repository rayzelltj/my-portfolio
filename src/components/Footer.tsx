export default function Footer() {
    return (
      <footer className="border-t border-white/10 mt-24 py-12 text-sm text-center text-gray-500">
        <div className="max-w-4xl mx-auto px-4">
          <p>
            © {new Date().getFullYear()} Rayzell Tjandra. Built with Next.js & Tailwind CSS.
          </p>
        </div>
      </footer>
    );
  }