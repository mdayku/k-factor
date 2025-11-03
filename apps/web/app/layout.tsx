export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'ui-sans-serif,system-ui', lineHeight:1.4}}>{children}</body>
    </html>
  );
}
