export function Footer() {
  return (
    <footer className="bg-hero-deep text-white/70 text-xs">
      <div className="mx-auto max-w-5xl px-4 py-10 text-center space-y-4">
        <p className="max-w-3xl mx-auto">
          This site is not a part of the Facebook™ website or Facebook™ Inc.
          Additionally, this site is NOT endorsed by Facebook™ in any way.
          Facebook™ is a trademark of Facebook™, Inc.
        </p>
        <p>
          <a href="#" className="underline mx-2">Privacy Policy</a>|
          <a href="#" className="underline mx-2">Terms &amp; Conditions</a>|
          <a href="#" className="underline mx-2">Disclaimer</a>
        </p>
        <p className="text-white/50">© {new Date().getFullYear()} Business Growth Masterclass — Farhan Ali. All rights reserved.</p>
      </div>
    </footer>
  );
}
