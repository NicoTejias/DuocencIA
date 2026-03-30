import { useEffect } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';
import { requestNotificationPermission } from '../lib/firebase';
import { toast } from 'sonner';

export default function PushNotificationManager() {
    const saveToken = useMutation(api.users.savePushToken);
    const user = useQuery(api.users.getProfile);

    useEffect(() => {
        if (!user) return;

        const setupNotifications = async () => {
            // 1. Caso Nativo (Android/iOS con Capacitor)
            if (Capacitor.isNativePlatform()) {
                let permStatus = await PushNotifications.checkPermissions();

                if (permStatus.receive === 'prompt') {
                    permStatus = await PushNotifications.requestPermissions();
                }

                if (permStatus.receive !== 'granted') {
                    return;
                }

                await PushNotifications.register();

                // Listener para el token registrado por el sistema nativo
                PushNotifications.addListener('registration', (token) => {
                    saveToken({ token: token.value });
                });

                PushNotifications.addListener('registrationError', (_error) => {
                    // Error silenciado — no exponer tokens ni detalles internos en consola
                });

                // Notificación recibida con la app abierta (foreground)
                PushNotifications.addListener('pushNotificationReceived', (notification) => {
                    toast(notification.title, {
                        description: notification.body,
                    });
                });
            } 
            // 2. Caso Web / PWA
            else if ('Notification' in window) {
                try {
                    const token = await requestNotificationPermission();
                    if (token) {
                        saveToken({ token }).catch(() => {
                            // Silenciamos error de servidor en consola para evitar ruido
                        });
                    }
                } catch {
                    // Error silenciado — fallo al configurar web push no debe interrumpir la app
                }
            }
        };

        setupNotifications();

        // Cleanup
        return () => {
            if (Capacitor.isNativePlatform()) {
                PushNotifications.removeAllListeners();
            }
        };
    }, [user, saveToken]);

    return null;
}
