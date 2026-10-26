<?php
// Page d'un questionnaire (/form/<id>) : l'application Angular habituelle, avec les balises de partage
// (titre, description, image) du questionnaire à la place de celles du site.
require __DIR__ . '/lib.php';

header('Content-Type: text/html; charset=utf-8');
header('Cache-Control: no-cache');

$html = file_get_contents(__DIR__ . '/../index.html');
$id = isset($_GET['id']) ? $_GET['id'] : '';
$form = load_form($id);

if ($form) {
    $e = function ($value) {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    };
    $title = plain_text($form['title'], 90);
    $count = count_questions($form['questions']);
    $description = plain_text(isset($form['description']) ? $form['description'] : '', 200);
    if ($description === '') {
        $description = $count > 0
            ? "Réponds à ce questionnaire de $count question" . ($count > 1 ? 's' : '') . ', en quelques minutes.'
            : 'Réponds à ce questionnaire en quelques minutes.';
    }
    $url = SITE_URL . "/form/$id";
    $image = isset($form['imgUrl']) ? trim($form['imgUrl']) : '';
    $custom = preg_match('#^https?://#i', $image) === 1;
    if (!$custom) $image = SITE_URL . "/og/image.php?id=$id&v=" . image_version($form);

    $tags = array(
        '<title>' . $e("$title · " . SITE_NAME) . '</title>',
        '<meta name="description" content="' . $e($description) . '">',
        // Lien privé (formulaire pas « à la une ») : partageable, mais pas indexé par les moteurs de recherche.
        empty($form['featured']) ? '<meta name="robots" content="noindex">' : '',
        '<link rel="canonical" href="' . $e($url) . '">',
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="' . SITE_NAME . '">',
        '<meta property="og:locale" content="fr_FR">',
        '<meta property="og:url" content="' . $e($url) . '">',
        '<meta property="og:title" content="' . $e($title) . '">',
        '<meta property="og:description" content="' . $e($description) . '">',
        '<meta property="og:image" content="' . $e($image) . '">',
        $custom ? '' : '<meta property="og:image:width" content="1200">',
        $custom ? '' : '<meta property="og:image:height" content="630">',
        '<meta property="og:image:alt" content="' . $e($title) . '">',
        '<meta name="twitter:card" content="summary_large_image">',
    );

    // Retire les balises génériques du site, puis insère celles du questionnaire après le charset.
    $html = preg_replace(array(
        '#<title>.*?</title>\s*#s',
        '#<meta\s+(name|property)="(description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>\s*#',
        '#<link\s+rel="canonical"[^>]*>\s*#',
    ), '', $html);
    $html = preg_replace('#(<meta charset="[^"]*"\s*/?>)#i', "$1\n    " . implode("\n    ", array_filter($tags)), $html, 1);
}

echo $html;
