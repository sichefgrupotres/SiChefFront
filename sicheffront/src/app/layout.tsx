import "./globals.css";
import { Provider } from "./providers";
import { RecipeProvider } from "@/context/RecipeContext";
import { AuthBootstrap } from "@/components/AuthBootstrap";

export const metadata = {
  title: "Si Chef!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
        <Provider>
          <RecipeProvider>
            {/* <AuthBootstrap /> */}
            {children}
          </RecipeProvider>
        </Provider>
      </body>
    </html>
  );
}
