import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Brain, ChevronRight, ChevronLeft, CheckCircle, Rocket, Loader2 } from 'lucide-react'

const PREGUNTAS_BELBIN = [
    // CEREBRO (Plant) - 7 preguntas
    {
        pregunta: "Cuando necesito resolver un problema complejo, mi enfoque es...",
        opciones: [
            { texto: "Generar ideas creativas e innovadoras sin limitaciones.", rol: "Cerebro" },
            { texto: "Evaluar objetivamente todas las opciones disponibles.", rol: "Monitor" },
            { texto: "Buscar información y recursos fuera del equipo.", rol: "Investigador" },
            { texto: "Organizar al equipo y delegar tareas.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "En una lluvia de ideas, yo suelo...",
        opciones: [
            { texto: "Proponer soluciones poco convencionales.", rol: "Cerebro" },
            { texto: "Impulsar al equipo a tomar acción rápidamente.", rol: "Impulsor" },
            { texto: "Asegurarme de que el equipo trabaje en harmony.", rol: "Cohesionador" },
            { texto: "Desarrollar las ideas en planes concretos.", rol: "Implementador" },
        ]
    },
    {
        pregunta: "Cuando enfrento un desafío nuevo, prefiero...",
        opciones: [
            { texto: "Explorar soluciones nunca antes intentadas.", rol: "Cerebro" },
            { texto: "Investigar qué han hecho otros en situaciones similares.", rol: "Especialista" },
            { texto: "Seguir un enfoque metódico y estructurado.", rol: "Implementador" },
            { texto: "Analizar todos los riesgos antes de actuar.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Mis compañeros me describen como alguien que...",
        opciones: [
            { texto: "Aporta ideas frescas y originales.", rol: "Cerebro" },
            { texto: "Tiene un conocimiento profundo de temas específicos.", rol: "Especialista" },
            { texto: "Siempre busca formas de mejorar los procesos.", rol: "Finalizador" },
            { texto: "Mantiene al equipo enfocado en los objetivos.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Cuando el equipo está estancado, yo...",
        opciones: [
            { texto: "Presento una idea completamente nueva que cambie la perspectiva.", rol: "Cerebro" },
            { texto: "Renuevo la energía del grupo con mi entusiasmo.", rol: "Investigador" },
            { texto: "Organizo una reunión para redistribuir responsabilidades.", rol: "Coordinador" },
            { texto: "Meto presión para que el equipo avance.", rol: "Impulsor" },
        ]
    },
    {
        pregunta: "Lo que más me diferencia en un equipo es mi...",
        opciones: [
            { texto: "Capacidad para pensar creativamente.", rol: "Cerebro" },
            { texto: "Habilidad para encontrar fallos en los planes.", rol: "Monitor" },
            { texto: "Conocimiento técnico especializado.", rol: "Especialista" },
            { texto: "Dedicación para completar las tareas a tiempo.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Si pudiera mejorar algo de mi trabajo en equipo sería...",
        opciones: [
            { texto: "Ser menos impulsivo con mis ideas revolucionarias.", rol: "Cerebro" },
            { texto: "Delegar más y no intentar hacerlo todo yo mismo.", rol: "Cerebro" },
            { texto: "Escuchar más las ideas de los demás.", rol: "Cerebro" },
            { texto: "Ser más paciente con los procesos lentos.", rol: "Cerebro" },
        ]
    },

    // MONITOR (Monitor Evaluator) - 7 preguntas
    {
        pregunta: "Ante una decisión importante, yo...",
        opciones: [
            { texto: "Analizo todos los datos disponibles antes de decidir.", rol: "Monitor" },
            { texto: "Confío en mi instinto y actúo rápidamente.", rol: "Impulsor" },
            { texto: "Busco el consenso del equipo.", rol: "Cohesionador" },
            { texto: "Aplico mi experiencia previa en temas similares.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "Cuando reviso el trabajo de otros, suelo...",
        opciones: [
            { texto: "Identificar inconsistencias lógicas y errores.", rol: "Monitor" },
            { texto: "Destacar los puntos fuertes del trabajo.", rol: "Cohesionador" },
            { texto: "Sugerir mejoras prácticas basadas en mi experiencia.", rol: "Implementador" },
            { texto: "Preguntar por qué se hizo de esa manera.", rol: "Investigador" },
        ]
    },
    {
        pregunta: "Mi mayor fortaleza en análisis es...",
        opciones: [
            { texto: "Ver el panorama completo y las implicaciones a largo plazo.", rol: "Monitor" },
            { texto: "Detectar detalles que otros pasan por alto.", rol: "Finalizador" },
            { texto: "Conectar conceptos de diferentes áreas.", rol: "Cerebro" },
            { texto: "Encontrar recursos y contactos útiles.", rol: "Investigador" },
        ]
    },
    {
        pregunta: "Cuando me presentan una propuesta nueva, mi reacción es...",
        opciones: [
            { texto: "Buscar posibles problemas y limitaciones.", rol: "Monitor" },
            { texto: "Entusiasmarme y ver cómo implementarla.", rol: "Impulsor" },
            { texto: "Preguntar cómo beneficia al equipo.", rol: "Cohesionador" },
            { texto: "Ver cómo se compara con las mejores prácticas.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "En debates grupales, yo suelo...",
        opciones: [
            { texto: "Presentar análisis objetivos y equilibrados.", rol: "Monitor" },
            { texto: "Defender mi posición con pasión.", rol: "Impulsor" },
            { texto: "Buscar puntos en común entre las partes.", rol: "Cohesionador" },
            { texto: "Aportar datos técnicos relevantes.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "Lo que más valoro en una propuesta es...",
        opciones: [
            { texto: "La solidez de su razonamiento.", rol: "Monitor" },
            { texto: "Su viabilidad práctica.", rol: "Implementador" },
            { texto: "Su innovación y originalidad.", rol: "Cerebro" },
            { texto: "El apoyo emocional que genera.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Mi approach ante nuevos proyectos es...",
        opciones: [
            { texto: "Evaluar cuidadosamente antes de comprometer recursos.", rol: "Monitor" },
            { texto: "Lanzarme con entusiasmo y ajustar el rumbo.", rol: "Impulsor" },
            { texto: "Consultar con expertos en el tema.", rol: "Especialista" },
            { texto: "Primero construir equipo y confianza.", rol: "Cohesionador" },
        ]
    },

    // ESPECIALISTA (Specialist) - 7 preguntas
    {
        pregunta: "Cuando necesito aprender algo nuevo, prefiero...",
        opciones: [
            { texto: "Estudiar a fondo los manuales y documentación.", rol: "Especialista" },
            { texto: "Experimentar directamente con el tema.", rol: "Impulsor" },
            { texto: "Preguntar a personas con experiencia.", rol: "Investigador" },
            { texto: "Analizar casos de estudio.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "En mi área de conocimiento, me considero...",
        opciones: [
            { texto: "La persona a consultar cuando hay dudas técnicas.", rol: "Especialista" },
            { texto: "Un aprendiz constante que siempre quiere más.", rol: "Investigador" },
            { texto: "Alguien que busca la perfección técnica.", rol: "Finalizador" },
            { texto: "Un pensador que ve conexiones amplias.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Cuando enfrento un problema técnico, yo...",
        opciones: [
            { texto: "Aplico mi conocimiento especializado directamente.", rol: "Especialista" },
            { texto: "Busco soluciones creativas fuera de lo convencional.", rol: "Cerebro" },
            { texto: "Descompongo el problema en partes manejables.", rol: "Implementador" },
            { texto: "Consulto con colegas expertos.", rol: "Investigador" },
        ]
    },
    {
        pregunta: "Lo que más disfruto en mi trabajo es...",
        opciones: [
            { texto: "Profundizar en temas que me apasionan.", rol: "Especialista" },
            { texto: "Resolver problemas complejos con soluciones elegantes.", rol: "Cerebro" },
            { texto: "Ver el progreso tangible del proyecto.", rol: "Implementador" },
            { texto: "Compartir conocimientos con otros.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Cuando enseño algo a otros, suelo...",
        opciones: [
            { texto: "Explicar con detalle técnico y ejemplos.", rol: "Especialista" },
            { texto: "Motivar y despertar el interés por el tema.", rol: "Investigador" },
            { texto: "Dar instrucciones claras y paso a paso.", rol: "Implementador" },
            { texto: "Adaptar la explicación al nivel del otro.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Mi contribución más valiosa al equipo es...",
        opciones: [
            { texto: "Mi conocimiento técnico profundo.", rol: "Especialista" },
            { texto: "Mi capacidad para motivar al equipo.", rol: "Investigador" },
            { texto: "Mi atención al detalle y calidad.", rol: "Finalizador" },
            { texto: "Mi visión estratégica.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Cuando el equipo necesita resolver algo técnico, yo...",
        opciones: [
            { texto: "Aporto mi experiencia y conocimiento especializado.", rol: "Especialista" },
            { texto: "Investigo nuevas tecnologías o métodos.", rol: "Investigador" },
            { texto: "Propongo soluciones prácticas inmediatas.", rol: "Implementador" },
            { texto: "Evalúo cuál es la mejor solución técnica.", rol: "Monitor" },
        ]
    },

    // IMPULSOR (Shaper) - 7 preguntas
    {
        pregunta: "Cuando el equipo pierde momentum, yo...",
        opciones: [
            { texto: "Doy un impulso decisive para avanzar.", rol: "Impulsor" },
            { texto: "Propongo una nueva dirección más prometedora.", rol: "Cerebro" },
            { texto: "Organizo una reunión para re-energizar al grupo.", rol: "Coordinador" },
            { texto: "Recuerdo las metas y lo que está en juego.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Mi estilo de liderazgo se caracteriza por...",
        opciones: [
            { texto: "Impulsar la acción y desafiar al equipo.", rol: "Impulsor" },
            { texto: "Delegar y coordinar recursos.", rol: "Coordinador" },
            { texto: "Guiar con el ejemplo y la dedicación.", rol: "Implementador" },
            { texto: "Inspirar con visión e innovación.", rol: "Cerebro" },
        ]
    },
    {
        pregunta: "Cuando las cosas no funcionan, yo...",
        opciones: [
            { texto: "Cambio el enfoque inmediatamente y sigo adelante.", rol: "Impulsor" },
            { texto: "Analizo qué salió mal antes de continuar.", rol: "Monitor" },
            { texto: "Busco ayuda externa para encontrar solución.", rol: "Investigador" },
            { texto: "Ajusto los detalles para mejorar.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Lo que más necesito en un equipo es...",
        opciones: [
            { texto: "Personas dispuestas a tomar riesgos conmigo.", rol: "Impulsor" },
            { texto: "Gente calmada que equilibre mi energía.", rol: "Impulsor" },
            { texto: "Expertos que complementen mis ideas.", rol: "Especialista" },
            { texto: "Buena comunicación y transparencia.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "En situaciones de presión, yo...",
        opciones: [
            { texto: "Me vuelvo más decisivo y orientado a la acción.", rol: "Impulsor" },
            { texto: "Me concentro más en los detalles.", rol: "Finalizador" },
            { texto: "Busco consenso para reducir tensiones.", rol: "Cohesionador" },
            { texto: "Evalúo fríamente las opciones.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Cuando propongo algo, suelo...",
        opciones: [
            { texto: "Defenderlo con pasión hasta que se acepte.", rol: "Impulsor" },
            { texto: "Escuchar objeciones y ajustar mi propuesta.", rol: "Cohesionador" },
            { texto: "Presentar un análisis completo de pros y contras.", rol: "Monitor" },
            { texto: "Mostrar ejemplos prácticos de implementación.", rol: "Implementador" },
        ]
    },
    {
        pregunta: "Mi mayor motivador es...",
        opciones: [
            { texto: "Superar desafíos y ganar.", rol: "Impulsor" },
            { texto: "Aprender cosas nuevas e interesantes.", rol: "Investigador" },
            { texto: "Lograr resultados perfectos.", rol: "Finalizador" },
            { texto: "Construir relaciones sólidas.", rol: "Cohesionador" },
        ]
    },

    // IMPLEMENTADOR (Implementer) - 7 preguntas
    {
        pregunta: "Cuando recibo una nueva tarea, mi enfoque es...",
        opciones: [
            { texto: "Planificar cómo ejecutarla eficientemente.", rol: "Implementador" },
            { texto: "Buscar formas más inteligentes de hacerla.", rol: "Cerebro" },
            { texto: "Comenzar inmediatamente para avanzar.", rol: "Impulsor" },
            { texto: "Consultar con el equipo sobre la mejor forma.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Lo que mejor hago en un proyecto es...",
        opciones: [
            { texto: "Convertir ideas en acciones concretas.", rol: "Implementador" },
            { texto: "Mantener el ritmo hasta completarlo.", rol: "Finalizador" },
            { texto: "Identificar los próximos pasos lógicos.", rol: "Coordinador" },
            { texto: "Optimizar procesos para mayor eficiencia.", rol: "Implementador" },
        ]
    },
    {
        pregunta: "Cuando el plan no funciona, yo...",
        opciones: [
            { texto: "Adapto el plan a la realidad rápidamente.", rol: "Implementador" },
            { texto: "Vuelvo a evaluar todo desde cero.", rol: "Monitor" },
            { texto: "Busco ayuda para encontrar soluciones.", rol: "Investigador" },
            { texto: "Insisto hasta encontrar la forma correcta.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Mi approach ante tareas rutinarias es...",
        opciones: [
            { texto: "Hacerlas de forma eficiente y confiable.", rol: "Implementador" },
            { texto: "Buscar formas de mejorarlas.", rol: "Implementador" },
            { texto: "Completarlas rápidamente para avanzar.", rol: "Impulsor" },
            { texto: "Asegurarme de que estén perfectas.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Cuando delego trabajo, yo...",
        opciones: [
            { texto: "Me aseguro de que todos sepan exactamente qué hacer.", rol: "Implementador" },
            { texto: "Doy libertad para que cada uno aporte su estilo.", rol: "Cohesionador" },
            { texto: "Establezco plazos claros y objetivos medibles.", rol: "Coordinador" },
            { texto: "Verifico constantemente el progreso.", rol: "Impulsor" },
        ]
    },
    {
        pregunta: "Lo que valoro más en el trabajo es...",
        opciones: [
            { texto: "La eficiencia y los resultados concretos.", rol: "Implementador" },
            { texto: "La innovación y las ideas nuevas.", rol: "Cerebro" },
            { texto: "La armonía y el trabajo en equipo.", rol: "Cohesionador" },
            { texto: "La calidad y la atención al detalle.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Cuando trabajo solo vs en equipo, soy...",
        opciones: [
            { texto: "Más productivo cuando ejecuto solo.", rol: "Implementador" },
            { texto: "Más efectivo cuando puedo colaborar.", rol: "Cohesionador" },
            { texto: "Más creativo cuando tengo espacio propio.", rol: "Cerebro" },
            { texto: "Más analítico cuando trabajo solo.", rol: "Monitor" },
        ]
    },

    // FINALIZADOR (Completer Finisher) - 7 preguntas
    {
        pregunta: "Antes de entregar un trabajo, yo siempre...",
        opciones: [
            { texto: "Reviso cada detalle para evitar errores.", rol: "Finalizador" },
            { texto: "Me aseguro de que cumpla con los objetivos.", rol: "Monitor" },
            { texto: "Verifico que el equipo esté satisfecho.", rol: "Cohesionador" },
            { texto: "Optimizo para futuros proyectos.", rol: "Implementador" },
        ]
    },
    {
        pregunta: "Lo que más me frustra es...",
        opciones: [
            { texto: "Entregar trabajo con errores evitables.", rol: "Finalizador" },
            { texto: "El desperdicio de buenas ideas por falta de acción.", rol: "Impulsor" },
            { texto: "La falta de reconocimiento del esfuerzo.", rol: "Investigador" },
            { texto: "Los proyectos que nunca se terminan.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Cuando reviso mi propio trabajo, suelo...",
        opciones: [
            { texto: "Encontrar detalles que necesito corregir.", rol: "Finalizador" },
            { texto: "Ver formas de mejorarlo aún más.", rol: "Cerebro" },
            { texto: "Confirmar que está listo para entregar.", rol: "Implementador" },
            { texto: "Compararlo con estándares externos.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Mi estándar de calidad es...",
        opciones: [
            { texto: "La perfección: cada detalle importa.", rol: "Finalizador" },
            { texto: "Lo suficientemente bueno para cumplir el objetivo.", rol: "Implementador" },
            { texto: "Lo mejor dado el tiempo y recursos disponibles.", rol: "Coordinador" },
            { texto: "Superior al promedio de la industria.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "Cuando completo una tarea, yo...",
        opciones: [
            { texto: "Verifico tres veces antes de considerarla lista.", rol: "Finalizador" },
            { texto: "Paso inmediatamente a la siguiente.", rol: "Impulsor" },
            { texto: "Celebro con el equipo.", rol: "Cohesionador" },
            { texto: "Documente lecciones aprendidas.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "Lo que me diferencia de otros es...",
        opciones: [
            { texto: "Mi atención obsessive al detalle.", rol: "Finalizador" },
            { texto: "Mi energía para motivar al equipo.", rol: "Impulsor" },
            { texto: "Mi capacidad para conectar personas.", rol: "Cohesionador" },
            { texto: "Mi visión estratégica.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "En proyectos a largo plazo, yo...",
        opciones: [
            { texto: "Hago seguimiento constante de cada detalle.", rol: "Finalizador" },
            { texto: "Mantengo al equipo enfocado en el objetivo.", rol: "Coordinador" },
            { texto: "Busco nuevos recursos cuando se necesitan.", rol: "Investigador" },
            { texto: "Evalúo regularmente el progreso.", rol: "Monitor" },
        ]
    },

    // COORDINADOR (Coordinator) - 7 preguntas
    {
        pregunta: "Cuando el equipo tiene diferentes opiniones, yo...",
        opciones: [
            { texto: "Guía la discusión hacia un acuerdo.", rol: "Coordinador" },
            { texto: "Permito que se expresen todos libremente.", rol: "Cohesionador" },
            { texto: "Presento los hechos para aclarar.", rol: "Monitor" },
            { texto: "Tomo una decisión rápida.", rol: "Impulsor" },
        ]
    },
    {
        pregunta: "Mi rol natural en un equipo es...",
        opciones: [
            { texto: "El que mantiene a todos enfocados.", rol: "Coordinador" },
            { texto: "El que aporta nuevas ideas.", rol: "Cerebro" },
            { texto: "El que asegura la calidad final.", rol: "Finalizador" },
            { texto: "El que mantiene la armonía.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Cuando hay conflictos en el equipo, yo...",
        opciones: [
            { texto: "Medio y busco soluciones win-win.", rol: "Coordinador" },
            { texto: "Escucho a ambas partes imparcialmente.", rol: "Cohesionador" },
            { texto: "Analizo quién tiene razón.", rol: "Monitor" },
            { texto: "Tomo decisiones difíciles si es necesario.", rol: "Impulsor" },
        ]
    },
    {
        pregunta: "Lo que mejor hago como líder es...",
        opciones: [
            { texto: "Delegar y coordinar esfuerzos.", rol: "Coordinador" },
            { texto: "Inspirar con visión e innovación.", rol: "Cerebro" },
            { texto: "Impulsar la acción decidida.", rol: "Impulsor" },
            { texto: "Crear un ambiente de confianza.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Cuando asigno tareas, yo...",
        opciones: [
            { texto: "Considero las fortalezas de cada persona.", rol: "Coordinador" },
            { texto: "Busco el balance entre desafío y capacidad.", rol: "Monitor" },
            { texto: "Priorizo según urgencia e importancia.", rol: "Implementador" },
            { texto: "Primero me aseguro de que todos estén de acuerdo.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Mi enfoque ante metas ambicioso es...",
        opciones: [
            { texto: "Dividir en pasos manejables y coordinar.", rol: "Coordinador" },
            { texto: "Crear un plan detallado paso a paso.", rol: "Implementador" },
            { texto: "Motivar al equipo con el desafío.", rol: "Impulsor" },
            { texto: "Evaluar si es realmente alcanzable.", rol: "Monitor" },
        ]
    },
    {
        pregunta: "Cuando el equipo va por mal camino, yo...",
        opciones: [
            { texto: "Redirijo hacia los objetivos correctos.", rol: "Coordinador" },
            { texto: "Analizo qué salió mal.", rol: "Monitor" },
            { texto: "Doy un giro dramático al enfoque.", rol: "Cerebro" },
            { texto: "Refuerzo la confianza del equipo.", rol: "Cohesionador" },
        ]
    },

    // INVESTIGADOR (Resource Investigator) - 7 preguntas
    {
        pregunta: "Cuando necesito información, yo...",
        opciones: [
            { texto: "Contact personas y redes que pueden ayudar.", rol: "Investigador" },
            { texto: "Investigar fuentes externas y competencia.", rol: "Investigador" },
            { texto: "Buscar en bases de datos y documentos.", rol: "Especialista" },
            { texto: "Consultar con el equipo interno.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Lo que más disfruto es...",
        opciones: [
            { texto: "Descubrir nuevas oportunidades y contactos.", rol: "Investigador" },
            { texto: "Resolver problemas complejos.", rol: "Cerebro" },
            { texto: "Ver resultados tangibles del trabajo.", rol: "Implementador" },
            { texto: "Compartir tiempo con el equipo.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Cuando el equipo necesita recursos, yo...",
        opciones: [
            { texto: "Salgo a buscarlos activamente.", rol: "Investigador" },
            { texto: "Propongo alternativas creativas.", rol: "Cerebro" },
            { texto: "Optimizo los recursos existentes.", rol: "Implementador" },
            { texto: "Consulto qué necesita el equipo realmente.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Mi mayor fortaleza es...",
        opciones: [
            { texto: "Encontrar lo que el equipo necesita.", rol: "Investigador" },
            { texto: "Ver posibilidades donde otros ven problemas.", rol: "Cerebro" },
            { texto: "Mantener la calma bajo presión.", rol: "Cohesionador" },
            { texto: "Ejecutar planes eficientemente.", rol: "Implementador" },
        ]
    },
    {
        pregunta: "Cuando conozco a alguien nuevo, yo...",
        opciones: [
            { texto: "Busco qué podemos hacer juntos.", rol: "Investigador" },
            { texto: "Evalúo si puede aportar al equipo.", rol: "Monitor" },
            { texto: "Me aseguro de que se sienta bienvenido.", rol: "Cohesionador" },
            { texto: "Le explico los objetivos del proyecto.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "En negociaciones, yo suelo...",
        opciones: [
            { texto: "Encontrar puntos de interés mutuo.", rol: "Investigador" },
            { texto: "Presentar argumentos lógicos.", rol: "Monitor" },
            { texto: "Defender los intereses del equipo.", rol: "Impulsor" },
            { texto: "Buscar el consenso.", rol: "Cohesionador" },
        ]
    },
    {
        pregunta: "Lo que me diferencia es...",
        opciones: [
            { texto: "Mi red de contactos y relaciones.", rol: "Investigador" },
            { texto: "Mi capacidad para generar ideas.", rol: "Cerebro" },
            { texto: "Mi atención al detalle.", rol: "Finalizador" },
            { texto: "Mi habilidades para trabajar con personas.", rol: "Cohesionador" },
        ]
    },

    // COHESIONADOR (Teamworker) - 7 preguntas
    {
        pregunta: "Cuando hay tensiones en el equipo, yo...",
        opciones: [
            { texto: "Trabajo para resolver los conflictos.", rol: "Cohesionador" },
            { texto: "Analizo las causas del problema.", rol: "Monitor" },
            { texto: "Doy un respiro y luego retomo.", rol: "Investigador" },
            { texto: "Propongo un plan de acción.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Lo que más valoro en un equipo es...",
        opciones: [
            { texto: "La confianza y el apoyo mutuo.", rol: "Cohesionador" },
            { texto: "La eficiencia y los resultados.", rol: "Implementador" },
            { texto: "La innovación y las ideas nuevas.", rol: "Cerebro" },
            { texto: "El profesionalismo individual.", rol: "Especialista" },
        ]
    },
    {
        pregunta: "Cuando alguien del equipo tiene dificultades, yo...",
        opciones: [
            { texto: "Ofrezco mi ayuda inmediatamente.", rol: "Cohesionador" },
            { texto: "Analizo qué necesita realmente.", rol: "Monitor" },
            { texto: "Lo motiva a encontrar su propia solución.", rol: "Coordinador" },
            { texto: "Le doy espacio pero estoy disponible.", rol: "Investigador" },
        ]
    },
    {
        pregunta: "Mi approach ante el trabajo en equipo es...",
        opciones: [
            { texto: "Priorizar las relaciones y el bienestar del grupo.", rol: "Cohesionador" },
            { texto: "Enfocarme en cumplir los objetivos.", rol: "Coordinador" },
            { texto: "Asegurarme de que todos contribuyan.", rol: "Impulsor" },
            { texto: "Mantener estándares altos de calidad.", rol: "Finalizador" },
        ]
    },
    {
        pregunta: "Cuando tomo decisiones, considero...",
        opciones: [
            { texto: "Cómo afectará al equipo y las personas.", rol: "Cohesionador" },
            { texto: "Los datos y el análisis disponible.", rol: "Monitor" },
            { texto: "Los recursos y restricciones.", rol: "Implementador" },
            { texto: "La visión a largo plazo.", rol: "Coordinador" },
        ]
    },
    {
        pregunta: "Lo que más me satisface es...",
        opciones: [
            { texto: "Ver al equipo trabajar en harmony.", rol: "Cohesionador" },
            { texto: "Lograr resultados que parecían imposibles.", rol: "Impulsor" },
            { texto: "Entregar trabajo de alta calidad.", rol: "Finalizador" },
            { texto: "Aprender algo nuevo e interesante.", rol: "Investigador" },
        ]
    },
    {
        pregunta: "Cuando hay desacuerdos, yo...",
        opciones: [
            { texto: "Busco terreno común y entendimiento.", rol: "Cohesionador" },
            { texto: "Defiendo mi posición con argumentos.", rol: "Impulsor" },
            { texto: "Evalúo quién tiene razón objetivamente.", rol: "Monitor" },
            { texto: "Propongo soluciones de compromiso.", rol: "Coordinador" },
        ]
    },
]

export default function BelbinTest() {
    const [currentQ, setCurrentQ] = useState(0)
    const [respuestas, setRespuestas] = useState<string[]>([])
    const [resultado, setResultado] = useState<{ rol: string, scores: Record<string, number> } | null>(null)
    const [saving, setSaving] = useState(false)
    const saveBelbin = useMutation(api.users.saveBelbinProfile)
    const user = useQuery(api.users.getProfile)
    const navigate = useNavigate()

    const handleAnswer = (rol: string) => {
        const nuevas = [...respuestas, rol]
        setRespuestas(nuevas)

        if (currentQ < PREGUNTAS_BELBIN.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            const conteo: Record<string, number> = {}
            nuevas.forEach(r => { conteo[r] = (conteo[r] || 0) + 1 })
            const dominant = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0][0]
            
            setResultado({ rol: dominant, scores: conteo })

            const catMap: Record<string, string> = {
                'Cerebro': 'Mental', 'Monitor': 'Mental',
                'Coordinador': 'Social', 'Investigador': 'Social', 'Cohesionador': 'Social',
                'Impulsor': 'Acción', 'Implementador': 'Acción', 'Finalizador': 'Acción',
                'Especialista': 'Especial'
            }
            const category = catMap[dominant] || 'Especial'

            setSaving(true)
            saveBelbin({
                role_dominant: dominant,
                category,
                scores: conteo,
            }).then(() => setSaving(false))
                .catch(() => setSaving(false))
        }
    }

    const progress = ((currentQ + (resultado ? 1 : 0)) / PREGUNTAS_BELBIN.length) * 100

    if (resultado) {
        const rolDescriptions: Record<string, { emoji: string, desc: string, category: string }> = {
            "Cerebro": { emoji: "🧠", desc: "Eres creativo y generador de ideas originales. Sobresales resolviendo problemas complejos de formas no convencionales.", category: "Mental" },
            "Monitor": { emoji: "🔍", desc: "Eres analítico y estratégico. Evalúas todas las opciones con objetividad antes de tomar decisiones.", category: "Mental" },
            "Coordinador": { emoji: "👑", desc: "Eres un líder natural. Sabes delegar, identificar talentos y mantener al equipo enfocado en los objetivos.", category: "Social" },
            "Investigador": { emoji: "🌐", desc: "Eres extrovertido y entusiasta. Exploras oportunidades y traes ideas y contactos del exterior.", category: "Social" },
            "Cohesionador": { emoji: "🤝", desc: "Eres diplomático y perceptivo. Creas armonía en el equipo y resuelves conflictos con facilidad.", category: "Social" },
            "Impulsor": { emoji: "⚡", desc: "Eres dinámico y desafías al equipo a mejorar. Tu energía empuja al grupo a superar obstáculos.", category: "Acción" },
            "Implementador": { emoji: "⚙️", desc: "Eres disciplinado y confiable. Conviertes las ideas en planes de acción prácticos y eficientes.", category: "Acción" },
            "Finalizador": { emoji: "🎯", desc: "Eres perfeccionista y meticuloso. Te aseguras de que todo esté impecable antes de entregar.", category: "Acción" },
            "Especialista": { emoji: "📚", desc: "Tienes conocimiento profundo en áreas específicas y te dedicas a dominar tu campo.", category: "Especial" },
        }
        const info = rolDescriptions[resultado.rol] || { emoji: "✨", desc: "Tienes un perfil único.", category: "Especial" }

        const sortedScores = Object.entries(resultado.scores).sort((a, b) => b[1] - a[1])

        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6">
                <div className="max-w-lg w-full text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl animate-bounce">
                        {info.emoji}
                    </div>
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-sm text-primary-light mb-4">
                        <CheckCircle className="w-4 h-4" /> Test Completado
                    </div>
                    <h1 className="text-4xl font-black text-white mb-2">Tu rol es: {resultado.rol}</h1>
                    <span className="inline-block bg-surface-light text-slate-300 text-sm font-semibold px-3 py-1 rounded-full mb-6">Categoría: {info.category}</span>
                    <p className="text-slate-400 text-lg leading-relaxed mb-6">{info.desc}</p>
                    
                    <div className="bg-surface-light rounded-2xl p-4 mb-6 text-left">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">Tu Perfil Completo</p>
                        <div className="space-y-2">
                            {sortedScores.map(([rol, count]) => (
                                <div key={rol} className="flex items-center gap-3">
                                    <span className="text-slate-300 text-sm w-32 truncate">{rol}</span>
                                    <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${
                                                rol === resultado.rol ? 'bg-primary' : 'bg-slate-600'
                                            }`}
                                            style={{ width: `${(count / Math.max(...Object.values(resultado.scores))) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-white font-bold text-sm w-6 text-right">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {saving && (
                        <div className="flex items-center justify-center gap-2 text-primary-light mb-6">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm">Guardando tu perfil...</span>
                        </div>
                    )}

                    <button
                        onClick={() => navigate(user?.role === 'teacher' ? '/docente' : '/alumno')}
                        className="bg-primary hover:bg-primary-light text-white font-bold px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-95 flex items-center justify-center gap-2 mx-auto"
                    >
                        <Rocket className="w-5 h-5" />
                        Ir a mi Dashboard
                    </button>
                </div>
            </div>
        )
    }

    const pregunta = PREGUNTAS_BELBIN[currentQ]

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="max-w-2xl w-full">
                <div className="flex items-center gap-3 mb-8">
                    <Brain className="w-8 h-8 text-primary-light" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Test de Perfil de Equipo (Belbin)</h1>
                        <p className="text-slate-400 text-sm">56 preguntas • Descubre tu rol ideal en equipos de trabajo.</p>
                    </div>
                </div>

                <div className="w-full bg-surface-light rounded-full h-2.5 mb-2">
                    <div
                        className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-xs text-slate-500 mb-8">Pregunta {currentQ + 1} de {PREGUNTAS_BELBIN.length}</p>

                <h2 className="text-2xl font-bold text-white mb-8">{pregunta.pregunta}</h2>

                <div className="space-y-4">
                    {pregunta.opciones.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt.rol)}
                            className="w-full text-left bg-surface-light border border-white/5 rounded-2xl p-5 hover:border-primary/40 hover:bg-surface-lighter transition-all duration-200 group flex items-center gap-4"
                        >
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 font-bold group-hover:bg-primary/20 group-hover:text-primary-light transition-colors shrink-0">
                                {String.fromCharCode(65 + i)}
                            </div>
                            <span className="text-slate-300 group-hover:text-white transition-colors">{opt.texto}</span>
                            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-primary-light ml-auto transition-colors" />
                        </button>
                    ))}
                </div>

                {currentQ > 0 && (
                    <button
                        onClick={() => {
                            setCurrentQ(currentQ - 1)
                            setRespuestas(respuestas.slice(0, -1))
                        }}
                        className="mt-6 text-slate-500 hover:text-white text-sm flex items-center gap-1 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Pregunta anterior
                    </button>
                )}
            </div>
        </div>
    )
}
