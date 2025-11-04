import { Providers } from "./providers";
import NavBar from "./components/NavBar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'ui-sans-serif,system-ui', lineHeight:1.4, margin:0, padding:0}}>
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
