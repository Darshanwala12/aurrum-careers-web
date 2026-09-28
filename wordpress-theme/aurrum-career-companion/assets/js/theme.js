(() => {
  const request = async (route, body, multipart = false) => {
    const response = await fetch(`${aurrumTheme.restUrl}${route}`, {
      method: 'POST',
      headers: multipart ? { 'X-Aurrum-Nonce': aurrumTheme.nonce } : { 'Content-Type': 'application/json', 'X-Aurrum-Nonce': aurrumTheme.nonce },
      body: multipart ? body : JSON.stringify(body),
    });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'We could not send that right now.');
    return payload;
  };

  document.querySelectorAll('[data-aurrum-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = form.querySelector('.aurrum-form__status');
      const button = form.querySelector('button[type="submit"]');
      if (!form.reportValidity()) return;
      button.disabled = true; status.textContent = 'Sending…'; status.dataset.state = 'pending';
      try {
        const data = new FormData(form);
        const body = form.dataset.aurrumForm === 'checklist' ? data : Object.fromEntries(data.entries());
        const payload = await request(form.dataset.aurrumForm, body, form.dataset.aurrumForm === 'checklist');
        status.textContent = payload.message; status.dataset.state = 'success'; form.reset();
      } catch (error) {
        status.textContent = error.message; status.dataset.state = 'error';
      } finally { button.disabled = false; }
    });
  });

  const chat = document.createElement('aside');
  chat.className = 'aurrum-zenz';
  chat.innerHTML = '<header><span class="aurrum-zenz__avatar" aria-hidden="true">Z</span><strong>Zenz</strong><button class="aurrum-zenz__voice" type="button">Voice on</button></header><p class="aurrum-zenz__message"></p><form><input aria-label="Ask Zenz" placeholder="Ask Zenz a career question"><button class="aurrum-zenz__send">Ask</button></form>';
  document.body.append(chat);
  const message = chat.querySelector('.aurrum-zenz__message'); message.textContent = aurrumTheme.welcome;
  let voice = true;
  chat.querySelector('.aurrum-zenz__voice').addEventListener('click', (event) => { voice = !voice; event.currentTarget.textContent = voice ? 'Voice on' : 'Voice off'; });
  chat.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault(); const input = chat.querySelector('input'); const value = input.value.trim(); if (!value) return;
    message.textContent = 'Zenz is thinking…';
    try {
      const data = await request('chat', { message: value });
      message.textContent = data.message;
      if (voice && 'speechSynthesis' in window) { speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(data.message); utterance.lang = 'en-GB'; speechSynthesis.speak(utterance); }
    } catch (error) { message.textContent = error.message; }
    input.value = '';
  });
})();
