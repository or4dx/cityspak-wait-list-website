import { CitySpakMark } from "./CitySpakMark";

export function Header() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-cs-border bg-cs-bg/70 backdrop-blur-md">
      <div className="container-custom py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5" aria-label="CitySpak home">
            <CitySpakMark size={32} />
            <span className="font-serif text-2xl font-bold text-cs-text">CitySpak</span>
          </a>

          <a
            href="#waitlist"
            className="rounded-lg bg-cs-accent px-4 py-2 text-sm font-semibold text-cs-bg transition-all hover:bg-cs-accent-hover"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  );
}
