import { Providers } from "./providers";
import Header from "./components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'ui-sans-serif,system-ui', lineHeight:1.4, margin:0, padding:0}}>
        <Providers>
          <Header />
          <div style={{paddingTop: "60px"}}>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
