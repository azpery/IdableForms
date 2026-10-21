/** Le CSS de CKEditor est un bundle à part (voir angular.json), chargé seulement là où un éditeur s'affiche. */
export function loadEditorStyles(document: Document) {
  if (document.getElementById('ckeditor5-styles')) return;
  const link = document.createElement('link');
  link.id = 'ckeditor5-styles';
  link.rel = 'stylesheet';
  link.href = 'ckeditor5.css';
  document.head.appendChild(link);
}

/** Texte brut d'un contenu HTML (réponse libre mise en forme), pour savoir s'il est vide. */
export function htmlToText(html: string): string {
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}
