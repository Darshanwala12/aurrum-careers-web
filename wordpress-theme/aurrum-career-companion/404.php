<?php get_header(); ?>
<main class="aurrum-page aurrum-not-found">
  <p class="aurrum-eyebrow"><?php esc_html_e('404', 'aurrum-careers'); ?></p>
  <h1><?php esc_html_e('This page is not here.', 'aurrum-careers'); ?></h1>
  <p><?php esc_html_e('Let us take you back to your career journey.', 'aurrum-careers'); ?></p>
  <a class="aurrum-button" href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Go home', 'aurrum-careers'); ?></a>
</main>
<?php get_footer(); ?>
