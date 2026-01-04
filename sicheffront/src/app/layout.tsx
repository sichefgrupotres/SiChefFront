import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
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
    <html lang="es" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased">
        <Provider>
        <AuthProvider>
        <RecipeProvider>
          <AuthBootstrap/>
          {children}
        </RecipeProvider>
        </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}

