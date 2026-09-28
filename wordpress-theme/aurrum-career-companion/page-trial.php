<?php get_header(); ?>
<main class="aurrum-page aurrum-form-page">
  <p class="eyebrow">15 DAYS FREE TRIAL</p><h1>Give your job search a clearer direction.</h1><p>Share a few details and we will email you with the next step.</p>
  <form class="aurrum-form" data-aurrum-form="trial" novalidate>
    <label>Name <input name="name" autocomplete="name" required></label>
    <label>Email <input type="email" name="email" autocomplete="email" required></label>
    <label>Phone <input type="tel" name="phone" autocomplete="tel"></label>
    <label>Target role <input name="target_role" required></label>
    <label class="aurrum-check"><input type="checkbox" name="consent" value="true" required> I agree that Aurrum Careers may contact me about my trial.</label>
    <label class="aurrum-honeypot" aria-hidden="true">Company <input name="company" tabindex="-1" autocomplete="off"></label>
    <button class="button" type="submit">Start 15 Days Free Trial</button><p class="aurrum-form__status" aria-live="polite"></p>
  </form>
</main>
<?php get_footer(); ?>
