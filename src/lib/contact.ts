// Datos comerciales compartidos por toda la web.
export const WHATSAPP_NUMBER = '5493813580986';
export const GITHUB_URL = 'https://github.com/franmaxii/';
export const INSTAGRAM_URL = 'https://www.instagram.com/franmaxi.dev/';

export function waLink(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_CALL = waLink('Hola FranMaxi, quiero acordar una llamada para obtener más información sobre los sistemas y servicios.');
export const WA_GENERAL = waLink('Hola FranMaxi, estuve viendo la web y quiero hacer una consulta.');
