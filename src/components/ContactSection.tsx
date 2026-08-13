import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Instagram, MessageSquare, Send, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';
import { CLIENT_CREDENTIALS } from '../data/portfolioData';
import { ContactFormData } from '../types';

interface ContactSectionProps {
  preselectedServiceId?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedServiceId }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: preselectedServiceId || '',
    message: '',
  });

  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; msg: string }>({
    type: 'idle',
    msg: '',
  });

  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, service: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generateWhatsAppUrl = () => {
    const text = `Hello Honesty Visuals!%0A%0A*Name:* ${encodeURIComponent(
      formData.name || 'Client'
    )}%0A*Email:* ${encodeURIComponent(formData.email || 'N/A')}%0A*Phone:* ${encodeURIComponent(
      formData.phone || 'N/A'
    )}%0A*Service:* ${encodeURIComponent(
      formData.service || 'General Inquiry'
    )}%0A*Message:* ${encodeURIComponent(formData.message || 'I would like to inquire about production services.')}`;
    return `https://wa.me/255794292948?text=${text}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus({ type: 'loading', msg: 'Sending your inquiry...' });

    try {
      // Attempt Web3Forms submission
      const bodyData = new FormData();
      bodyData.append('access_key', 'f627ab00-87c0-4358-84f6-bd52ed6e56d9');
      bodyData.append('subject', `Inquiry from ${formData.name || 'Honesty Visuals Client'}`);
      bodyData.append('name', formData.name);
      bodyData.append('email', formData.email);
      bodyData.append('phone', formData.phone);
      bodyData.append('service', formData.service);
      bodyData.append('message', formData.message);

      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: bodyData,
      });

      const json = await res.json();
      if (json.success) {
        setFormStatus({
          type: 'success',
          msg: 'Inquiry sent successfully! Honesty Visuals will respond shortly.',
        });
        setFormData({ name: '', email: '', phone: '', service: '', message: '' });
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      // Graceful fallback to opening WhatsApp directly if network issues or key limits occur
      setFormStatus({
        type: 'success',
        msg: 'Inquiry prepared! Opening WhatsApp direct messaging...',
      });
      setTimeout(() => {
        window.open(generateWhatsAppUrl(), '_blank');
      }, 1000);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto border-t border-white/10 relative">
      {/* Title */}
      <div className="text-center space-y-3 mb-12 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
          Let's Build Something Epic
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto font-light leading-relaxed mt-2">
          Have an upcoming project, brand campaign, or visual concept? Reach out today and let's bring it to life.
        </p>
        <div className="h-[1px] w-16 bg-[#EED98A] mx-auto mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Direct Contact Info */}
        <div className="lg:col-span-5 space-y-8 sm:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Direct Channels
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Based in Dar es Salaam, Tanzania, serving commercial clients and creative productions across the East African Community.
            </p>
          </div>

          <div className="space-y-4">
            {/* Phone / Call */}
            <div className="flex items-center justify-between p-4 rounded-sm bg-neutral-900 border border-white/10 shadow-xl hover:border-[#EED98A] transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center text-[#EED98A] border border-white/10">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Call or WhatsApp
                  </p>
                  <a
                    href={`tel:${CLIENT_CREDENTIALS.phone}`}
                    className="text-sm font-semibold text-white hover:text-[#EED98A] font-mono"
                  >
                    {CLIENT_CREDENTIALS.phone}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(CLIENT_CREDENTIALS.phone, 'phone')}
                title="Copy phone number"
                className="p-2 text-neutral-400 hover:text-white transition"
              >
                {copiedField === 'phone' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-4 rounded-sm bg-neutral-900 border border-white/10 shadow-xl hover:border-[#EED98A] transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center text-[#EED98A] border border-white/10">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Email Inquiries
                  </p>
                  <a
                    href={`mailto:${CLIENT_CREDENTIALS.email}`}
                    className="text-sm font-semibold text-white hover:text-[#EED98A] font-mono text-[13px]"
                  >
                    {CLIENT_CREDENTIALS.email}
                  </a>
                </div>
              </div>
              <button
                onClick={() => handleCopy(CLIENT_CREDENTIALS.email, 'email')}
                title="Copy email address"
                className="p-2 text-neutral-400 hover:text-white transition"
              >
                {copiedField === 'email' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center gap-4 p-4 rounded-sm bg-neutral-900 border border-white/10 shadow-xl">
              <div className="w-10 h-10 rounded bg-black/50 flex items-center justify-center text-[#EED98A] border border-white/10">
                <MapPin size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Primary Location
                </p>
                <p className="text-sm font-semibold text-white">
                  {CLIENT_CREDENTIALS.location}
                </p>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Action Banner */}
          <div className="bg-neutral-900 border border-white/10 p-6 rounded-sm shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-[#EED98A] font-display font-bold text-sm">
              <Sparkles size={14} />
              <span>Fastest Response Channel</span>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed font-light">
              Need immediate project dispatch or urgent booking? Chat directly on WhatsApp.
            </p>
            <a
              href={CLIENT_CREDENTIALS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#EED98A] text-[#0D0D0E] border border-[#EED98A] px-5 py-2.5 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-white transition"
            >
              <MessageSquare size={14} /> Open WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7 bg-neutral-900 border border-white/10 rounded-sm p-5 sm:p-8 md:p-10 shadow-xl">
          <form id="contactForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EED98A] transition duration-300"
                  placeholder="e.g. John Doe"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EED98A] transition duration-300"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Phone / WhatsApp Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EED98A] transition duration-300 font-mono"
                  placeholder="+255 794292948"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Interested Service *
                </label>
                <select
                  required
                  name="service"
                  value={formData.service}
                  onChange={handleInputChange}
                  className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EED98A] transition duration-300 cursor-pointer"
                >
                  <option value="" className="bg-[#0D0D0E] text-white">
                    Select a Service
                  </option>
                  <option value="direction" className="bg-[#0D0D0E] text-white">
                    Video Direction
                  </option>
                  <option value="videography" className="bg-[#0D0D0E] text-white">
                    Videography / Cinematography
                  </option>
                  <option value="drone" className="bg-[#0D0D0E] text-white">
                    Drone Aerial Videography
                  </option>
                  <option value="photography" className="bg-[#0D0D0E] text-white">
                    Studio & Editorial Photography
                  </option>
                  <option value="graphics" className="bg-[#0D0D0E] text-white">
                    Graphics Design & Branding
                  </option>
                  <option value="social-media" className="bg-[#0D0D0E] text-white">
                    Social Media Management
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Project Details & Vision *
              </label>
              <textarea
                required
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full bg-black/50 border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#EED98A] transition duration-300 resize-none"
                placeholder="Describe your creative scope, location, timeline, and goals..."
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={formStatus.type === 'loading'}
                className="w-full sm:w-auto bg-[#EED98A] text-[#0D0D0E] border border-[#EED98A] font-bold text-[11px] uppercase tracking-[0.2em] px-8 py-4 rounded-sm hover:bg-white transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{formStatus.type === 'loading' ? 'Sending...' : 'Send Message'}</span>
                <Send size={14} />
              </button>

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto border border-white/10 text-white bg-black/50 font-bold text-[11px] uppercase tracking-[0.2em] px-6 py-4 rounded-sm hover:border-[#EED98A] hover:bg-black transition-colors duration-300 flex items-center justify-center gap-2 text-center"
              >
                <span>Send via WhatsApp</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {formStatus.msg && (
              <p
                className={`text-xs p-3 rounded border font-mono ${
                  formStatus.type === 'success'
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-300'
                }`}
              >
                {formStatus.msg}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};
