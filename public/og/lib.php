<?php
// Partage sur les réseaux sociaux : les robots (Facebook, WhatsApp, LinkedIn, X…) n'exécutent pas le
// JavaScript. Ces scripts complètent donc côté serveur les balises de la page d'un questionnaire.
// Compatible PHP 7.2 (version d'alwaysdata).

// Un avertissement PHP affiché corromprait la page ou l'image renvoyée.
ini_set('display_errors', '0');

const SITE_URL = 'https://idableform.robin-delaporte.fr';
const API_URL = 'https://idableformserver.robin-delaporte.fr';
const SITE_NAME = 'IdableForm';
const CACHE_SECONDS = 300;

function cache_dir()
{
    $dir = __DIR__ . '/cache';
    if (!is_dir($dir)) @mkdir($dir, 0700);
    return $dir;
}

function is_form_id($id)
{
    return is_string($id) && preg_match('/^[0-9a-f]{24}$/', $id) === 1;
}

/** Formulaire publié par l'API (mis en cache quelques minutes), ou null s'il est introuvable. */
function load_form($id)
{
    if (!is_form_id($id)) return null;
    $file = cache_dir() . "/form-$id.json";
    if (is_file($file) && filemtime($file) > time() - CACHE_SECONDS) {
        $cached = json_decode(file_get_contents($file), true);
        return $cached ? $cached : null;
    }
    $json = http_get(API_URL . "/api/form/get/$id");
    $data = $json === null ? null : json_decode($json, true);
    $form = isset($data['form']['_id']) ? $data['form'] : null;
    // L'API ne répond pas : on garde l'ancienne version si on en a une.
    if ($json === null && is_file($file)) {
        $cached = json_decode(file_get_contents($file), true);
        return $cached ? $cached : null;
    }
    @file_put_contents($file, json_encode($form));
    return $form;
}

function http_get($url)
{
    $curl = curl_init($url);
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 2,
        CURLOPT_TIMEOUT => 3,
        CURLOPT_HTTPHEADER => array('Accept: application/json'),
    ));
    $body = curl_exec($curl);
    $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    if (PHP_VERSION_ID < 80000) curl_close($curl); // inutile (et obsolète) depuis PHP 8
    return ($body !== false && $status >= 200 && $status < 500) ? $body : null;
}

/** Nombre de questions (étapes auxquelles on répond), parties comprises. */
function count_questions($questions)
{
    $n = 0;
    foreach ($questions as $q) {
        if (in_array($q['type'], array('yesno', 'radio', 'multiple', 'jauge', 'open'), true)) $n++;
        if (!empty($q['steps'])) $n += count_questions(array_filter($q['steps'], 'is_array'));
    }
    return $n;
}

/** Texte brut sur une ligne, coupé proprement à $max caractères. */
function plain_text($text, $max)
{
    $text = html_entity_decode(strip_tags((string) $text), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = trim(preg_replace('/\s+/u', ' ', $text));
    if (mb_strlen($text, 'UTF-8') <= $max) return $text;
    $cut = mb_substr($text, 0, $max - 1, 'UTF-8');
    $space = mb_strrpos($cut, ' ', 0, 'UTF-8');
    if ($space !== false && $space > $max * 0.6) $cut = mb_substr($cut, 0, $space, 'UTF-8');
    return rtrim($cut, " ,;:.-") . '…';
}

/** Empreinte du contenu affiché sur l'image : change quand le titre change (les réseaux gardent l'image en cache). */
function image_version($form)
{
    return substr(md5($form['title'] . '|' . count_questions($form['questions'])), 0, 10);
}
