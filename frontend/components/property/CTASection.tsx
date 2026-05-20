import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-orange-600 to-orange-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-700/30 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative container-max section-padding text-center">
        <p className="text-orange-200 text-sm font-medium uppercase tracking-widest mb-4">Ready to Move In?</p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6 max-w-2xl mx-auto leading-tight">
          Find Your Dream Home Today
        </h2>
        <p className="text-orange-100 text-lg max-w-xl mx-auto mb-10">
          Browse curated properties for <strong>rent or sale</strong> across Abuja&apos;s finest neighbourhoods. Your perfect home is just a click away.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/properties?listingType=RENT"
            className="px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-all shadow-xl hover:-translate-y-0.5"
          >Browse Rentals</Link>
          <Link href="/properties?listingType=SALE"
            className="px-8 py-4 bg-orange-900/60 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
          >Browse For Sale</Link>
          <Link href="/contact"
            className="px-8 py-4 border-2 border-white/40 text-white font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-sm"
          >Contact an Agent</Link>
        </div>
      </div>
    </section>
  )
}
