<?php
// Image de partage d'un questionnaire sans image : son titre sur le fond aux couleurs du site (1200 × 630).
require __DIR__ . '/lib.php';

$id = isset($_GET['id']) ? $_GET['id'] : '';
$form = load_form($id);

header('Content-Type: image/png');
header('Cache-Control: public, max-age=86400');

if (!$form) {
    readfile(__DIR__ . '/../assets/og-default.png');
    exit;
}

$file = cache_dir() . "/image-$id-" . image_version($form) . '.png';
if (!is_file($file)) {
    render_image($form, $file);
}
readfile($file);

function render_image($form, $file)
{
    $bold = __DIR__ . '/fonts/LeagueSpartan-Bold.ttf';
    $semi = __DIR__ . '/fonts/BarlowSemiCondensed-SemiBold.ttf';
    $image = imagecreatefrompng(__DIR__ . '/background.png');
    $ink = imagecolorallocate($image, 0x1c, 0x19, 0x17);
    $coral = imagecolorallocate($image, 0xd6, 0x3d, 0x28);
    $muted = imagecolorallocate($image, 0x78, 0x71, 0x6c);

    $left = 80;
    $width = 960;
    $title = plain_text($form['title'], 140);

    // Plus grande taille de titre qui tient sur 3 lignes (GD compte en points : 1 pt = 4/3 px)
    foreach (array(52, 48, 44, 40, 36) as $size) {
        $lines = wrap_text($title, $bold, $size, $width);
        if (count($lines) <= 3) break;
    }
    if (count($lines) > 3) {
        $lines = array_slice($lines, 0, 3);
        $lines[2] = rtrim($lines[2], " ,;:.-") . '…';
    }

    draw_spaced($image, 19, $left, 122, $coral, $semi, 'QUESTIONNAIRE', 4);
    $lineHeight = (int) round($size * 4 / 3 * 1.08);
    $y = 122 + 28 + (int) round($size * 4 / 3 * 0.85);
    foreach ($lines as $line) {
        imagettftext($image, $size, 0, $left, $y, $ink, $bold, $line);
        $y += $lineHeight;
    }

    $count = count_questions($form['questions']);
    if ($count > 0) {
        $meta = "$count question" . ($count > 1 ? 's' : '');
        imagettftext($image, 19, 0, $left, $y - $lineHeight + (int) round($size * 4 / 3 * 0.3) + 48, $muted, $semi, $meta);
    }

    imagepng($image, $file, 6);
    if (PHP_VERSION_ID < 80000) imagedestroy($image); // inutile (et obsolète) depuis PHP 8
}

/** Découpe le texte en lignes d'au plus $width pixels. */
function wrap_text($text, $font, $size, $width)
{
    $lines = array();
    $line = '';
    foreach (preg_split('/\s+/u', $text) as $word) {
        $candidate = $line === '' ? $word : "$line $word";
        $box = imagettfbbox($size, 0, $font, $candidate);
        if ($box[2] - $box[0] > $width && $line !== '') {
            $lines[] = $line;
            $line = $word;
        } else {
            $line = $candidate;
        }
    }
    if ($line !== '') $lines[] = $line;
    return $lines;
}

/** Texte espacé (GD ne gère pas l'espacement des lettres) : lettre par lettre, $tracking pixels entre chacune. */
function draw_spaced($image, $size, $x, $y, $color, $font, $text, $tracking)
{
    foreach (preg_split('//u', $text, -1, PREG_SPLIT_NO_EMPTY) as $char) {
        $box = imagettftext($image, $size, 0, $x, $y, $color, $font, $char);
        $x = $box[2] + $tracking;
    }
}
