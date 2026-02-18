// Root layout – redirects to locale-specific layout
// next-intl handles locale routing via middleware
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
