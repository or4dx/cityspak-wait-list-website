import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-cs-border bg-cs-surface py-12">
      <div className="container-custom">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-cs-accent p-2">
              <Sparkles className="h-5 w-5 text-cs-bg" />
            </div>
            <span className="font-serif text-xl font-bold text-cs-text">CitySpak</span>
          </div>
          <p className="text-sm text-cs-text-muted">Urban Experience Intelligence</p>
          <div className="border-t border-cs-border pt-6 text-xs text-cs-text-muted">
            <p>cityspak.com · Startup Qatar Investment Program 2026</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
