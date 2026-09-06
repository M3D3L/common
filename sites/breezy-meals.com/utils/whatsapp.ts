export function whatsappAppLink(text: string, phone?: string): string {
  const encoded = encodeURIComponent(text.normalize("NFC"));
  const cleanPhone = phone?.replace(/\D/g, "");
  const recipient = cleanPhone ? `phone=${cleanPhone}&` : "";

  return `whatsapp://send?${recipient}text=${encoded}`;
}
