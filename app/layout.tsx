import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Charity Agutu Martha - Data Scientist & ML Practitioner',
  description:
    'Data Scientist and Machine Learning Practitioner specializing in predictive analytics, healthcare data, and business intelligence dashboards.',
  keywords: ['Data Science', 'Machine Learning', 'Python', 'SQL', 'Tableau', 'Business Intelligence', 'Nairobi'],
  authors: [{ name: 'Charity Agutu Martha' }],
  openGraph: {
    title: 'Charity Agutu Martha - Data Scientist & ML Practitioner',
    description: 'Transforming complex datasets into actionable insights through machine learning, predictive analytics, and business intelligence.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Charity Agutu Martha – Data Scientist & ML Practitioner',
    description: 'Transforming complex datasets into actionable insights.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>{children}</body>
    </html>
  )
}
