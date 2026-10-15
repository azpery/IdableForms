/** Transforme un lien YouTube classique (watch, youtu.be, shorts) en lien intégrable. */
export function toEmbedUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return `https://www.youtube.com/embed${parsed.pathname}`;
    if (host === 'youtube.com') {
      if (parsed.pathname === '/watch' && parsed.searchParams.get('v')) {
        return `https://www.youtube.com/embed/${parsed.searchParams.get('v')}`;
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return `https://www.youtube.com/embed/${parsed.pathname.split('/')[2]}`;
      }
    }
  } catch {
    // URL invalide : on la renvoie telle quelle
  }
  return url;
}
