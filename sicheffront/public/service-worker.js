// public/service-worker.js

self.addEventListener('push', function (event) {
    console.log('🔔 Push recibido:', event);

    let data = {};

    try {
        data = event.data ? event.data.json() : {};
    } catch (e) {
        console.error('Error parseando push data:', e);
    }

    const title = data.title || 'Nuevo mensaje en SiChef';
    const options = {
        body: data.body || 'Tienes un nuevo mensaje',
        icon: data.icon || '/chef-avatar.jpg',
        badge: '/chef-avatar.jpg',
        image: data.image,
        data: {
            url: data.url || '/chat',
            sender: data.sender
        },
        tag: 'sichef-message-' + Date.now(),
        requireInteraction: false,
        vibrate: [200, 100, 200],
        actions: [
            {
                action: 'open',
                title: 'Abrir chat',
                icon: '/chat-icon.png'
            },
            {
                action: 'close',
                title: 'Cerrar'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    console.log('👆 Notificación clickeada:', event.action);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Abrir o enfocar la ventana del chat
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function (clientList) {
                // Si ya hay una ventana abierta, enfocarla
                for (let i = 0; i < clientList.length; i++) {
                    let client = clientList[i];
                    if (client.url.includes('/chat') && 'focus' in client) {
                        return client.focus();
                    }
                }
                // Si no, abrir nueva ventana
                if (clients.openWindow) {
                    return clients.openWindow(event.notification.data.url || '/chat');
                }
            })
    );
});

self.addEventListener('install', function (event) {
    console.log('🔧 Service Worker instalado');
    self.skipWaiting();
});

self.addEventListener('activate', function (event) {
    console.log('✅ Service Worker activado');
    event.waitUntil(clients.claim());
});