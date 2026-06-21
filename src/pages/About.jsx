import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const team = [
  { name: 'Ahmed Raza', role: 'CEO & Founder', initial: 'A' },
  { name: 'Sara Malik', role: 'Head of Product', initial: 'S' },
  { name: 'Bilal Khan', role: 'Lead Developer', initial: 'B' },
  { name: 'Zara Ahmed', role: 'Marketing Lead', initial: 'Z' },
]
//done updated
const values = [
  { icon: '🤝', title: 'Trust', desc: 'We build verified connections between creators and brands.' },
  { icon: '⚡', title: 'Speed', desc: 'From opportunity to collaboration in minutes.' },
  { icon: '💰', title: 'Fairness', desc: 'Transparent payments with no hidden fees.' },
  { icon: '🚀', title: 'Growth', desc: 'We grow when our creators and brands grow.' },
]
//
export default function About() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-14 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-primary-light text-primary text-xs font-semibold rounded-full mb-4 uppercase tracking-wide">
            Our Story
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-secondary mb-4">
            About Trendora
          </h1>
          <p className="text-muted text-base md:text-lg max-w-2xl mx-auto">
            Trendora was built to solve a real problem — creators in Pakistan struggle to find
            brand deals, and brands struggle to find the right creators. We fix that.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">Our Mission</h2>
          <p className="text-muted text-base md:text-lg leading-relaxed">
            To empower Pakistani content creators by connecting them with brands that value
            their work — through a safe, transparent, and efficient platform that handles
            everything from negotiation to payment.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-primary-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-card rounded-2xl p-6 text-center shadow-card border border-border hover:border-primary transition-all">
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-secondary mb-2">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary text-center mb-10">
            Meet the Team
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                  {t.initial}
                </div>
                <h3 className="font-bold text-secondary text-sm">{t.name}</h3>
                <p className="text-xs text-muted mt-1">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-section">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Join the Trendora Family
          </h2>
          <p className="text-purple-200 mb-8">
            Be part of Pakistan's fastest growing creator economy platform.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3.5 bg-white text-primary font-bold rounded-xl hover:bg-purple-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}