// Disable right-click on images
document.addEventListener('contextmenu', e => {
  if (e.target.tagName === 'IMG') e.preventDefault();
});

// Contact Modal — shared across all pages
(function () {
  // Inject modal HTML
  const modal = document.createElement('div');
  modal.id = 'contact-modal';
  modal.innerHTML = `
    <div class="cm-overlay" onclick="closeContactModal()"></div>
    <div class="cm-panel">
      <button class="cm-close" onclick="closeContactModal()" aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <h2 class="cm-title">Get In Touch</h2>
      <p class="cm-sub">Fill out the form and I'll get back to you soon.</p>

      <div class="cm-success" id="cm-success" style="display:none;">
        <h3>Message Sent</h3>
        <p>Thanks for reaching out — I'll be in touch soon.</p>
      </div>

      <form class="cm-form" id="cm-form" action="https://formspree.io/f/meedydvq" method="POST">
        <input type="hidden" name="_subject" value="New message from colinpeterman.com" />
        <div class="cm-row">
          <div class="cm-group">
            <label for="cm-first">First Name</label>
            <input type="text" id="cm-first" name="first_name" required />
          </div>
          <div class="cm-group">
            <label for="cm-last">Last Name</label>
            <input type="text" id="cm-last" name="last_name" required />
          </div>
        </div>
        <div class="cm-group">
          <label for="cm-email">Email</label>
          <input type="email" id="cm-email" name="email" required />
        </div>
        <div class="cm-group">
          <label for="cm-phone">Phone</label>
          <input type="tel" id="cm-phone" name="phone" />
        </div>
        <div class="cm-group">
          <label for="cm-message">Message</label>
          <textarea id="cm-message" name="message" required></textarea>
        </div>
        <button type="submit" class="cm-submit">Send Message</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Form submission
  document.getElementById('cm-form').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.cm-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const resp = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (resp.ok) {
        form.style.display = 'none';
        document.getElementById('cm-success').style.display = 'block';
        // Clear licensing inquiry cart after successful send
        if (typeof inquirySet !== 'undefined') {
          inquirySet.clear();
          if (typeof saveInquiry === 'function') saveInquiry();
          if (typeof updateCart === 'function') updateCart();
          document.querySelectorAll('.masonry-item.selected').forEach(el => el.classList.remove('selected'));
        }
      } else {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        alert('Something went wrong. Please email colinpeterman@gmail.com directly.');
      }
    } catch {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      alert('Something went wrong. Please email colinpeterman@gmail.com directly.');
    }
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeContactModal();
  });
})();

function openContactModal(subject) {
  const modal = document.getElementById('contact-modal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  const controls = document.getElementById('inquiry-controls');
  if (controls) controls.style.display = 'none';
  // Reset form if previously submitted
  const form = document.getElementById('cm-form');
  const success = document.getElementById('cm-success');
  const btn = form.querySelector('.cm-submit');
  form.style.display = '';
  success.style.display = 'none';
  btn.textContent = 'Send Message';
  btn.disabled = false;
  // Optional custom subject (e.g. "Licensing Inquiry")
  const subjectField = form.querySelector('input[name="_subject"]');
  if (subjectField) {
    subjectField.value = subject
      ? `${subject} — colinpeterman.com`
      : 'New message from colinpeterman.com';
  }
}

function closeContactModal() {
  document.getElementById('contact-modal').classList.remove('open');
  document.body.style.overflow = '';
  // Restore inquiry controls if there are items in the cart
  const controls = document.getElementById('inquiry-controls');
  if (controls && typeof inquirySet !== 'undefined' && inquirySet.size > 0) {
    controls.style.display = '';
  }
}
