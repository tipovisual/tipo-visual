import { emailOrderConfirmation, emailAdminNewOrder } from './email-templates.ts';

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
    const order   = payload.record;
    if (!order) return new Response("No order data", { status: 400 });

    const orderData = {
      customerName:  order.customer_name,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
      orderId:       order.id,
      total:         parseFloat(order.total),
      deliveryType:  order.delivery_type as 'delivery' | 'pickup',
      address:       order.address,
      notes:         order.notes,
    };

    // Email al cliente
    const clientEmail = emailOrderConfirmation(orderData);
    await sendEmail(order.customer_email, clientEmail.subject, clientEmail.html);

    // Email al admin
    const adminEmail = emailAdminNewOrder(orderData);
    await sendEmail(ADMIN_EMAIL, adminEmail.subject, adminEmail.html);

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
