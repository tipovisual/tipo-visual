/**
 * Puntico — Plantillas de Email
 * Proveedor: Resend (resend.com)
 * Plan actual: Free (3,000/mes · 100/día)
 * Siguiente nivel: Pro $20/mes (50,000/mes · sin límite diario)
 *
 * ARQUITECTURA:
 * - baseLayout()      → header + footer reutilizable
 * - btnPrimary()      → botón CTA consistente
 * - statBox()         → stat display
 * - emailXxx()        → plantilla específica por caso
 *
 * EMAILS DISPONIBLES:
 * 1. emailOrderConfirmation()  → cliente al comprar
 * 2. emailAdminNewOrder()      → admin al recibir orden
 * 3. emailWelcome()            → nuevo usuario registrado
 * 4. emailGuideDownloaded()    → confirmación de descarga PDF
 * 5. emailPasswordReset()      → recuperación de contraseña
 */

// ─────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────
const B = {
  navy:    '#211261',
  navyMid: '#312b6d',
  yellow:  '#FFED00',
  magenta: '#E50072',
  cyan:    '#009CC0',
  orange:  '#F49600',
  white:   '#FFFFFF',
  gray:    '#64748B',
  lightBg: '#F5F4FB',
  border:  '#E8E6F7',
};

// ─────────────────────────────────────────────────────────────
// BASE LAYOUT
// ─────────────────────────────────────────────────────────────
function baseLayout(content: string, previewText = ''): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>puntico®</title>
</head>
<body style="margin:0;padding:0;background-color:${B.lightBg};font-family:Arial,Helvetica,sans-serif;">
  ${previewText ? `<span style="display:none;max-height:0;overflow:hidden;opacity:0;">${previewText}</span>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${B.lightBg};">
    <tr><td align="center" style="padding:32px 16px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

        <!-- HEADER -->
        <tr><td style="background-color:${B.navy};border-radius:20px 20px 0 0;padding:28px 32px;text-align:center;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px;">
            <tr>
              <td style="padding:0 3px;"><div style="width:8px;height:8px;border-radius:50%;background:${B.yellow};display:inline-block;"></div></td>
              <td style="padding:0 3px;"><div style="width:8px;height:8px;border-radius:50%;background:${B.orange};display:inline-block;"></div></td>
              <td style="padding:0 3px;"><div style="width:8px;height:8px;border-radius:50%;background:${B.magenta};display:inline-block;"></div></td>
              <td style="padding:0 3px;"><div style="width:8px;height:8px;border-radius:50%;background:#742576;display:inline-block;"></div></td>
              <td style="padding:0 3px;"><div style="width:8px;height:8px;border-radius:50%;background:${B.cyan};display:inline-block;"></div></td>
            </tr>
          </table>
          <p style="margin:0;font-size:22px;font-weight:900;color:${B.white};letter-spacing:-0.03em;">puntico®</p>
          <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:rgba(255,255,255,0.45);letter-spacing:0.2em;text-transform:uppercase;">¡Jugar y aprender es posible!</p>
        </td></tr>

        <!-- CONTENT -->
        <tr><td style="background-color:${B.white};">${content}</td></tr>

        <!-- FOOTER -->
        <tr><td style="background-color:${B.navy};border-radius:0 0 20px 20px;padding:24px 32px;text-align:center;">
          <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px;">
            <tr>
              <td style="padding:0 5px;"><a href="https://instagram.com/punticopty" style="display:inline-block;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.1);text-align:center;line-height:30px;color:${B.white};text-decoration:none;font-size:11px;font-weight:700;">IG</a></td>
              <td style="padding:0 5px;"><a href="https://tiktok.com/@punticopty" style="display:inline-block;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.1);text-align:center;line-height:30px;color:${B.white};text-decoration:none;font-size:11px;font-weight:700;">TK</a></td>
              <td style="padding:0 5px;"><a href="https://wa.me/50761234567" style="display:inline-block;width:30px;height:30px;border-radius:50%;background:rgba(255,255,255,0.1);text-align:center;line-height:30px;color:${B.white};text-decoration:none;font-size:11px;font-weight:700;">WA</a></td>
            </tr>
          </table>
          <p style="margin:0 0 4px;font-size:11px;color:rgba(255,255,255,0.35);">© 2026 puntico® · Viviana Falcón · Todos los derechos reservados</p>
          <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.2);">🇵🇦 Panamá · 🇻🇪 Venezuela · <a href="https://puntico.shop" style="color:${B.yellow};text-decoration:none;">puntico.shop</a></p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function btnPrimary(label: string, url: string, color = B.navy): string {
  return `<table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
    <tr><td style="background-color:${color};border-radius:100px;padding:14px 32px;">
      <a href="${url}" style="color:${B.white};font-size:13px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.08em;">${label}</a>
    </td></tr>
  </table>`;
}

function infoRow(label: string, value: string): string {
  return `<tr>
    <td style="font-size:13px;color:${B.gray};padding:5px 0;">${label}</td>
    <td style="font-size:13px;font-weight:700;color:#1E293B;text-align:right;">${value}</td>
  </tr>`;
}

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────
export interface OrderData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderId: string;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  notes?: string;
  items?: { name: string; quantity: number; subtotal: number }[];
}

export interface EmailResult {
  subject: string;
  html: string;
}

// ─────────────────────────────────────────────────────────────
// 1. CONFIRMACIÓN DE ORDEN — al cliente
// ─────────────────────────────────────────────────────────────
export function emailOrderConfirmation(order: OrderData): EmailResult {
  const shortId   = order.orderId.slice(0, 8).toUpperCase();
  const firstName = order.customerName.split(' ')[0];
  const delivery  = order.deliveryType === 'delivery'
    ? `Envío a domicilio${order.address ? ': ' + order.address : ''}`
    : 'Retiro en local';

  const itemsRows = order.items?.map(i =>
    `<tr>
      <td style="padding:8px 0;font-size:13px;color:#1E293B;border-bottom:1px solid ${B.border};">${i.name} <span style="color:${B.gray};">x${i.quantity}</span></td>
      <td style="padding:8px 0;font-size:13px;font-weight:700;color:${B.navy};text-align:right;border-bottom:1px solid ${B.border};">$${i.subtotal.toFixed(2)}</td>
    </tr>`
  ).join('') ?? '';

  const content = `
    <div style="background:${B.navy};padding:32px;text-align:center;">
      <p style="margin:0 0 6px;font-size:40px;">🎉</p>
      <h1 style="margin:0;font-size:24px;font-weight:900;color:${B.white};">¡Pedido recibido!</h1>
      <p style="margin:8px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">Gracias por tu compra, ${firstName}.</p>
    </div>

    <div style="background:${B.lightBg};border:2px solid ${B.border};margin:24px 32px;border-radius:16px;padding:20px;text-align:center;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${B.navyMid};">Número de orden</p>
      <p style="margin:0;font-size:32px;font-weight:900;color:${B.navy};">#${shortId}</p>
    </div>

    <div style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${B.lightBg};border-radius:16px;">
        <tr><td style="padding:16px 20px;">
          <p style="margin:0 0 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${B.gray};">Detalles</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${infoRow('Cliente', order.customerName)}
            ${infoRow('WhatsApp', order.customerPhone)}
            ${infoRow('Entrega', delivery)}
            ${order.notes ? infoRow('Notas', order.notes) : ''}
          </table>
        </td></tr>
      </table>
    </div>

    ${itemsRows ? `
    <div style="padding:0 32px 24px;">
      <p style="margin:0 0 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${B.gray};">Productos</p>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">${itemsRows}</table>
    </div>` : ''}

    <div style="margin:0 32px 24px;background:${B.navy};border-radius:16px;padding:20px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size:16px;font-weight:900;color:${B.white};">Total</td>
          <td style="font-size:28px;font-weight:900;color:${B.yellow};text-align:right;">$${order.total.toFixed(2)}</td>
        </tr>
      </table>
    </div>

    <div style="margin:0 32px 24px;background:#D1FAE5;border:1.5px solid #A7F3D0;border-radius:16px;padding:20px;">
      <p style="margin:0 0 6px;font-size:13px;font-weight:900;color:#065F46;">¿Qué sigue?</p>
      <p style="margin:0;font-size:13px;color:#047857;line-height:1.6;">En los próximos minutos te escribiremos por WhatsApp al <strong>${order.customerPhone}</strong> para coordinar el pago y la entrega.</p>
    </div>

    <div style="padding:0 32px 32px;text-align:center;">
      ${btnPrimary('Ver tienda', 'https://puntico.shop/store.html')}
    </div>`;

  return {
    subject: `✅ Recibimos tu pedido #${shortId} — puntico®`,
    html: baseLayout(content, `Tu pedido #${shortId} fue recibido. Te contactaremos pronto.`),
  };
}

// ─────────────────────────────────────────────────────────────
// 2. NOTIFICACIÓN AL ADMIN — nueva orden
// ─────────────────────────────────────────────────────────────
export function emailAdminNewOrder(order: OrderData): EmailResult {
  const shortId  = order.orderId.slice(0, 8).toUpperCase();
  const delivery = order.deliveryType === 'delivery'
    ? `Domicilio${order.address ? ': ' + order.address : ''}`
    : 'Retiro en local';
  const waMsg    = encodeURIComponent(`Hola ${order.customerName}, te escribimos de puntico® sobre tu pedido #${shortId}.`);
  const waLink   = `https://wa.me/${order.customerPhone.replace(/\D/g, '')}?text=${waMsg}`;

  const content = `
    <div style="background:${B.magenta};padding:12px 32px;text-align:center;">
      <p style="margin:0;font-size:11px;font-weight:900;color:${B.white};text-transform:uppercase;letter-spacing:0.15em;">🛒 Nueva orden recibida</p>
    </div>

    <div style="padding:28px 32px;text-align:center;">
      <p style="margin:0;font-size:40px;font-weight:900;color:${B.navy};">#${shortId}</p>
      <p style="margin:4px 0 0;font-size:32px;font-weight:900;color:${B.magenta};">$${order.total.toFixed(2)}</p>
    </div>

    <div style="padding:0 32px 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${B.lightBg};border-radius:16px;">
        <tr><td style="padding:20px;">
          <p style="margin:0 0 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${B.gray};">Datos del cliente</p>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${infoRow('Nombre', order.customerName)}
            ${infoRow('Email', order.customerEmail)}
            ${infoRow('WhatsApp', order.customerPhone)}
            ${infoRow('Entrega', delivery)}
            ${order.notes ? infoRow('Notas', order.notes) : ''}
          </table>
        </td></tr>
      </table>
    </div>

    <div style="padding:0 32px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right:6px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="background:#25D366;border-radius:100px;padding:13px;text-align:center;">
                <a href="${waLink}" style="color:${B.white};font-size:12px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.08em;">WhatsApp →</a>
              </td></tr>
            </table>
          </td>
          <td style="padding-left:6px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="background:${B.navy};border-radius:100px;padding:13px;text-align:center;">
                <a href="https://puntico.shop/dashboard.html" style="color:${B.white};font-size:12px;font-weight:900;text-decoration:none;text-transform:uppercase;letter-spacing:0.08em;">Dashboard →</a>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </div>`;

  return {
    subject: `🛒 Nueva orden #${shortId} — $${order.total.toFixed(2)} — ${order.customerName}`,
    html: baseLayout(content, `Nueva orden de ${order.customerName} por $${order.total.toFixed(2)}`),
  };
}

// ─────────────────────────────────────────────────────────────
// 3. BIENVENIDA — nuevo usuario registrado
// ─────────────────────────────────────────────────────────────
export function emailWelcome(name: string): EmailResult {
  const firstName = name.split(' ')[0];

  const content = `
    <div style="background:${B.navy};padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:48px;">🎴</p>
      <h1 style="margin:0;font-size:24px;font-weight:900;color:${B.white};">¡Bienvenido, ${firstName}!</h1>
      <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">Ya formas parte de la familia puntico®</p>
    </div>

    <div style="padding:32px 32px 20px;">
      <p style="margin:0 0 14px;font-size:15px;color:#1E293B;line-height:1.7;">puntico® nació para reconectar a las familias latinoamericanas con su cultura e identidad a través del juego.</p>
      <p style="margin:0;font-size:15px;color:#1E293B;line-height:1.7;">Desde hoy puedes <strong>jugar en línea</strong>, <strong>comprar el juego físico</strong> y descargar materiales educativos gratuitos.</p>
    </div>

    <div style="margin:0 32px 20px;background:${B.lightBg};border-radius:16px;overflow:hidden;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="text-align:center;padding:16px;border-right:1px solid ${B.border};">
            <p style="margin:0;font-size:24px;font-weight:900;color:${B.navy};">+2.500</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${B.gray};">Familias</p>
          </td>
          <td style="text-align:center;padding:16px;border-right:1px solid ${B.border};">
            <p style="margin:0;font-size:24px;font-weight:900;color:${B.navy};">Top 10</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${B.gray};">Bridge for Billions</p>
          </td>
          <td style="text-align:center;padding:16px;">
            <p style="margin:0;font-size:24px;font-weight:900;color:${B.navy};">2</p>
            <p style="margin:4px 0 0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:${B.gray};">Países</p>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding:0 32px 16px;text-align:center;">
      ${btnPrimary('Ir a mi perfil', 'https://puntico.shop/profile.html')}
    </div>

    <div style="margin:16px 32px 32px;border-left:4px solid ${B.navy};padding:16px 20px;background:${B.lightBg};border-radius:0 12px 12px 0;">
      <p style="margin:0;font-size:13px;color:#1E293B;font-style:italic;line-height:1.6;">"Lo que realmente nos une es mucho más fuerte que lo que nos separa."</p>
      <p style="margin:8px 0 0;font-size:11px;font-weight:700;color:${B.navy};text-transform:uppercase;letter-spacing:0.1em;">— Viviana Falcón, Fundadora</p>
    </div>`;

  return {
    subject: `¡Bienvenido a puntico®, ${firstName}! 🎴`,
    html: baseLayout(content, `Bienvenido ${firstName}. Ya puedes jugar, comprar y descargar materiales gratuitos.`),
  };
}

// ─────────────────────────────────────────────────────────────
// 4. GUÍA DESCARGADA — confirmación
// ─────────────────────────────────────────────────────────────
export function emailGuideDownloaded(name: string): EmailResult {
  const firstName = name.split(' ')[0];

  const content = `
    <div style="background:${B.navy};padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:48px;">🎁</p>
      <h1 style="margin:0;font-size:24px;font-weight:900;color:${B.white};">¡Tu guía está lista!</h1>
      <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">${firstName}, descargaste la Guía de Actividades para Niños</p>
    </div>

    <div style="padding:28px 32px 20px;text-align:center;">
      <p style="margin:0;font-size:15px;color:#1E293B;line-height:1.7;">Tu descarga comenzó automáticamente. Si no la encuentras, revisa tu carpeta de <strong>Descargas</strong> o accede desde tu perfil.</p>
    </div>

    <div style="margin:0 32px 20px;background:${B.navy};border-radius:16px;padding:24px;text-align:center;">
      <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:${B.yellow};">Guía de Actividades</p>
      <p style="margin:0;font-size:18px;font-weight:900;color:${B.white};">Para Niños · puntico®</p>
      <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.45);">Material educativo gratuito</p>
    </div>

    <div style="padding:0 32px 20px;text-align:center;">
      ${btnPrimary('Ir a Descargables', 'https://puntico.shop/profile.html')}
    </div>

    <div style="margin:8px 32px 32px;background:${B.lightBg};border:2px solid ${B.border};border-radius:16px;padding:24px;text-align:center;">
      <p style="margin:0 0 6px;font-size:14px;font-weight:900;color:${B.navy};">¿Te gustó la guía?</p>
      <p style="margin:0 0 16px;font-size:13px;color:${B.gray};">Lleva la experiencia completa a tu mesa con el juego físico.</p>
      ${btnPrimary('Ver la tienda →', 'https://puntico.shop/store.html', B.magenta)}
    </div>`;

  return {
    subject: `🎁 Tu Guía de Actividades está lista — puntico®`,
    html: baseLayout(content, `${firstName}, tu guía de actividades fue descargada exitosamente.`),
  };
}

// ─────────────────────────────────────────────────────────────
// 5. RECUPERACIÓN DE CONTRASEÑA
// ─────────────────────────────────────────────────────────────
export function emailPasswordReset(name: string, resetUrl: string): EmailResult {
  const firstName = name.split(' ')[0];

  const content = `
    <div style="background:${B.navy};padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;font-size:48px;">🔑</p>
      <h1 style="margin:0;font-size:24px;font-weight:900;color:${B.white};">Restablece tu contraseña</h1>
      <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.6);">Recibimos una solicitud para tu cuenta</p>
    </div>

    <div style="padding:32px 32px 24px;">
      <p style="margin:0 0 14px;font-size:15px;color:#1E293B;line-height:1.7;">Hola ${firstName}, recibimos una solicitud para restablecer la contraseña de tu cuenta en puntico®.</p>
      <p style="margin:0;font-size:15px;color:#1E293B;line-height:1.7;">Presiona el botón para crear una nueva contraseña. Este enlace expira en <strong>24 horas</strong>.</p>
    </div>

    <div style="padding:0 32px 24px;text-align:center;">
      ${btnPrimary('Restablecer contraseña', resetUrl)}
    </div>

    <div style="margin:0 32px 32px;background:#FEF2F2;border:1.5px solid #FECACA;border-radius:16px;padding:16px 20px;">
      <p style="margin:0;font-size:12px;color:#991B1B;line-height:1.6;">⚠️ Si no solicitaste este cambio, ignora este correo. Tu contraseña no será modificada.</p>
    </div>`;

  return {
    subject: `🔑 Restablece tu contraseña — puntico®`,
    html: baseLayout(content, `${firstName}, recibimos una solicitud para restablecer tu contraseña.`),
  };
}
