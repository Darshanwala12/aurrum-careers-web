<?php get_header(); ?>
<main class="aurrum-page aurrum-form-page">
  <p class="eyebrow">CONTACT</p><h1>Start with a conversation.</h1><p>Tell us what you need and the Aurrum team will get back to you.</p>
  <form class="aurrum-form" data-aurrum-form="contact" novalidate>
    <label>Name <input name="name" autocomplete="name" required></label>
    <label>Email <input type="email" name="email" autocomplete="email" required></label>
    <label>Phone <input type="tel" name="phone" autocomplete="tel"></label>
    <label>How can we help? <textarea name="message" rows="6" required></textarea></label>
    <label class="aurrum-honeypot" aria-hidden="true">Company <input name="company" tabindex="-1" autocomplete="off"></label>
    <button class="button" type="submit">Send message</button><p class="aurrum-form__status" aria-live="polite"></p>
  </form>
</main>
<?php get_footer(); ?>
