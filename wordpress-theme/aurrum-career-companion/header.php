<?php if (!defined('ABSPATH')) exit; ?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<header class="aurrum-header">
  <div class="aurrum-brand"><?php if (has_custom_logo()) { the_custom_logo(); } else { ?><a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a><?php } ?></div>
  <nav aria-label="<?php esc_attr_e('Primary navigation', AURRUM_TEXT_DOMAIN); ?>">
    <ul><li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li><li><a href="<?php echo esc_url(home_url('/about/')); ?>">About</a></li><li><a href="<?php echo esc_url(home_url('/contact/')); ?>">Contact</a></li></ul>
  </nav>
</header>
