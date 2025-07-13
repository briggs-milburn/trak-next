import "./styles/globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers/providers";
import AuthenticatedPage from "./components/AuthenticatedPage";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export const metadata = {
  title: "Modern Next.js 13 App",
  description: "An app with modern design and authentication",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-gray-50 text-gray-800 antialiased`}
      >
        <Providers>
          <AuthenticatedPage>{children}</AuthenticatedPage>
        </Providers>
      </body>
    </html>
  );
}
// This layout wraps the entire application with the Redux Provider
// and sets the global metadata for the application.
// It also imports global styles and sets the HTML language and theme attributes.
// The Providers component is used to provide the Redux store to the application.
// The metadata object defines the title and description for the application.
// The RootLayout component is the main entry point for the Next.js application,
// ensuring that all pages have access to the Redux store and global styles.
// The layout is structured to be compatible with Next.js 13's app directory features.
// The use of ReactNode allows for flexible children components, making it reusable across different pages.
// The layout is designed to be minimal and focused on providing a consistent structure for the application.
// The "data-theme" attribute is set to "dark" to apply a dark theme globally.
// This layout is essential for maintaining a consistent user interface and state management across the application.
// It ensures that all components can access the Redux store and global styles, enhancing the development experience and user experience.
