import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-white py-20">
      <div className="max-w-2xl mx-auto px-6 lg:px-12 text-center">
        <div className="border-2 border-black p-12 md:p-16 bg-white">
          <div className="mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 border-2 border-primary flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-12 h-12 md:w-16 md:h-16 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 tracking-normal">Order Confirmed!</h1>
            <p className="text-sm font-normal mb-12 text-black/70 leading-relaxed">
              Thank you for your order. We&apos;ll send you a confirmation email
              shortly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/inventory"
              className="bg-black hover:bg-primary text-white font-semibold py-4 px-10 tracking-normal text-sm transition-colors border-2 border-black"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="bg-white text-black hover:bg-black hover:text-white font-semibold py-4 px-10 tracking-normal text-sm transition-colors border-2 border-black"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

