import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      scriptProps={{ type: "application/json" }}
      storageKey="defense-platform-theme"
    >
      {children}
    </NextThemesProvider>
  );
}
