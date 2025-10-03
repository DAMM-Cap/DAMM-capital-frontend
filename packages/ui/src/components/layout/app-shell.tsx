import { Footer, Header } from "@/components";
import clsx from "clsx";
import { useIsMobile } from "../hooks/use-is-mobile";
import brandWaterMark from "/19_9-Transparent.png";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  return (
    <div className="flex flex-col ml-2 mr-2 mt-2 min-h-screen bg-background-light dark:bg-textDark text-foreground-light dark:text-foreground">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>

      {/* Main Content */}
      <main
        className={clsx("w-full px-3 py-4 flex-1 mt-24 pb-20 overflow-y-auto", {
          "scrollbar-visible": isMobile,
          "scrollbar-hidden": !isMobile,
        })}
        style={{
          backgroundImage: `url(${brandWaterMark})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundAttachment: "fixed",
          minHeight: "calc(100vh - 96px)",
        }}
      >
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
