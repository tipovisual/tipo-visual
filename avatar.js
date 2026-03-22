/**
 * Puntico Avatar — Mascota inteligente transversal
 * Archivo JS externo reutilizable. Agregar en cada página pública:
 * <script src="avatar.js"></script>
 */

(function() {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // CONFIGURACIÓN
    // ─────────────────────────────────────────────────────────────
    const CONFIG = {
        INACTIVITY_TIMEOUT:   20000,  // ms antes de mostrar mensaje por inactividad
        MESSAGE_MIN_INTERVAL: 12000,  // ms mínimo entre mensajes
        MAX_REJECTIONS:       3,      // cierres antes de reducir frecuencia
        REDUCED_INTERVAL:     60000,  // ms entre mensajes si el usuario rechaza mucho
        DESKTOP_SIZE:         90,     // px ancho del avatar en desktop
        MOBILE_SIZE:          64,     // px ancho del avatar en móvil
        MOBILE_BREAKPOINT:    768,    // px
        STORAGE_KEY:          'puntico_avatar',
    };

    // ─────────────────────────────────────────────────────────────
    // MENSAJES POR CONTEXTO
    // ─────────────────────────────────────────────────────────────
    const MESSAGES = {
        index: [
            { text: "¡Hola! 👋 ¿Ya conoces nuestras ediciones coleccionables?", action: { label: "Ver ediciones", url: "#editions" }, priority: 1 },
            { text: "¿Sabías que el juego mejora la memoria en un +40%? 🧠", action: null, priority: 2 },
            { text: "¡Descarga gratis nuestra guía de actividades! 🎁", action: { label: "Descargar", url: "login.html?reason=guide&tab=register" }, priority: 1 },
            { text: "Más de 1.950 familias ya juegan con puntico® 🎴", action: null, priority: 3 },
        ],
        store: [
            { text: "¡El juego perfecto para toda la familia! 🎁", action: { label: "Ver productos", url: "#products" }, priority: 1 },
            { text: "Edición Panamá disponible por solo $15 🇵🇦", action: null, priority: 2 },
            { text: "¿Tienes dudas sobre el envío? Escríbenos 📦", action: { label: "WhatsApp", url: "https://wa.me/50761234567" }, priority: 2 },
        ],
        about: [
            { text: "¡Esta es la historia de puntico®! ✨", action: null, priority: 3 },
            { text: "¿Quieres saber cómo nació todo esto? 🌱", action: null, priority: 2 },
            { text: "Top 10 del programa Bridge for Billions 2025 🏆", action: null, priority: 1 },
        ],
        game: [
            { text: "¡A jugar! Encuentra todos los pares 🎴", action: null, priority: 1 },
            { text: "Tip: ¡Concéntrate y memoriza de a pares! 🧠", action: null, priority: 2 },
            { text: "¿Ya guardaste tu récord? 🏆 ¡Inicia sesión!", action: { label: "Iniciar sesión", url: "login.html" }, priority: 1 },
        ],
        inactivity: [
            { text: "¿Necesitas ayuda? Estoy aquí 😊", action: null, priority: 1 },
            { text: "¿Buscas algo en específico? 🔍", action: null, priority: 2 },
            { text: "¡Mira nuestra tienda! 🛍️", action: { label: "Ver tienda", url: "store.html" }, priority: 1 },
        ],
    };

    // ─────────────────────────────────────────────────────────────
    // STATE
    // ─────────────────────────────────────────────────────────────
    let state = {
        isExpanded:      false,
        lastMessageTime: 0,
        rejectionCount:  0,
        shownMessages:   [],
        currentContext:  'index',
        inactivityTimer: null,
        isVisible:       true,
    };

    // Load persisted state
    try {
        const saved = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY) || '{}');
        state.rejectionCount  = saved.rejectionCount  || 0;
        state.shownMessages   = saved.shownMessages   || [];
        state.lastMessageTime = saved.lastMessageTime || 0;
    } catch(e) {}

    // ─────────────────────────────────────────────────────────────
    // CONTEXT DETECTION
    // ─────────────────────────────────────────────────────────────
    function detectContext() {
        const path = window.location.pathname;
        if (path.includes('store'))  return 'store';
        if (path.includes('about'))  return 'about';
        if (path.includes('game'))   return 'game';
        if (path.includes('login'))  return 'index';
        return 'index';
    }

    // ─────────────────────────────────────────────────────────────
    // MESSAGE SELECTION
    // ─────────────────────────────────────────────────────────────
    function getNextMessage(context) {
        const now = Date.now();
        const interval = state.rejectionCount >= CONFIG.MAX_REJECTIONS
            ? CONFIG.REDUCED_INTERVAL
            : CONFIG.MESSAGE_MIN_INTERVAL;

        if (now - state.lastMessageTime < interval) return null;

        const pool = MESSAGES[context] || MESSAGES.index;
        const available = pool
            .filter(m => !state.shownMessages.includes(m.text))
            .sort((a, b) => a.priority - b.priority);

        // Reset shown if all seen
        if (available.length === 0) {
            state.shownMessages = [];
            return pool.sort((a, b) => a.priority - b.priority)[0];
        }

        return available[0];
    }

    // ─────────────────────────────────────────────────────────────
    // PERSIST STATE
    // ─────────────────────────────────────────────────────────────
    function persistState() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify({
                rejectionCount:  state.rejectionCount,
                shownMessages:   state.shownMessages.slice(-20),
                lastMessageTime: state.lastMessageTime,
            }));
        } catch(e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // INACTIVITY TIMER
    // ─────────────────────────────────────────────────────────────
    function resetInactivityTimer() {
        clearTimeout(state.inactivityTimer);
        state.inactivityTimer = setTimeout(() => {
            const msg = getNextMessage('inactivity');
            if (msg) showBubble(msg);
        }, CONFIG.INACTIVITY_TIMEOUT);
    }

    // ─────────────────────────────────────────────────────────────
    // DOM CREATION
    // ─────────────────────────────────────────────────────────────
    function createAvatar() {
        const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
        const size = isMobile ? CONFIG.MOBILE_SIZE : CONFIG.DESKTOP_SIZE;

        // Root wrapper
        const root = document.createElement('div');
        root.id = 'puntico-avatar-root';
        root.style.cssText = `
            position: fixed;
            bottom: ${isMobile ? '16px' : '24px'};
            right: ${isMobile ? '12px' : '24px'};
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 8px;
            pointer-events: none;
        `;

        // Message bubble
        const bubble = document.createElement('div');
        bubble.id = 'puntico-bubble';
        bubble.style.cssText = `
            background: white;
            border: 2px solid #211261;
            border-radius: 16px 16px 4px 16px;
            padding: 10px 14px;
            max-width: ${isMobile ? '200px' : '240px'};
            box-shadow: 0 8px 24px rgba(33,18,97,0.15);
            font-family: 'Nunito', 'DM Sans', sans-serif;
            font-size: ${isMobile ? '11px' : '13px'};
            font-weight: 700;
            color: #211261;
            line-height: 1.4;
            display: none;
            pointer-events: all;
            opacity: 0;
            transform: translateY(8px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            position: relative;
        `;

        const bubbleClose = document.createElement('button');
        bubbleClose.innerHTML = '✕';
        bubbleClose.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #E50072;
            color: white;
            border: none;
            border-radius: 50%;
            width: 18px;
            height: 18px;
            font-size: 9px;
            font-weight: 900;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
            padding: 0;
        `;
        bubbleClose.onclick = (e) => {
            e.stopPropagation();
            hideBubble(true);
        };

        const bubbleText = document.createElement('p');
        bubbleText.id = 'puntico-bubble-text';
        bubbleText.style.margin = '0 0 6px 0';

        const bubbleAction = document.createElement('a');
        bubbleAction.id = 'puntico-bubble-action';
        bubbleAction.style.cssText = `
            display: none;
            font-size: 10px;
            font-weight: 900;
            color: #E50072;
            text-decoration: none;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            margin-top: 4px;
        `;
        bubbleAction.textContent = '→ Ver más';

        bubble.appendChild(bubbleClose);
        bubble.appendChild(bubbleText);
        bubble.appendChild(bubbleAction);

        // Panel expandido
        const panel = document.createElement('div');
        panel.id = 'puntico-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: ${isMobile ? '90px' : '130px'};
            right: ${isMobile ? '12px' : '24px'};
            width: ${isMobile ? '260px' : '300px'};
            background: white;
            border: 2px solid #211261;
            border-radius: 20px;
            box-shadow: 0 16px 40px rgba(33,18,97,0.2);
            font-family: 'Nunito', 'DM Sans', sans-serif;
            display: none;
            overflow: hidden;
            pointer-events: all;
            opacity: 0;
            transform: translateY(12px) scale(0.95);
            transition: opacity 0.3s ease, transform 0.3s ease;
            z-index: 9998;
        `;

        panel.innerHTML = `
            <div style="background:#211261;padding:16px 16px 12px;display:flex;align-items:center;justify-content:space-between;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <img src="assets/personaje/puntico_personaje.svg" style="width:32px;height:32px;object-fit:contain;">
                    <div>
                        <p style="color:#FFED00;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.12em;margin:0;">puntico®</p>
                        <p style="color:white;font-size:12px;font-weight:800;margin:0;">¡Hola! Estoy aquí para ayudarte</p>
                    </div>
                </div>
                <button id="puntico-panel-close" style="background:rgba(255,255,255,0.1);border:none;color:white;border-radius:8px;width:24px;height:24px;cursor:pointer;font-weight:900;font-size:12px;">✕</button>
            </div>
            <div style="padding:16px;" id="puntico-panel-links">
                <p style="font-size:11px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;margin:0 0 12px;">¿Qué quieres hacer?</p>
                <div style="display:flex;flex-direction:column;gap:8px;" id="puntico-panel-actions">
                    <a href="store.html" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F5F4FB;border-radius:12px;text-decoration:none;color:#211261;font-size:12px;font-weight:800;">
                        🛍️ <span>Ver la tienda</span>
                    </a>
                    <a href="index.html#editions" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F5F4FB;border-radius:12px;text-decoration:none;color:#211261;font-size:12px;font-weight:800;">
                        🎴 <span>Ver ediciones</span>
                    </a>
                    <a href="about.html" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#F5F4FB;border-radius:12px;text-decoration:none;color:#211261;font-size:12px;font-weight:800;">
                        ✨ <span>Nuestra historia</span>
                    </a>
                    <a href="login.html?reason=guide&tab=register" style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#FCE4F1;border-radius:12px;text-decoration:none;color:#E50072;font-size:12px;font-weight:800;">
                        🎁 <span>Descargar guía gratis</span>
                    </a>
                </div>
                <p style="font-size:10px;color:#94A3B8;text-align:center;margin:12px 0 0;">#JuegosConPropósito</p>
            </div>
        `;

        // Avatar button
        const avatarBtn = document.createElement('button');
        avatarBtn.id = 'puntico-avatar-btn';
        avatarBtn.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            border: none;
            background: transparent;
            cursor: pointer;
            padding: 0;
            pointer-events: all;
            transition: transform 0.2s ease;
            filter: drop-shadow(0 4px 12px rgba(33,18,97,0.25));
            position: relative;
        `;

        avatarBtn.innerHTML = `<img src="assets/personaje/puntico_personaje.svg" style="width:100%;height:100%;object-fit:contain;" alt="Puntico mascota">`;

        avatarBtn.onmouseenter = () => {
            avatarBtn.style.transform = 'scale(1.08) translateY(-2px)';
        };
        avatarBtn.onmouseleave = () => {
            avatarBtn.style.transform = 'scale(1) translateY(0)';
        };
        avatarBtn.onclick = togglePanel;

        root.appendChild(bubble);
        root.appendChild(avatarBtn);
        document.body.appendChild(root);
        document.body.appendChild(panel);

        // Panel close button
        setTimeout(() => {
            const closeBtn = document.getElementById('puntico-panel-close');
            if (closeBtn) closeBtn.onclick = closePanel;
        }, 100);

        // Close panel on outside click
        document.addEventListener('click', (e) => {
            if (state.isExpanded &&
                !panel.contains(e.target) &&
                !avatarBtn.contains(e.target)) {
                closePanel();
            }
        });

        return { root, bubble, bubbleText, bubbleAction, avatarBtn, panel };
    }

    // ─────────────────────────────────────────────────────────────
    // SHOW / HIDE BUBBLE
    // ─────────────────────────────────────────────────────────────
    let elements = null;

    function showBubble(msg) {
        if (!elements || state.isExpanded) return;

        const { bubble, bubbleText, bubbleAction } = elements;

        bubbleText.textContent = msg.text;

        if (msg.action) {
            bubbleAction.textContent = `→ ${msg.action.label}`;
            bubbleAction.href = msg.action.url;
            bubbleAction.style.display = 'block';
        } else {
            bubbleAction.style.display = 'none';
        }

        bubble.style.display = 'block';
        requestAnimationFrame(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0) scale(1)';
        });

        state.lastMessageTime = Date.now();
        state.shownMessages.push(msg.text);
        persistState();

        // Auto-hide after 6 seconds
        setTimeout(() => hideBubble(false), 6000);
    }

    function hideBubble(byUser = false) {
        if (!elements) return;
        const { bubble } = elements;

        if (byUser) {
            state.rejectionCount++;
            persistState();
        }

        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(8px) scale(0.95)';
        setTimeout(() => { bubble.style.display = 'none'; }, 300);
    }

    // ─────────────────────────────────────────────────────────────
    // PANEL
    // ─────────────────────────────────────────────────────────────
    function togglePanel() {
        if (state.isExpanded) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function openPanel() {
        if (!elements) return;
        hideBubble(false);
        state.isExpanded = true;

        const panel = document.getElementById('puntico-panel');
        panel.style.display = 'block';
        requestAnimationFrame(() => {
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0) scale(1)';
        });

        // Bounce avatar
        elements.avatarBtn.style.transform = 'scale(0.9)';
        setTimeout(() => { elements.avatarBtn.style.transform = 'scale(1)'; }, 150);
    }

    function closePanel() {
        if (!elements) return;
        state.isExpanded = false;

        const panel = document.getElementById('puntico-panel');
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(12px) scale(0.95)';
        setTimeout(() => { panel.style.display = 'none'; }, 300);
    }

    // ─────────────────────────────────────────────────────────────
    // RESPONSIVE HANDLER
    // ─────────────────────────────────────────────────────────────
    function handleResize() {
        if (!elements) return;
        const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
        const size = isMobile ? CONFIG.MOBILE_SIZE : CONFIG.DESKTOP_SIZE;
        const margin = isMobile ? '12px' : '24px';
        const bottomMargin = isMobile ? '16px' : '24px';

        elements.avatarBtn.style.width  = `${size}px`;
        elements.avatarBtn.style.height = `${size}px`;
        elements.root.style.right  = margin;
        elements.root.style.bottom = bottomMargin;

        // Store device pref
        try {
            localStorage.setItem('puntico_device', isMobile ? 'mobile' : 'desktop');
        } catch(e) {}
    }

    // ─────────────────────────────────────────────────────────────
    // EVENT LISTENERS
    // ─────────────────────────────────────────────────────────────
    function attachEvents() {
        // Inactivity
        ['mousemove', 'keydown', 'scroll', 'click', 'touchstart'].forEach(evt => {
            document.addEventListener(evt, resetInactivityTimer, { passive: true });
        });

        // Resize
        window.addEventListener('resize', handleResize);

        // Scroll — reposition if needed
        window.addEventListener('scroll', () => {
            // Check for other floating elements (e.g. cart drawer)
            const cart = document.getElementById('cart-drawer');
            if (cart && cart.classList.contains('open')) {
                if (elements) elements.root.style.right = '340px';
            } else {
                if (elements) {
                    const isMobile = window.innerWidth < CONFIG.MOBILE_BREAKPOINT;
                    elements.root.style.right = isMobile ? '12px' : '24px';
                }
            }
        }, { passive: true });
    }

    // ─────────────────────────────────────────────────────────────
    // INIT
    // ─────────────────────────────────────────────────────────────
    function init() {
        // Don't run on dashboard
        if (window.location.pathname.includes('dashboard') ||
            window.location.pathname.includes('edit-edition')) return;

        state.currentContext = detectContext();
        elements = createAvatar();

        attachEvents();
        resetInactivityTimer();

        // Show welcome message after 3 seconds
        setTimeout(() => {
            const msg = getNextMessage(state.currentContext);
            if (msg) showBubble(msg);
        }, 3000);
    }

    // Wait for DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
