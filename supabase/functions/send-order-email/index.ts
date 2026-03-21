const RESEND_KEY  = Deno.env.get("RESEND_KEY")!;
const ADMIN_EMAIL = Deno.env.get("ADMIN_EMAIL")!;

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Puntico <pedidos@puntico.shop>",
      to,
      subject,
      html,
    }),
  });
  return res.json();
}

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const order = payload.record;
    if (!order) return new Response("No order data", { status: 400 });

    const shortId  = order.id.slice(0, 8).toUpperCase();
    const delivery = order.delivery_type === "delivery"
      ? `🚚 Envío a domicilio: ${order.address || "Sin dirección"}`
      : "🏪 Retiro en local";

    // ── Email al CLIENTE ──
    await sendEmail(
      order.customer_email,
      `✅ Recibimos tu pedido #${shortId} — Puntico`,
      `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#FFFBEB;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#1E293B;border-radius:24px;padding:32px;text-align:center;margin-bottom:24px;">
      <p style="color:#FCD34D;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Puntico</p>
      <h1 style="color:white;font-size:28px;font-weight:800;margin:0;">¡Pedido recibido!</h1>
      <p style="color:rgba(255,255,255,0.6);font-size:14px;margin:8px 0 0;">Gracias por tu compra, ${order.customer_name.split(" ")[0]}.</p>
    </div>
    <div style="background:white;border:2px solid #FDE68A;border-radius:20px;padding:20px 24px;text-align:center;margin-bottom:16px;">
      <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#92400E;margin:0 0 4px;">Número de orden</p>
      <p style="font-size:28px;font-weight:800;color:#D97706;margin:0;">#${shortId}</p>
    </div>
    <div style="background:white;border:1.5px solid #E7E5E4;border-radius:20px;padding:24px;margin-bottom:16px;">
      <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#64748B;margin:0 0 16px;">Resumen</h3>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:14px;color:#64748B;">Cliente</span>
        <span style="font-size:14px;font-weight:600;">${order.customer_name}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:14px;color:#64748B;">WhatsApp</span>
        <span style="font-size:14px;font-weight:600;">${order.customer_phone}</span>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
        <span style="font-size:14px;color:#64748B;">Entrega</span>
        <span style="font-size:14px;font-weight:600;">${delivery}</span>
      </div>
      <div style="border-top:1.5px solid #F1F5F9;margin:16px 0;"></div>
      <div style="display:flex;justify-content:space-between;">
        <span style="font-size:16px;font-weight:800;">Total</span>
        <span style="font-size:20px;font-weight:800;color:#D97706;">$${parseFloat(order.total).toFixed(2)}</span>
      </div>
    </div>
    <div style="background:#D1FAE5;border:1.5px solid #A7F3D0;border-radius:20px;padding:20px 24px;margin-bottom:24px;">
      <p style="font-size:13px;font-weight:700;color:#065F46;margin:0 0 8px;">¿Qué sigue?</p>
      <p style="font-size:14px;color:#047857;margin:0;line-height:1.6;">
        En los próximos minutos te escribiremos por WhatsApp al <strong>${order.customer_phone}</strong> para coordinar el pago y la entrega.
      </p>
    </div>
    <p style="font-size:12px;color:#94A3B8;text-align:center;margin:0;">© 2026 Puntico · puntico.shop</p>
  </div>
</body>
</html>`
    );

    // ── Email al ADMIN ──
    await sendEmail(
      ADMIN_EMAIL,
      `🛒 Nueva orden #${shortId} — $${parseFloat(order.total).toFixed(2)} — ${order.customer_name}`,
      `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background:#F8FAFC;font-family:Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px;">
    <div style="background:#1E293B;border-radius:16px;padding:24px;margin-bottom:20px;">
      <p style="color:#FCD34D;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 6px;">Nueva orden recibida</p>
      <h1 style="color:white;font-size:24px;font-weight:800;margin:0;">#${shortId}</h1>
    </div>
    <div style="background:white;border:1.5px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:16px;">
      <p style="margin:0 0 8px;font-size:14px;"><strong>Nombre:</strong> ${order.customer_name}</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Email:</strong> ${order.customer_email}</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>WhatsApp:</strong> ${order.customer_phone}</p>
      <p style="margin:0 0 8px;font-size:14px;"><strong>Entrega:</strong> ${delivery}</p>
      ${order.notes ? `<p style="margin:0;font-size:14px;"><strong>Notas:</strong> ${order.notes}</p>` : ""}
    </div>
    <div style="background:white;border:1.5px solid #E2E8F0;border-radius:16px;padding:24px;margin-bottom:16px;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:16px;font-weight:800;">Total</span>
        <span style="font-size:24px;font-weight:800;color:#D97706;">$${parseFloat(order.total).toFixed(2)}</span>
      </div>
    </div>
    <a href="https://puntico.shop/dashboard.html"
       style="display:block;background:#1E293B;color:white;text-align:center;padding:16px;border-radius:14px;font-weight:700;font-size:14px;text-decoration:none;">
      Ver en Dashboard →
    </a>
  </div>
</body>
</html>`
    );

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});
