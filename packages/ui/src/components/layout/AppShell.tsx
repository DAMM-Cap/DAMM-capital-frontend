import Footer from "./Footer";
import Header from "./Header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background-light dark:bg-textDark text-foreground-light dark:text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-surface opacity-10 rounded-2xl sm:rounded-3xl -z-10" />
            <div className="space-y-4 sm:space-y-6">{children}</div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <Footer />
    </div>
  );
}
