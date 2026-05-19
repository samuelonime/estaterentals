// frontend/app/(public)/contact/page.tsx
import { ContactPropertyForm } from '@/components/property/ContactPropertyForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with JerryHomes for all your rental property needs in Abuja.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">
      <div className="bg-slate-900 py-16 pt-20">
        <div className="container-max section-padding text-center">
          <p className="text-orange-400 text-sm font-medium uppercase tracking-widest mb-3">Get In Touch</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 max-w-xl mx-auto">Have questions? Our team is ready to help you find your perfect home.</p>
        </div>
      </div>

      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">How to Reach Us</h2>
            <div className="space-y-4 mb-10">
              {[
                { icon: MapPin, title: 'Office', value: '123 Wuse II, Central Business District, Abuja' },
                { icon: Phone, title: 'Phone', value: '+234 801 234 5678' },
                { icon: Mail, title: 'Email', value: 'info@estatepro.com' },
                { icon: Clock, title: 'Hours', value: 'Mon–Fri 8am–6pm | Sat 9am–4pm' },
              ].map(({ icon: Icon, title, value }) => (
                <div key={title} className="flex items-start gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="w-10 h-10 bg-orange-50 dark:bg-orange-950 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-sm">{title}</p>
                    <p className="font-medium text-slate-900 dark:text-white">{value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden h-56 bg-slate-100 dark:bg-slate-900">
              <iframe
                src="https://maps.google.com/maps?q=Wuse+II,+Abuja,+Nigeria&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                title="Office Location"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-8">Send a Message</h2>
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
              <ContactPropertyForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
