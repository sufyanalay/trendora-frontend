// import DashboardLayout from '../shared/DashboardLayout'
import { adminLinks } from './AdminDashboard'

export default function Disputes() {
  return (
     <>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-secondary">Disputes</h1>
        <p className="text-muted text-sm mt-1">Handle reported issues between creators and brands.</p>
      </div>

      {/* How to resolve */}
      <div className="bg-primary-light rounded-2xl p-6 border border-primary/20 mb-6">
        <h2 className="font-bold text-secondary mb-4">Dispute Resolution Process</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', title: 'Review Both Sides', desc: 'Read the chat history and submitted work carefully.' },
            { step: '2', title: 'Make Decision',     desc: 'Decide to release payment, refund brand, or partial settlement.' },
            { step: '3', title: 'Notify Both',       desc: 'Both parties receive notification of the final decision.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-bold text-secondary">{s.title}</p>
                <p className="text-xs text-muted mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-card p-6">
        <div className="text-center py-16">
          <div className="text-5xl mb-3">⚖️</div>
          <p className="font-medium text-secondary">No disputes yet</p>
          <p className="text-muted text-sm mt-1">Disputes will appear here when users report issues.</p>
        </div>
      </div>
     </>
  )
}