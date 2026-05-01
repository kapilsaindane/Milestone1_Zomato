export const metadata = {
  title: 'AI Restaurant Recommender',
  description: 'Your personalized restaurant recommendation system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
