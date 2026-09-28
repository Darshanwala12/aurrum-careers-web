<?php get_header(); ?>
<main class="aurrum-page aurrum-form-page">
  <p class="eyebrow">CV CHECKLIST</p><h1>Check your CV before you apply.</h1><p>Give us context about your next move and attach your CV if you would like us to review it.</p>
  <form class="aurrum-form" data-aurrum-form="checklist" enctype="multipart/form-data" novalidate>
    <label>Name <input name="name" autocomplete="name" required></label>
    <label>Email <input type="email" name="email" autocomplete="email" required></label>
    <label>Target role <input name="target_role" required></label>
    <label>Career stage <select name="career_stage" required><option value="">Choose one</option><option>Student</option><option>Graduate</option><option>Early-career professional</option><option>Job changer</option><option>Career changer</option><option>Passive job seeker</option></select></label>
    <label>Biggest job-search challenge <textarea name="biggest_challenge" rows="5"></textarea></label>
    <label>CV file <input type="file" name="cv" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"><small>Optional. PDF, DOC, or DOCX, up to 5MB.</small></label>
    <label class="aurrum-honeypot" aria-hidden="true">Company <input name="company" tabindex="-1" autocomplete="off"></label>
    <button class="button" type="submit">Get Started</button><p class="aurrum-form__status" aria-live="polite"></p>
  </form>
</main>
<?php get_footer(); ?>
