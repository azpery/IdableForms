<?php
// Plan du site pour les moteurs de recherche : l'accueil et les questionnaires à la une.
require __DIR__ . '/lib.php';

header('Content-Type: application/xml; charset=utf-8');

$urls = array(SITE_URL . '/');
$json = http_get(API_URL . '/api/form/public');
$data = $json === null ? null : json_decode($json, true);
if (isset($data['forms'])) {
    foreach ($data['forms'] as $form) {
        if (is_form_id($form['_id'])) $urls[] = SITE_URL . '/form/' . $form['_id'];
    }
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $url) {
    echo '  <url><loc>' . htmlspecialchars($url, ENT_XML1, 'UTF-8') . "</loc></url>\n";
}
echo "</urlset>\n";
