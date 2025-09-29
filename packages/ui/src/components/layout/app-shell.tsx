import { Footer, Header } from "@/components";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col ml-16 mr-16 mt-2 min-h-screen bg-background-light dark:bg-textDark text-foreground-light dark:text-foreground">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="w-full px-3 py-4 flex-1 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-surface opacity-10 rounded-2xl -z-10" />
            <div className="space-y-4">{children}</div>
          </div>
        </div>
      </main>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-10">
        <Footer />
      </div>
    </div>
  );
}
