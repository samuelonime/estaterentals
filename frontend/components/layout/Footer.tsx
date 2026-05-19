import Link from 'next/link'
import { Building2, Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white">
                Estate<span className="text-orange-500">Pro</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Abuja's premier real estate rental agency. Connecting discerning tenants with exceptional properties across the city's finest neighbourhoods.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200 text-slate-400"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/', label: 'Home' },
                { href: '/properties', label: 'All Properties' },
                { href: '/properties?type=APARTMENT', label: 'Apartments' },
                { href: '/properties?type=DUPLEX', label: 'Duplexes' },
                { href: '/contact', label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" />
                <span>123 Wuse II, Central Business District, Abuja, FCT</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="tel:+2348012345678" className="hover:text-orange-400 transition-colors">+234 801 234 5678</a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a href="mailto:info@estatepro.com" className="hover:text-orange-400 transition-colors">info@estatepro.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EstatePro. All rights reserved.</p>
          <p>Next.js + Express + PostgreSQL + Cloudinary</p>
        </div>
      </div>
    </footer>
  )
}
