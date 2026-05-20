import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400" aria-label="Site footer">
      <div className="container-max section-padding py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" aria-label="JerryHomes homepage" className="inline-flex mb-4">
              <Image
                src="/logo.svg"
                alt="JerryHomes"
                width={158}
                height={38}
                className="h-10 w-auto transition-all duration-300"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Abuja&apos;s premier real estate agency. Connecting discerning clients
              with exceptional properties for rent and sale across the city&apos;s finest neighbourhoods.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[
                { Icon: Instagram, label: 'JerryHomes on Instagram' },
                { Icon: Twitter,   label: 'JerryHomes on X / Twitter' },
                { Icon: Facebook,  label: 'JerryHomes on Facebook' },
              ].map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={label}
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all duration-200 text-slate-400"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { href: '/',                                         label: 'Home' },
                { href: '/properties',                               label: 'All Properties' },
                { href: '/properties?listingType=RENT',              label: 'For Rent' },
                { href: '/properties?listingType=SALE',              label: 'For Sale' },
                { href: '/properties?type=APARTMENT',                label: 'Apartments' },
                { href: '/properties?type=DUPLEX',                   label: 'Duplexes' },
                { href: '/contact',                                   label: 'Contact Us' },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-slate-400 hover:text-orange-400 text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <address className="not-italic space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-orange-500 shrink-0" aria-hidden="true" />
                <span>Plot 239 P.O.W. Mafemi Cres, behind Chida Event Centre, Utako, Abuja 900108, Federal Capital Territory</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                <a href="tel:+2349026784812" className="hover:text-orange-400 transition-colors">+234 902 678 4812, +234 706 468 8383</a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" aria-hidden="true" />
                <a href="mailto:jerryhomesandestatedv@gmail.com" className="hover:text-orange-400 transition-colors">jerryhomesandestatedv@gmail.com</a>
              </div>
            </address>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JerryHomes. All rights reserved.</p>
          <p>Developed by Meritlives</p>
        </div>
      </div>
    </footer>
  )
}
