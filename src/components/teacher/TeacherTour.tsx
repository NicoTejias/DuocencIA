import { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export default function TeacherTour() {
    const JoyrideComponent: any = Joyride;
    const [run, setRun] = useState(false);
    const [stepIndex, setStepIndex] = useState(0);

    // Initial check if we should run the tour
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('questia_demo_tour_seen');
        if (!hasSeenTour) {
            // Slight delay so UI loads before tour starts
            setTimeout(() => {
                setRun(true);
            }, 1000);
        }
    }, []);

    const steps: any[] = [
        {
            target: 'body',
            content: '👋 ¡Bienvenido al Modo Testing de QuestIA! Te daremos un recorrido rápido por tus superpoderes como docente.',
            placement: 'center',
        },
        {
            target: '.tour-step-ramos',
            content: '📚 Crea y gestiona tus ramos aquí. Configura las carreras asociadas y agrupa tus clases.',
            placement: 'right-start',
        },
        {
            target: '.tour-step-material',
            content: '📄 Sube documentos en formato PDF, Word, PowerPoints o Excel. La IA utilizará esto para generar desafíos automáticamente.',
            placement: 'right',
        },
        {
            target: '.tour-step-desafios',
            content: '🎯 Aquí la magia ocurre: crea quizzes o juegos (trivia, verdadero/falso, sopa de letras, memoria) para enganchar a tus alumnos.',
            placement: 'right',
        },
        {
            target: '.tour-step-ranking',
            content: '🏆 Observa cómo compiten de manera sana en un tablero de puntajes en vivo.',
            placement: 'right',
        },
        {
            target: '.tour-step-recompensas',
            content: '🎁 Permite a los alumnos canjear los puntos ganados por beneficios reales (puntos extra o ayudas).',
            placement: 'right',
        },
        {
            target: '.tour-step-estadisticas',
            content: '📊 Al iniciar el panel siempre podrás ver el estado general de retención, un indicador vital de tus alumnos.',
            placement: 'bottom',
        }
    ];

    const handleJoyrideCallback = (data: any) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('questia_demo_tour_seen', 'true');
        }
    };

    return (
        <JoyrideComponent
            steps={steps}
            run={run}
            stepIndex={stepIndex}
            continuous={true}
            showSkipButton={true}
            showProgress={true}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#8b5cf6', // accent color
                    backgroundColor: '#1e293b',
                    textColor: '#f8fafc',
                    arrowColor: '#1e293b',
                    overlayColor: 'rgba(0, 0, 0, 0.7)',
                },
                buttonNext: {
                    backgroundColor: '#8b5cf6',
                    borderRadius: '8px',
                },
                buttonBack: {
                    color: '#94a3b8',
                },
                buttonSkip: {
                    color: '#cbd5e1',
                }
            } as any}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Terminar',
                next: 'Siguiente',
                skip: 'Omitir',
            }}
            callback={handleJoyrideCallback}
        />
    );
}
