/** Le CSS de CKEditor est un bundle à part (voir angular.json), chargé seulement là où un éditeur s'affiche. */
export function loadEditorStyles(document: Document) {
  if (document.getElementById('ckeditor5-styles')) return;
  const link = document.createElement('link');
  link.id = 'ckeditor5-styles';
  link.rel = 'stylesheet';
  link.href = 'ckeditor5.css';
  document.head.appendChild(link);
}

/** Contenu saisi dans un éditeur riche (les anciens contenus sont du texte simple). */
export function isHtml(value: string): boolean {
  return /<\/?[a-z][^>]*>/i.test(value);
}

/** Texte simple -> HTML pour l'éditeur riche : une ligne par paragraphe, caractères spéciaux échappés. */
export function plainToHtml(text: string): string {
  if (!text.trim() || isHtml(text)) return text;
  const escape = (line: string) => line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split(/\n+/)
    .filter((line) => line.trim())
    .map((line) => `<p>${escape(line.trim())}</p>`)
    .join('');
}

/** Texte brut d'un contenu HTML (réponse libre mise en forme), pour savoir s'il est vide. */
export function htmlToText(html: string): string {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}
