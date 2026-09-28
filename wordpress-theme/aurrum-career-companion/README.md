# Aurrum Careers WordPress Theme

1. Copy `aurrum-career-companion` to `wp-content/themes/`.
2. In WordPress, activate **Aurrum Career Companion**.
3. Set the front page in **Settings > Reading**. The theme creates About, Contact, 15 Days Free Trial, and Checklist Form pages on activation. The header deliberately displays only Home, About, and Contact.

The paper background image is bundled in `assets/images/`.

The bundled Zenz launcher and all forms call local WordPress REST endpoints. Contact, trial, and checklist submissions use nonce validation, honeypot protection, hourly rate limits, sanitization, private WordPress submission storage, and `wp_mail()` notifications to the WordPress administrator email. Checklist CV uploads accept PDF, DOC, and DOCX files up to 5MB and store them in the Media Library.

Configure reliable outbound email on the WordPress host before launch, for example with the host's SMTP service. Replace `aurrum_chat()` with an authenticated AI service when production content requires it.
