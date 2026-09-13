import { CitySpakMark } from "./CitySpakMark";

export function Footer() {
  return (
    <footer className="border-t border-cs-border bg-cs-surface py-12">
      <div className="container-custom">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2.5">
            <CitySpakMark size={28} />
            <span className="font-serif text-xl font-bold text-cs-text">CitySpak</span>
          </div>
          <p className="text-sm text-cs-text-muted">Urban Experience Intelligence</p>
          <div className="border-t border-cs-border pt-6 text-xs text-cs-text-muted">
            <p>cityspak.live</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
