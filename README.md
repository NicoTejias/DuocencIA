# QuestIA

Plataforma educativa gamificada con inteligencia artificial para gestión docente. Motiva a tus alumnos con misiones, puntajes, rankings y evaluación automatizada.

## Características Principales

- **Sistema de Misiones**: Crea misiones immersivas con quizzes generados por IA
- **Gamificación**: Sistema de puntos, rankings, rachas diarias y recompensas
- **Perfiles Belbin**: 56 preguntas para identificar roles de equipo de tus alumnos
- **Grupos Inteligentes**: Generación automática de grupos equilibrados por rol Belbin
- **Evaluación IA**: Rúbricas automáticas con Gemini para corregir trabajos
- **Asistencia**: Control de asistencia con códigos QR y geolocalización
- **Material de Apoyo**: Subida de documentos PDF/DOCX con extracción de texto
- **Chat en Tiempo Real**: Comunicación docente-alumno
- **Notificaciones Push**: Alertas de nuevas misiones y logros
- **App Móvil**: APK para Android con Capacitor

## Stack Tecnológico

| Categoría | Tecnología |
|-----------|------------|
| Frontend | React 19 + TypeScript + Vite |
| Estilos | Tailwind CSS 4 |
| Backend | Convex (base de datos en tiempo real) |
| Auth | Clerk Authentication |
| IA | Google Gemini 2.5 Flash |
| Push | Firebase Cloud Messaging |
| Mobile | Capacitor 8 |
| Testing | Vitest |
| PWA | Vite PWA Plugin |

## Requisitos Previos

- Node.js 20+
- npm o pnpm
- Cuenta de [Convex](https://convex.dev)
- Cuenta de [Clerk](https://clerk.com)
- Cuenta de [Firebase](https://firebase.google.com)
- API Key de [Google Gemini](https://ai.google.dev)

## Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/NicoTejias/QuestIA.git
cd QuestIA
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```

Edita `.env.local` y completa:
```env
VITE_CONVEX_URL=your-convex-url
CONVEX_DEPLOYMENT=dev:your-deployment
VITE_CONVEX_SITE_URL=your-site-url

VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_API_KEY=your-google-api-key

VITE_CLERK_PUBLISHABLE_KEY=pk_test_your-key

VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_VAPID_KEY=your-vapid-key

GEMINI_API_KEY=your-gemini-key
```

4. **Iniciar desarrollo**
```bash
npm run dev
```

## Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Producción
npm run lint         # Verificación de código
npm run test         # Tests en watch mode
npm run test:run     # Tests una vez
npm run test:coverage # Coverage report
```

## Estructura del Proyecto

```
QuestIA/
├── convex/              # Backend (Convex functions)
│   ├── schema.ts       # Definición de tablas
│   ├── users.ts        # Gestión de usuarios
│   ├── courses.ts      # Ramos y asignaturas
│   ├── quizzes.ts     # Quizzes y evaluación
│   ├── groups.ts      # Grupos de trabajo
│   ├── rewards.ts      # Sistema de recompensas
│   └── ...
├── src/
│   ├── components/     # Componentes React
│   │   ├── student/   # Panel de alumno
│   │   ├── teacher/   # Panel de docente
│   │   └── admin/    # Panel de administrador
│   ├── pages/         # Páginas principales
│   ├── lib/           # Utilidades
│   └── test/          # Tests unitarios
├── android/           # App Android (Capacitor)
└── ios/               # App iOS (Capacitor)
```

## Roles de Usuario

### Alumno
- Completar perfil Belbin (56 preguntas)
- Resolver quizzes y ganar puntos
- Ver ranking y recompensas
- Inscribirse en ramos
- Chat con docente

### Docente
- Crear y gestionar ramos
- Subir material de apoyo
- Generar quizzes con IA
- Crear misiones y recompensas
- Ver analíticas de alumnos
- Generar grupos inteligentes
- Evaluación con rúbricas IA

### Administrador
- Gestionar usuarios administradores
- Ver analíticas globales
- Configurar sistema

## Sistema de Puntos

- **Puntos de Ranking**: Acumulados, nunca bajan
- **Puntos Canjeables**: Para comprar recompensas
- **Racha Diaria**: Bonus por practicar diario
- **Congelar Racha**: Protección opcional (200 pts)

## API de IA

El proyecto usa Gemini 2.5 Flash para:
- Generación de quizzes desde documentos
- Evaluación de trabajos con rúbricas
- Feedback automático personalizado
- Análisis de grupos Belbin

## Despliegue

### Web (Vercel/Netlify)
```bash
npm run build
# Subir carpeta dist/
```

### Android APK
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleRelease
```

### Convex
```bash
npx convex deploy
```

## Licencia

MIT License - Libre para uso educativo.

## Autor

Nicolas Tejias - [@NicoTejias](https://github.com/NicoTejias)

## Screenshots

*(Próximamente)*
