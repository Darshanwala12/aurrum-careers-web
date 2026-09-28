<footer class="aurrum-footer">
  <div class="aurrum-footer__inner">
    <section class="aurrum-footer__brand">
      <div class="aurrum-brand"><?php if (has_custom_logo()) { the_custom_logo(); } else { ?><a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a><?php } ?></div>
      <p><?php esc_html_e('Career direction, stronger applications, and support when every move matters.', AURRUM_TEXT_DOMAIN); ?></p>
    </section>
    <nav class="aurrum-footer__nav" aria-label="<?php esc_attr_e('Footer navigation', AURRUM_TEXT_DOMAIN); ?>">
      <a href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Home', AURRUM_TEXT_DOMAIN); ?></a>
      <a href="<?php echo esc_url(home_url('/about/')); ?>"><?php esc_html_e('About', AURRUM_TEXT_DOMAIN); ?></a>
      <a href="<?php echo esc_url(home_url('/contact/')); ?>"><?php esc_html_e('Contact', AURRUM_TEXT_DOMAIN); ?></a>
    </nav>
    <section class="aurrum-footer__cta"><p><?php esc_html_e('Ready for a clearer next step?', AURRUM_TEXT_DOMAIN); ?></p><a class="button" href="<?php echo esc_url(home_url('/15-days-free-trial/')); ?>"><?php esc_html_e('Start free trial', AURRUM_TEXT_DOMAIN); ?></a></section>
  </div>
  <div class="aurrum-footer__legal"><span>© <?php echo esc_html(wp_date('Y')); ?> <?php bloginfo('name'); ?></span><span><?php esc_html_e('All rights reserved.', AURRUM_TEXT_DOMAIN); ?></span></div>
</footer>
<?php wp_footer(); ?>
</body></html>
