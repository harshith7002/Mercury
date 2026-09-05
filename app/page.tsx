import Link from 'next/link';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4';

export default function LandingPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] w-full overflow-hidden bg-background flex flex-col justify-center items-center flex-1">
      {/* ── 1. Fullscreen Video Background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={VIDEO_URL}
      />

      {/* ── 2. Cinematic Hero Content ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-[90px] pt-24 pb-32 max-w-7xl mx-auto flex-1 w-full">
        {/* H1 */}
        <h1
          className="animate-fade-rise text-5xl sm:text-7xl md:text-8xl leading-[0.95] max-w-7xl font-normal text-foreground"
          style={{
            fontFamily: "'Instrument Serif', serif",
            letterSpacing: '-2.46px',
          }}
        >
          Where{' '}
          <em className="not-italic text-muted-foreground">AI intent</em>{' '}
          becomes{' '}
          <em className="not-italic text-muted-foreground">commerce.</em>
        </h1>

        {/* Subtext */}
        <p className="animate-fade-rise-delay text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed font-sans">
          Mercury gives AI buyers a machine-readable way to discover products,
          make decisions, and complete trusted transactions — while merchants
          stay in control.
        </p>

        {/* Hero CTAs */}
        <div className="animate-fade-rise-delay-2 flex flex-wrap items-center justify-center gap-5 mt-12">
          <Link
            href="/buyer"
            className="liquid-glass rounded-full px-14 py-5 text-base text-foreground hover:scale-[1.03] transition-transform duration-200 cursor-pointer font-medium inline-flex items-center justify-center text-center"
          >
            Explore AI Buyer
          </Link>
          <Link
            href="/merchant"
            className="liquid-glass rounded-full px-10 py-5 text-base text-muted-foreground hover:text-foreground hover:scale-[1.03] transition-all duration-200 cursor-pointer font-medium inline-flex items-center justify-center text-center"
          >
            Merchant Console
          </Link>
        </div>
      </section>
    </div>
  );
}
