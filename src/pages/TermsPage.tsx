import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, FileText, Users, AlertTriangle, Ban, Scale, HelpCircle } from 'lucide-react'

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary-light shrink-0">
                    {icon}
                </div>
                <h2 className="text-xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-slate-400 space-y-3 leading-relaxed pl-12">
                {children}
            </div>
        </div>
    )
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-surface pt-safe pb-safe">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 pt-safe">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </Link>
                    <div className="flex items-center gap-2 ml-auto">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="text-base font-black text-white tracking-tighter italic">Quest<span className="text-primary">IA</span></span>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary-light mb-6">
                        <FileText className="w-4 h-4" /> Términos y Condiciones
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">Términos y Condiciones de Uso</h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                        Al usar QuestIA aceptas estos términos. Por favor léelos con atención. Si no estás de acuerdo,
                        no utilices la plataforma.
                    </p>
                    <p className="text-slate-600 text-sm mt-4">Última actualización: 4 de abril de 2026 · Aplicable en Chile</p>
                </div>

                <div className="bg-surface-light border border-white/5 rounded-3xl p-8 md:p-12 space-y-2">

                    <Section icon={<FileText className="w-5 h-5" />} title="1. Descripción del servicio">
                        <p>
                            QuestIA es una plataforma educativa de gamificación diseñada para instituciones de educación superior
                            en Chile. Permite a docentes crear cursos, desafíos y sistemas de recompensas, y a estudiantes
                            participar en actividades gamificadas vinculadas a sus ramos.
                        </p>
                        <p>
                            El servicio incluye funcionalidades basadas en Inteligencia Artificial para la generación automática
                            de contenido educativo a partir de material provisto por el docente.
                        </p>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Users className="w-5 h-5" />} title="2. Registro y elegibilidad">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Debes tener al menos <strong className="text-slate-300">16 años</strong> para usar QuestIA.</li>
                            <li>El acceso completo requiere un correo institucional válido. Las cuentas de prueba tienen funcionalidades limitadas y datos temporales.</li>
                            <li>Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades realizadas desde ella.</li>
                            <li>No puedes crear cuentas en nombre de otra persona sin su consentimiento expreso.</li>
                            <li>Las instituciones educativas pueden solicitar acceso institucional contactando a <strong className="text-primary-light">contacto@questia.cl</strong></li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<FileText className="w-5 h-5" />} title="3. Contenido y propiedad intelectual">
                        <p><strong className="text-slate-300">Contenido del usuario:</strong></p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-1">
                            <li>Los documentos, textos e imágenes que subas a QuestIA son de tu propiedad. Al subirlos nos otorgas una licencia limitada para procesarlos con el fin de prestar el servicio.</li>
                            <li>Al subir material garantizas que tienes los derechos necesarios para hacerlo y que no infringe derechos de terceros.</li>
                            <li>El contenido generado por IA a partir de tu material pertenece a quien lo generó, sujeto a las condiciones del proveedor de IA correspondiente.</li>
                        </ul>
                        <p className="mt-3"><strong className="text-slate-300">Propiedad de QuestIA:</strong></p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-1">
                            <li>La plataforma, su diseño, código fuente, marca, logotipos y metodología son propiedad exclusiva de QuestIA SpA.</li>
                            <li>Queda prohibida la reproducción, distribución o modificación sin autorización escrita.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Ban className="w-5 h-5" />} title="4. Conducta prohibida">
                        <p>Está estrictamente prohibido:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li>Hacer trampa, manipular puntajes o explotar vulnerabilidades del sistema de puntos.</li>
                            <li>Subir contenido ilegal, violento, discriminatorio, de acoso o que infrinja derechos de terceros.</li>
                            <li>Intentar acceder a cuentas o datos de otros usuarios sin autorización.</li>
                            <li>Usar la plataforma para enviar spam, publicidad no solicitada o contenido malicioso.</li>
                            <li>Realizar ingeniería inversa, descompilar o intentar extraer el código fuente de la plataforma.</li>
                            <li>Automatizar el uso de la plataforma con bots o scripts sin autorización expresa.</li>
                            <li>Compartir credenciales de acceso con terceros.</li>
                        </ul>
                        <p className="mt-3">El incumplimiento puede resultar en la suspensión o eliminación permanente de la cuenta.</p>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<AlertTriangle className="w-5 h-5" />} title="5. Limitación de responsabilidad">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>QuestIA se provee <strong className="text-slate-300">"tal como está"</strong>. No garantizamos disponibilidad ininterrumpida del servicio.</li>
                            <li>El contenido generado por IA es de carácter orientativo y no reemplaza el juicio profesional del docente. QuestIA no se responsabiliza por errores en el contenido generado automáticamente.</li>
                            <li>No somos responsables de pérdidas de datos causadas por eventos fuera de nuestro control razonable.</li>
                            <li>La responsabilidad máxima de QuestIA SpA ante cualquier reclamación se limita al monto pagado por el usuario en los 12 meses anteriores al evento.</li>
                            <li>Los puntajes, rachas y recompensas virtuales dentro de la plataforma no tienen valor monetario.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<FileText className="w-5 h-5" />} title="6. Pagos y suscripciones">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>El acceso básico a QuestIA puede ser gratuito durante el período de lanzamiento.</li>
                            <li>Los planes de pago para instituciones serán informados oportunamente con sus condiciones específicas.</li>
                            <li>En caso de suscripción de pago, el cobro se realiza por anticipado al período contratado.</li>
                            <li>Las cancelaciones deben solicitarse con al menos 30 días de anticipación al siguiente ciclo de facturación.</li>
                            <li>No se realizan reembolsos por períodos parcialmente utilizados, salvo que la ley chilena lo exija.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Scale className="w-5 h-5" />} title="7. Ley aplicable y resolución de disputas">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Estos términos se rigen por las leyes de la <strong className="text-slate-300">República de Chile</strong>.</li>
                            <li>Cualquier disputa se resolverá preferentemente mediante mediación. En caso de no llegarse a acuerdo, las partes se someten a la jurisdicción de los <strong className="text-slate-300">tribunales ordinarios de justicia de Santiago</strong>.</li>
                            <li>Si una disposición de estos términos resulta inválida o inaplicable, las demás permanecerán vigentes.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<HelpCircle className="w-5 h-5" />} title="8. Modificaciones y contacto">
                        <p>
                            Podemos modificar estos términos en cualquier momento. Los cambios significativos serán notificados con al menos
                            <strong className="text-slate-300"> 15 días de anticipación</strong> por correo electrónico o aviso en la plataforma.
                            El uso continuado tras la notificación implica la aceptación de los nuevos términos.
                        </p>
                        <p className="mt-3">
                            Para consultas sobre estos términos, contáctanos en{' '}
                            <strong className="text-primary-light">legal@questia.cl</strong>
                        </p>
                        <p className="mt-1 text-slate-500 text-sm">QuestIA SpA · Santiago, Chile · RUT: (en trámite)</p>
                    </Section>
                </div>

                {/* Links */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                    <Link to="/privacy" className="hover:text-white transition-colors">Política de Privacidad</Link>
                    <span className="hidden sm:block">·</span>
                    <a href="mailto:legal@questia.cl" className="hover:text-white transition-colors">legal@questia.cl</a>
                    <span className="hidden sm:block">·</span>
                    <Link to="/" className="hover:text-white transition-colors">Volver al inicio</Link>
                </div>
            </div>
        </div>
    )
}
