<?php
declare(strict_types=1);

if (!defined('ABSPATH')) { exit; }

const AURRUM_TEXT_DOMAIN = 'aurrum-career-companion';

function aurrum_setup(): void {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails');
  add_theme_support('custom-logo');
  add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script']);
}
add_action('after_setup_theme', 'aurrum_setup');

function aurrum_register_submission_type(): void {
  register_post_type('aurrum_submission', [
    'labels' => ['name' => __('Aurrum submissions', AURRUM_TEXT_DOMAIN), 'singular_name' => __('Aurrum submission', AURRUM_TEXT_DOMAIN)],
    'public' => false,
    'show_ui' => true,
    'show_in_menu' => true,
    'supports' => ['title', 'custom-fields'],
    'capability_type' => 'post',
    'map_meta_cap' => true,
  ]);
}
add_action('init', 'aurrum_register_submission_type');

function aurrum_assets(): void {
  $version = wp_get_theme()->get('Version');
  wp_enqueue_style('aurrum-career-companion', get_stylesheet_directory_uri() . '/assets/css/theme.css', [], $version);
  wp_enqueue_style('aurrum-career-companion-layout', get_stylesheet_directory_uri() . '/assets/css/layout.css', ['aurrum-career-companion'], $version);
  wp_enqueue_style('aurrum-career-companion-logo-fix', get_stylesheet_directory_uri() . '/assets/css/logo-fix.css', ['aurrum-career-companion-layout'], $version);
  wp_enqueue_script('aurrum-career-companion', get_stylesheet_directory_uri() . '/assets/js/theme.js', [], $version, true);
  wp_localize_script('aurrum-career-companion', 'aurrumTheme', [
    'restUrl' => esc_url_raw(rest_url('aurrum/v1/')),
    'nonce' => wp_create_nonce('aurrum_public_forms'),
    'welcome' => get_theme_mod('aurrum_zenz_welcome', __('Hello, I am Zenz. How can I help with your career today?', AURRUM_TEXT_DOMAIN)),
  ]);
}
add_action('wp_enqueue_scripts', 'aurrum_assets');

function aurrum_customize(WP_Customize_Manager $customizer): void {
  $customizer->add_section('aurrum_zenz', ['title' => __('Zenz chat', AURRUM_TEXT_DOMAIN), 'priority' => 35]);
  $customizer->add_setting('aurrum_zenz_welcome', ['sanitize_callback' => 'sanitize_text_field', 'default' => __('Hello, I am Zenz. How can I help with your career today?', AURRUM_TEXT_DOMAIN)]);
  $customizer->add_control('aurrum_zenz_welcome', ['section' => 'aurrum_zenz', 'label' => __('Welcome message', AURRUM_TEXT_DOMAIN), 'type' => 'text']);
}
add_action('customize_register', 'aurrum_customize');

function aurrum_template_router(string $template): string {
  if (!is_page()) { return $template; }
  $slug = get_post_field('post_name', get_queried_object_id());
  $templates = ['contact' => 'page-contact.php', '15-days-free-trial' => 'page-trial.php', 'free-trial' => 'page-trial.php', 'checklist-form' => 'page-checklist.php', 'checklist' => 'page-checklist.php'];
  $candidate = $templates[$slug] ?? null;
  if ($candidate && file_exists(get_stylesheet_directory() . '/' . $candidate)) { return get_stylesheet_directory() . '/' . $candidate; }
  return $template;
}
add_filter('template_include', 'aurrum_template_router');

function aurrum_ensure_core_pages(): void {
  $pages = [
    'about' => 'About',
    'contact' => 'Contact',
    '15-days-free-trial' => '15 Days Free Trial',
    'checklist-form' => 'Checklist Form',
  ];
  foreach ($pages as $slug => $title) {
    if (!get_page_by_path($slug)) {
      wp_insert_post(['post_type' => 'page', 'post_status' => 'publish', 'post_title' => $title, 'post_name' => $slug]);
    }
  }
}
add_action('after_switch_theme', 'aurrum_ensure_core_pages');

function aurrum_render_header(): void {
  get_header();
}

function aurrum_verify_submission(WP_REST_Request $request): true|WP_Error {
  $nonce = (string) $request->get_header('x_aurrum_nonce');
  if (!wp_verify_nonce($nonce, 'aurrum_public_forms')) { return new WP_Error('aurrum_invalid_nonce', __('Your form session has expired. Refresh the page and try again.', AURRUM_TEXT_DOMAIN), ['status' => 403]); }
  if (trim((string) $request->get_param('company')) !== '') { return new WP_Error('aurrum_spam', __('Unable to send this form.', AURRUM_TEXT_DOMAIN), ['status' => 400]); }
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown');
  $key = 'aurrum_rate_' . md5($ip . gmdate('YmdH'));
  $count = (int) get_transient($key);
  if ($count >= 8) { return new WP_Error('aurrum_rate_limited', __('Please wait a little while before submitting another form.', AURRUM_TEXT_DOMAIN), ['status' => 429]); }
  set_transient($key, $count + 1, HOUR_IN_SECONDS);
  return true;
}

function aurrum_required_email(WP_REST_Request $request, string $field = 'email'): string|WP_Error {
  $email = sanitize_email((string) $request->get_param($field));
  return is_email($email) ? $email : new WP_Error('aurrum_invalid_email', __('Enter a valid email address.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
}

function aurrum_save_submission(string $type, array $fields, ?int $attachment_id = null): int|WP_Error {
  $name = sanitize_text_field((string) ($fields['name'] ?? ''));
  $id = wp_insert_post(['post_type' => 'aurrum_submission', 'post_status' => 'private', 'post_title' => sprintf('%s: %s', ucfirst($type), $name ?: current_time('mysql'))], true);
  if (is_wp_error($id)) { return $id; }
  update_post_meta($id, '_aurrum_type', $type);
  foreach ($fields as $key => $value) { update_post_meta($id, '_aurrum_' . sanitize_key((string) $key), is_scalar($value) ? sanitize_textarea_field((string) $value) : ''); }
  if ($attachment_id) { update_post_meta($id, '_aurrum_cv_attachment', $attachment_id); }
  return $id;
}

function aurrum_notify(string $type, array $fields, ?int $attachment_id = null): bool {
  $lines = [sprintf('New %s submission', $type), ''];
  foreach ($fields as $key => $value) { if ($key !== 'company') { $lines[] = ucwords(str_replace('_', ' ', (string) $key)) . ': ' . sanitize_textarea_field((string) $value); } }
  if ($attachment_id) { $lines[] = 'CV: ' . wp_get_attachment_url($attachment_id); }
  return wp_mail(get_option('admin_email'), sprintf('[Aurrum] New %s submission', $type), implode("\n", $lines), ['Content-Type: text/plain; charset=UTF-8']);
}

function aurrum_contact(WP_REST_Request $request): WP_REST_Response|WP_Error {
  $valid = aurrum_verify_submission($request); if (is_wp_error($valid)) return $valid;
  $email = aurrum_required_email($request); if (is_wp_error($email)) return $email;
  $fields = ['name' => sanitize_text_field((string) $request->get_param('name')), 'email' => $email, 'phone' => sanitize_text_field((string) $request->get_param('phone')), 'message' => sanitize_textarea_field((string) $request->get_param('message'))];
  if (!$fields['name'] || !$fields['message']) return new WP_Error('aurrum_missing_fields', __('Complete your name and message.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
  $id = aurrum_save_submission('contact', $fields); if (is_wp_error($id)) return $id;
  aurrum_notify('contact', $fields);
  return new WP_REST_Response(['message' => __('Thank you. The Aurrum team will be in touch shortly.', AURRUM_TEXT_DOMAIN)], 201);
}

function aurrum_trial(WP_REST_Request $request): WP_REST_Response|WP_Error {
  $valid = aurrum_verify_submission($request); if (is_wp_error($valid)) return $valid;
  $email = aurrum_required_email($request); if (is_wp_error($email)) return $email;
  $fields = ['name' => sanitize_text_field((string) $request->get_param('name')), 'email' => $email, 'phone' => sanitize_text_field((string) $request->get_param('phone')), 'target_role' => sanitize_text_field((string) $request->get_param('target_role')), 'consent' => (string) $request->get_param('consent') === 'true' ? 'yes' : 'no'];
  if (!$fields['name'] || !$fields['target_role'] || $fields['consent'] !== 'yes') return new WP_Error('aurrum_missing_fields', __('Complete all required fields and confirm that we may contact you.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
  $id = aurrum_save_submission('trial', $fields); if (is_wp_error($id)) return $id;
  aurrum_notify('15-day free trial', $fields);
  return new WP_REST_Response(['message' => __('You are on the list. We will email you with the next step for your 15-day free trial.', AURRUM_TEXT_DOMAIN)], 201);
}

function aurrum_checklist(WP_REST_Request $request): WP_REST_Response|WP_Error {
  $valid = aurrum_verify_submission($request); if (is_wp_error($valid)) return $valid;
  $email = aurrum_required_email($request); if (is_wp_error($email)) return $email;
  $fields = ['name' => sanitize_text_field((string) $request->get_param('name')), 'email' => $email, 'target_role' => sanitize_text_field((string) $request->get_param('target_role')), 'career_stage' => sanitize_text_field((string) $request->get_param('career_stage')), 'biggest_challenge' => sanitize_textarea_field((string) $request->get_param('biggest_challenge'))];
  if (!$fields['name'] || !$fields['target_role'] || !$fields['career_stage']) return new WP_Error('aurrum_missing_fields', __('Complete all required checklist fields.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
  $attachment_id = null;
  if (!empty($_FILES['cv'])) {
    $file = $_FILES['cv'];
    if (!empty($file['error'])) return new WP_Error('aurrum_upload_error', __('We could not upload that CV. Please try again.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
    if ((int) $file['size'] > 5 * MB_IN_BYTES) return new WP_Error('aurrum_upload_size', __('Your CV must be 5MB or smaller.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
    require_once ABSPATH . 'wp-admin/includes/file.php'; require_once ABSPATH . 'wp-admin/includes/media.php'; require_once ABSPATH . 'wp-admin/includes/image.php';
    $allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    $type = wp_check_filetype_and_ext($file['tmp_name'], $file['name']);
    if (empty($type['type']) || !in_array($type['type'], $allowed, true)) return new WP_Error('aurrum_upload_type', __('Upload a PDF, DOC, or DOCX CV.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
    $attachment_id = media_handle_upload('cv', 0, [], ['test_form' => false]);
    if (is_wp_error($attachment_id)) return $attachment_id;
  }
  $id = aurrum_save_submission('checklist', $fields, $attachment_id); if (is_wp_error($id)) return $id;
  aurrum_notify('CV checklist', $fields, $attachment_id);
  return new WP_REST_Response(['message' => __('Your checklist is on its way to the team. We will review it and contact you soon.', AURRUM_TEXT_DOMAIN)], 201);
}

function aurrum_chat(WP_REST_Request $request): WP_REST_Response|WP_Error {
  $valid = aurrum_verify_submission($request); if (is_wp_error($valid)) return $valid;
  $question = sanitize_text_field((string) $request->get_param('message'));
  if (!$question) return new WP_Error('aurrum_empty_message', __('Write a question for Zenz.', AURRUM_TEXT_DOMAIN), ['status' => 422]);
  $lower = strtolower($question);
  $answers = ['cv' => __('We tailor your CV and cover letter so your experience is clear, relevant, and ready for the roles you want.', AURRUM_TEXT_DOMAIN), 'interview' => __('We prepare you with realistic practice, focused feedback, and a clear interview strategy.', AURRUM_TEXT_DOMAIN), 'linkedin' => __('We strengthen your LinkedIn profile so recruiters see a consistent, professional story.', AURRUM_TEXT_DOMAIN), 'career' => __('We start with your direction, transferable skills, and target roles, then build a practical plan.', AURRUM_TEXT_DOMAIN)];
  foreach ($answers as $keyword => $answer) { if (str_contains($lower, $keyword)) return new WP_REST_Response(['message' => $answer, 'emotion' => 'encouraging', 'animation' => 'explaining']); }
  return new WP_REST_Response(['message' => __('Tell me where you are in your career and I will help you choose the best next step.', AURRUM_TEXT_DOMAIN), 'emotion' => 'friendly', 'animation' => 'talking']);
}

add_action('rest_api_init', static function (): void {
  foreach (['contact' => 'aurrum_contact', 'trial' => 'aurrum_trial', 'checklist' => 'aurrum_checklist', 'chat' => 'aurrum_chat'] as $route => $callback) {
    register_rest_route('aurrum/v1', '/' . $route, ['methods' => 'POST', 'callback' => $callback, 'permission_callback' => '__return_true']);
  }
});
