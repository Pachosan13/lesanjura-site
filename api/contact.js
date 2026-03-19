// Vercel Serverless Function — LeSanjura Contact Form → GHL
const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const LOCATION_ID = "mbNJqtGcYkPgE7reDSgf";

// Custom field IDs created in GHL
const CF_SERVICIO = "1J6ODnsW00LO5OebOXQu";
const CF_MENSAJE = "l8vwMPxbjKvaG1dkfxNG";

// Map form select values → GHL option labels
const SERVICIO_MAP = {
  mediacion: "Mediación de Conflictos",
  conciliacion: "Conciliación",
  arbitraje: "Arbitraje",
  negociacion: "Negociación",
  peritaje: "Peritaje Contable",
  auditoria: "Auditoría Forense",
  reingenieria: "Reingeniería de Negocios",
  otro: "Otro",
};

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const token = process.env.GHL_LESANJURA_KEY;
  if (!token) return res.status(500).json({ error: "Server misconfigured" });

  const { nombre, telefono, email, servicio, mensaje } = req.body || {};

  if (!nombre || !email) {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
  }

  // Split nombre into first/last
  const parts = nombre.trim().split(/\s+/);
  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts.slice(1).join(" ") : "";

  // Build custom fields array
  const customFields = [];
  if (servicio && SERVICIO_MAP[servicio]) {
    customFields.push({ id: CF_SERVICIO, value: SERVICIO_MAP[servicio] });
  }
  if (mensaje) {
    customFields.push({ id: CF_MENSAJE, value: mensaje });
  }

  const body = {
    firstName,
    lastName,
    email,
    phone: telefono || "",
    locationId: LOCATION_ID,
    source: "website",
    tags: ["website-lead"],
    customFields,
  };

  try {
    const resp = await fetch(`${GHL_API}/contacts/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("GHL error:", data);
      return res.status(502).json({ error: "No se pudo procesar la solicitud" });
    }

    return res.status(200).json({ ok: true, contactId: data.contact?.id });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(502).json({ error: "Error de conexión" });
  }
}
