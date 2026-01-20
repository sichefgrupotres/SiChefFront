// src/utils/pushNotifications.ts

export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
        console.warn('⚠️ Service Workers no soportados en este navegador');
        return null;
    }

    try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('✅ Service Worker registrado:', registration.scope);
        return registration;
    } catch (error) {
        console.error('❌ Error registrando Service Worker:', error);
        return null;
    }
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
        console.warn('⚠️ Notificaciones no soportadas en este navegador');
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        console.log('✅ Permiso de notificaciones ya otorgado');
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        console.log('🔔 Solicitando permiso para notificaciones...');
        const permission = await Notification.requestPermission();
        console.log(`Permiso de notificaciones: ${permission}`);
        return permission;
    }

    console.log('⚠️ Permiso de notificaciones denegado previamente');
    return Notification.permission;
}

export async function subscribeToPushNotifications(userEmail: string): Promise<PushSubscription | null> {
    try {
        const registration = await navigator.serviceWorker.ready;

        console.log('📡 Obteniendo clave pública VAPID...');

        // Obtener la clave pública VAPID desde tu backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-notifications/vapid-public-key`);

        if (!response.ok) {
            throw new Error('No se pudo obtener la clave VAPID');
        }

        const { publicKey } = await response.json();

        if (!publicKey) {
            throw new Error('Clave VAPID vacía');
        }

        console.log('🔑 Clave VAPID obtenida');

        // Convertir la clave VAPID
        const applicationServerKey: Uint8Array = urlBase64ToUint8Array(publicKey);

        // Suscribirse al push
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as BufferSource
        });

        console.log('📱 Suscripción creada:', subscription.endpoint);

        // Enviar la suscripción al backend
        const saveResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-notifications/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                subscription,
                userEmail
            })
        });

        if (!saveResponse.ok) {
            throw new Error('No se pudo guardar la suscripción');
        }

        console.log('✅ Suscrito a push notifications para:', userEmail);
        return subscription;
    } catch (error) {
        console.error('❌ Error suscribiéndose a push:', error);
        return null;
    }
}

// Helper para convertir la clave VAPID de base64 a Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function unsubscribeFromPush(userEmail: string): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();

            // Notificar al backend
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push-notifications/unsubscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail })
            });

            console.log('✅ Desuscrito de push notifications');
            return true;
        }
        return false;
    } catch (error) {
        console.error('❌ Error desuscribiéndose:', error);
        return false;
    }
}

export async function checkPushSubscription(): Promise<boolean> {
    try {
        if (!('serviceWorker' in navigator)) return false;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        return subscription !== null;
    } catch (error) {
        console.error('Error verificando suscripción:', error);
        return false;
    }
}
