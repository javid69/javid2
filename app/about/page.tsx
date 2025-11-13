import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-semibold">
                ASYLEN VENTURES
              </Link>
              <Link href="/properties" className="text-gray-600 hover:text-gray-900">
                Properties
              </Link>
              <Link href="/about" className="text-gray-900">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/signin"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            About ASYLEN VENTURES
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Your trusted partner in real estate
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600 mb-4">
            ASYLEN VENTURES is a premium real estate platform connecting buyers,
            sellers, and agents in a seamless digital experience.
          </p>
          <p className="text-gray-600">
            This is a public page accessible to all visitors without authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
