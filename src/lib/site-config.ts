// TODO: substitua pelo número real (formato internacional, sem +)
export const WHATSAPP_NUMBER = "SEUNUMERO";
export const WHATSAPP_MESSAGE = encodeURIComponent(
  "Olá! Quero otimizar meu Google Meu Negócio e atrair mais clientes."
);
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`;
