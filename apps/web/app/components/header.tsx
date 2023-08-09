import { cn } from "ui/lib/utils";
import { Button, buttonVariants } from "ui/components/ui/button";
import { PanelRight } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="pl-8 pr-8 flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <nav className="flex items-center space-x-4 text-sm font-medium">
            <a href="/" className="font-bold">
              Youtube Minner
            </a>
            <Link href="/" className={buttonVariants({ variant: "ghost" })}>
              Comments
            </Link>
            <Link
              href="/transcribe"
              className={buttonVariants({ variant: "ghost" })}
            >
              Transcribe
            </Link>
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            <a
              href="https://github.com/ahmadrosid/youtube-minner"
              target="_blank"
              className={cn(
                buttonVariants({ variant: "link" }),
                "gap-2 w-full justify-start"
              )}
            >
              <span>Github</span>
            </a>

            <Button size="sm" variant="ghost">
              <PanelRight className="w-4 h-4" />
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
