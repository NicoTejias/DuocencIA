import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, Shield, Eye, Database, Lock, UserCheck, Trash2, Mail } from 'lucide-react'

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

export default function PrivacyPage() {
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
                        <Shield className="w-4 h-4" /> Política de Privacidad
                    </div>
                    <h1 className="text-4xl font-black text-white mb-4">Tu privacidad nos importa</h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">
                        En QuestIA tratamos tus datos con respeto y transparencia. Esta política explica qué información recopilamos,
                        cómo la usamos y cómo la protegemos, de acuerdo con la <strong className="text-slate-300">Ley N° 19.628</strong> sobre Protección de la Vida Privada de Chile.
                    </p>
                    <p className="text-slate-600 text-sm mt-4">Última actualización: 4 de abril de 2026</p>
                </div>

                {/* Sections */}
                <div className="bg-surface-light border border-white/5 rounded-3xl p-8 md:p-12 space-y-2">

                    <Section icon={<Eye className="w-5 h-5" />} title="¿Qué información recopilamos?">
                        <p>Recopilamos únicamente la información necesaria para prestarte el servicio:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li><strong className="text-slate-300">Datos de cuenta:</strong> nombre, correo electrónico e imagen de perfil, provistos al autenticarse con Google u otro proveedor.</li>
                            <li><strong className="text-slate-300">Identificación académica:</strong> RUT o número de matrícula, ingresado voluntariamente para vincularte a tus ramos.</li>
                            <li><strong className="text-slate-300">Actividad en la plataforma:</strong> puntajes, rachas, historial de quizzes, recompensas canjeadas y participación en misiones.</li>
                            <li><strong className="text-slate-300">Perfiles de aprendizaje:</strong> resultados de los tests Belbin y Bartle, usados exclusivamente para la formación de grupos de trabajo.</li>
                            <li><strong className="text-slate-300">Datos de asistencia:</strong> ubicación aproximada (solo cuando el docente activa una sesión de asistencia geolocalizada y con tu consentimiento).</li>
                            <li><strong className="text-slate-300">Datos técnicos:</strong> token de notificaciones push, dirección IP y metadatos de sesión para la seguridad de la plataforma.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Database className="w-5 h-5" />} title="¿Cómo usamos tu información?">
                        <p>Usamos tus datos exclusivamente para:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li>Prestar el servicio de gamificación educativa (ranking, desafíos, recompensas).</li>
                            <li>Vincular tu cuenta a los ramos en los que estás inscrito.</li>
                            <li>Enviar notificaciones relacionadas con la actividad de tu curso.</li>
                            <li>Generar estadísticas de rendimiento para el docente de tu ramo.</li>
                            <li>Mejorar la plataforma mediante análisis agregados y anónimos.</li>
                            <li>Cumplir con obligaciones legales aplicables.</li>
                        </ul>
                        <p className="mt-3 text-amber-400/80 text-sm">
                            ⚠️ <strong>No vendemos, arrendamos ni cedemos tus datos personales a terceros</strong> con fines comerciales bajo ninguna circunstancia.
                        </p>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Lock className="w-5 h-5" />} title="¿Cómo protegemos tus datos?">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Autenticación gestionada por <strong className="text-slate-300">Clerk</strong>, con soporte para autenticación de dos factores.</li>
                            <li>Base de datos alojada en <strong className="text-slate-300">Convex</strong>, con cifrado en tránsito (TLS) y en reposo.</li>
                            <li>Control de acceso basado en roles: cada usuario solo accede a los datos que le corresponden.</li>
                            <li>Sin contraseñas almacenadas: usamos proveedores de identidad externos (Google, etc.).</li>
                            <li>Revisiones periódicas de seguridad y actualizaciones de dependencias.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<UserCheck className="w-5 h-5" />} title="Tus derechos (ARCO)">
                        <p>De acuerdo con la Ley 19.628, tienes derecho a:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li><strong className="text-slate-300">Acceso:</strong> solicitar una copia de los datos que tenemos sobre ti.</li>
                            <li><strong className="text-slate-300">Rectificación:</strong> corregir datos inexactos o incompletos.</li>
                            <li><strong className="text-slate-300">Cancelación:</strong> solicitar la eliminación de tu cuenta y datos personales.</li>
                            <li><strong className="text-slate-300">Oposición:</strong> oponerte a determinados tratamientos de tus datos.</li>
                        </ul>
                        <p className="mt-3">Para ejercer tus derechos, escríbenos a <strong className="text-primary-light">privacidad@questia.cl</strong></p>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Trash2 className="w-5 h-5" />} title="Retención y eliminación de datos">
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li>Los datos de cuenta se conservan mientras la cuenta esté activa.</li>
                            <li>Las cuentas de <strong className="text-slate-300">modo prueba</strong> y sus datos asociados se eliminan automáticamente a los <strong className="text-slate-300">30 días</strong> de inactividad.</li>
                            <li>Tras solicitar la eliminación, tus datos se borran en un plazo máximo de <strong className="text-slate-300">30 días hábiles</strong>.</li>
                            <li>Algunos datos pueden conservarse por obligación legal (ej. registros de auditoría) por el período que exija la normativa.</li>
                        </ul>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <Section icon={<Mail className="w-5 h-5" />} title="Cookies y servicios de terceros">
                        <p>Utilizamos los siguientes servicios de terceros, cada uno con su propia política de privacidad:</p>
                        <ul className="list-disc pl-5 space-y-1.5 mt-2">
                            <li><strong className="text-slate-300">Clerk</strong> — autenticación de usuarios.</li>
                            <li><strong className="text-slate-300">Convex</strong> — base de datos y backend en tiempo real.</li>
                            <li><strong className="text-slate-300">Google Analytics / Firebase</strong> — métricas de uso anónimas.</li>
                            <li><strong className="text-slate-300">Resend</strong> — envío de correos transaccionales.</li>
                            <li><strong className="text-slate-300">Google Gemini / OpenAI</strong> — generación de contenido educativo con IA (solo se envían los documentos que el docente sube explícitamente).</li>
                        </ul>
                        <p className="mt-3">Usamos cookies estrictamente necesarias para la autenticación. No usamos cookies de rastreo publicitario.</p>
                    </Section>

                    <div className="border-t border-white/5 pt-8" />

                    <div className="pl-12">
                        <h2 className="text-xl font-bold text-white mb-3">Cambios a esta política</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Podemos actualizar esta política ocasionalmente. Si los cambios son significativos, te notificaremos por correo electrónico o mediante un aviso en la plataforma con al menos 15 días de anticipación.
                        </p>
                    </div>
                </div>

                {/* Contact */}
                <div className="mt-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 text-center">
                    <p className="text-slate-400 text-sm">
                        ¿Preguntas sobre privacidad? Contáctanos en{' '}
                        <a href="mailto:privacidad@questia.cl" className="text-primary-light font-semibold hover:underline">
                            privacidad@questia.cl
                        </a>
                        {' '}· QuestIA SpA · Santiago, Chile
                    </p>
                </div>
            </div>
        </div>
    )
}
