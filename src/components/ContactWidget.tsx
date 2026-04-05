import { useState } from 'react';
import { Phone, Mail, MessageSquare, X } from 'lucide-react';

export default function ContactWidget() {
    const [isOpen, setIsOpen] = useState(false);

    const contactOptions = [
        {
            icon: <MessageSquare className="w-5 h-5 text-green-400" />,
            label: 'WhatsApp',
            value: '+56 9 9227 4852',
            href: 'https://wa.me/56992274852',
            color: 'hover:bg-green-500/10'
        },
        {
            icon: <Mail className="w-5 h-5 text-blue-400" />,
            label: 'Email',
            value: 'nicolas.tejias@gmail.com',
            href: 'mailto:nicolas.tejias@gmail.com',
            color: 'hover:bg-blue-500/10'
        }
    ];

    return (
        <div className="fixed bottom-28 right-6 z-[100] flex flex-col items-end gap-3 group">
            {/* Menú de opciones */}
            <div className={`flex flex-col gap-2 transition-all duration-300 origin-bottom ${
                isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-0 opacity-0 translate-y-10 pointer-events-none'
            }`}>
                {contactOptions.map((opt, i) => (
                    <a
                        key={i}
                        href={opt.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-slate-900/90 backdrop-blur-xl border border-white/10 p-3 pr-5 rounded-2xl flex items-center gap-3 transition-all ${opt.color} hover:scale-105 active:scale-95 shadow-xl`}
                    >
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                            {opt.icon}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{opt.label}</span>
                            <span className="text-sm font-bold text-white">{opt.value}</span>
                        </div>
                    </a>
                ))}
            </div>

            {/* Botón Principal (Disparador) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-2xl shadow-primary/20 ${
                    isOpen 
                        ? 'bg-slate-800 rotate-90 scale-90' 
                        : 'bg-primary hover:bg-primary-light animate-phone-bounce'
                }`}
            >
                {isOpen ? (
                    <X className="w-8 h-8 text-white -rotate-90" />
                ) : (
                    <div className="relative">
                        <Phone className="w-8 h-8 text-white fill-white/20" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20 backdrop-blur-sm border border-white/50 items-center justify-center text-[8px] font-black text-white">!</span>
                        </span>
                    </div>
                )}
            </button>
        </div>
    );
}
