/**
 * Utilitaires de sécurité et d'assainissement pour SoloBar POS
 */

// Assainissement strict pour prévenir toute injection XSS dans le DOM et l'impression
export const escapeHtml = (str: string | number | undefined | null): string => {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Hachage cryptographique du code PIN d'administration (SHA-256)
export const hashPin = async (pin: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(`solobar_salt_2026_${pin}`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Vérification sécurisée du code PIN
export const verifyPin = async (inputPin: string, storedHash?: string): Promise<boolean> => {
  if (!storedHash) return true; // Pas de PIN configuré = accès libre
  const inputHash = await hashPin(inputPin);
  return inputHash === storedHash;
};

// Formatage monétaire sécurisé
export const formatMoney = (amount: number, currency: string = 'FCFA'): string => {
  const rounded = Math.round(amount || 0);
  return `${rounded.toLocaleString('fr-FR')} ${currency}`;
};
