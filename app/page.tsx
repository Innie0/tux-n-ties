import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:min-h-[700px] bg-black text-white">
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Text Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl mb-8 tracking-normal leading-tight" style={{ fontFamily: 'var(--font-dancing), cursive', fontWeight: 600 }}>
                Elegance
                <br />
                <span className="text-primary">Redefined</span>
              </h1>
              <p className="text-lg md:text-xl mb-12 font-normal text-white/90 leading-relaxed">
                Discover our premium collection of tuxedos. Perfect for every
                occasion, from weddings to galas.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <Link
                  href="/inventory"
                  className="bg-primary hover:bg-primary-dark px-10 py-4 font-semibold text-sm tracking-normal transition-colors text-center border-2 border-primary"
                >
                  Browse Collection
                </Link>
                <Link
                  href="/bookings"
                  className="bg-white text-black hover:bg-white/90 px-10 py-4 font-semibold text-sm tracking-normal transition-colors text-center border-2 border-white"
                >
                  Book Fitting
                </Link>
              </div>
            </div>
            
            {/* Right Side - Wedding Photo */}
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] border-2 border-white overflow-hidden">
              <Image
                src="https://blog.jimsformalwear.com/wp-content/uploads/2025/09/pexels-x-l-18908569-6500535-scaled.jpg"
                alt="Elegant wedding couple in tuxedo"
                fill
                className="object-cover"
                priority
                quality={95}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Styles */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-5xl md:text-6xl text-center mb-16 tracking-normal">
            Featured Styles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Classic Black",
                image: "https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/1920x2880%2Fwedding-tuxedo-black-performance-michael-kors-legacy-921-1.jpg?alt=media",
                description: "Timeless elegance for formal occasions",
              },
              {
                name: "Modern Navy",
                image: "https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/640x960%2Fwedding-suit-nay-performance-stretch-michael-kors-311.jpg?alt=media",
                description: "Contemporary style with a sophisticated twist",
              },
              {
                name: "Tan Performance Wedding Suit",
                image: "https://firebasestorage.googleapis.com/v0/b/jfw-omni-dev-image-cache/o/1920x2880%2Fwedding-suit-tan-performance-stretch-michael-kors-272.jpg?alt=media",
                description: "A modern tan suit in performance stretch fabric, perfect for outdoor and daytime weddings.",
              },
            ].map((style, idx) => (
              <div
                key={idx}
                className="group border-2 border-black overflow-hidden hover:border-primary transition-colors"
              >
                <div className="relative h-96 md:h-[500px] bg-black">
                  <Image
                    src={style.image}
                    alt={style.name}
                    fill
                    className="object-contain opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-2xl mb-3 tracking-normal">{style.name}</h3>
                  <p className="text-sm font-normal mb-6 text-black/70 leading-relaxed">{style.description}</p>
                  <Link
                    href="/inventory"
                    className="text-primary font-medium text-sm tracking-normal hover:underline"
                  >
                    View Collection →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-32 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <h2 className="text-5xl md:text-6xl text-center mb-16 tracking-normal">
            Why Choose Tux N Ties?
          </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 tracking-normal">Premium Quality</h3>
              <p className="text-sm font-normal text-white/90 leading-relaxed">
                Hand-selected tuxedos from the finest manufacturers
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 tracking-normal">Expert Fittings</h3>
              <p className="text-sm font-normal text-white/90 leading-relaxed">
                Professional tailors ensure the perfect fit every time
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 border-2 border-primary flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 tracking-normal">Flexible Options</h3>
              <p className="text-sm font-normal text-white/90 leading-relaxed">
                Rent for the occasion or purchase to own
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

