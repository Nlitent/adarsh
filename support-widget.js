(() => {
  'use strict';
  if (document.getElementById('ae-support-root')) return;
  const config = window.ADARSH_SUPPORT_CONFIG || {};
  const apiBase = String(config.apiBaseUrl || '').replace(/\/$/, '');
  const contact = { phone: '+91 9909943310, +91 9662503310', email: 'adarshelectricals2019@gmail.com' };
  const root = document.createElement('div'); root.id = 'ae-support-root';
  root.innerHTML = `
    <button id="ae-support-launch" type="button" aria-expanded="false" aria-controls="ae-support-panel"><span class="ae-dot"></span><span>AI Support / सहायता</span></button>
    <section id="ae-support-panel" aria-label="Adarsh Electricals customer support" aria-hidden="true">
      <header class="ae-head"><div class="ae-brandmark">AE</div><div class="ae-headcopy"><strong>Adarsh Electricals</strong><small>Customer Support · English / हिन्दी</small></div><button class="ae-close" type="button" aria-label="Close support">×</button></header>
      <div class="ae-tabs" role="tablist"><button class="ae-tab ae-active" data-view="chat" type="button">Chat / चैट</button><button class="ae-tab" data-view="enquiry" type="button">Enquiry / पूछताछ</button></div>
      <div class="ae-chat-view ae-active"><div class="ae-messages" aria-live="polite"><div class="ae-msg ae-bot">Hello! Welcome to Adarsh Electricals. 👋\nNamaste! Aapko kis type ke electrical panel ya service ke baare mein jaankari chahiye?</div><div class="ae-quick"><button type="button" data-question="Tell me about LT panels">LT Panels</button><button type="button" data-question="Tell me about MCC panels">MCC Panels</button><button type="button" data-question="I need a custom quotation">Custom quotation</button><button type="button" data-question="How can I contact your team?">Contact us</button></div></div><form class="ae-compose"><input name="message" aria-label="Your message" placeholder="Type your question… / सवाल लिखें" autocomplete="off" required maxlength="1500"><button class="ae-send" type="submit">Send</button></form></div>
      <div class="ae-enquiry-view"><form class="ae-form" id="ae-lead-form"><p>Share your requirements and the team can follow up. Apni enquiry details yahan submit karein.</p><label class="ae-field"><span>Name / नाम *</span><input name="name" required maxlength="100" autocomplete="name"></label><label class="ae-field"><span>Phone / फोन *</span><input name="phone" required maxlength="25" autocomplete="tel" inputmode="tel"></label><label class="ae-field"><span>Email (optional)</span><input name="email" type="email" maxlength="150" autocomplete="email"></label><label class="ae-field"><span>Requirement / जरूरत *</span><select name="topic" required><option value="">Select a requirement</option><option>LT Panel</option><option>MCC Panel</option><option>PCC Panel</option><option>APFC Panel</option><option>DG Synchronizing Panel</option><option>Fire Control Panel</option><option>Custom electrical solution</option><option>Other enquiry</option></select></label><label class="ae-field"><span>Message / विवरण *</span><textarea name="message" required maxlength="3000" placeholder="Project, load requirements, quantity, location…"></textarea></label><button class="ae-submit" type="submit">Submit enquiry / भेजें</button><div class="ae-status" aria-live="polite"></div></form></div>
      <div class="ae-foot">For urgent help: <a href="tel:+919909943310">+91 9909943310</a> · <a href="mailto:adarshelectricals2019@gmail.com">Email us</a></div>
    </section>`;
  document.body.appendChild(root);
  const panel = root.querySelector('#ae-support-panel'), launch = root.querySelector('#ae-support-launch');
  const closeBtn = root.querySelector('.ae-close');
  const open = () => { panel.classList.add('ae-open'); panel.setAttribute('aria-hidden','false'); launch.setAttribute('aria-expanded','true'); };
  const close = () => { panel.classList.remove('ae-open'); panel.setAttribute('aria-hidden','true'); launch.setAttribute('aria-expanded','false'); launch.focus(); };
  launch.addEventListener('click', () => panel.classList.contains('ae-open') ? close() : open()); closeBtn.addEventListener('click', close);
  root.querySelectorAll('.ae-tab').forEach(btn => btn.addEventListener('click', () => {
    root.querySelectorAll('.ae-tab').forEach(b => b.classList.toggle('ae-active', b === btn));
    root.querySelector('.ae-chat-view').classList.toggle('ae-active', btn.dataset.view === 'chat');
    root.querySelector('.ae-enquiry-view').classList.toggle('ae-active', btn.dataset.view === 'enquiry');
  }));
  const messages = root.querySelector('.ae-messages');
  function addMessage(text, who='bot') { const el=document.createElement('div'); el.className='ae-msg '+(who==='user'?'ae-user':'ae-bot'); el.textContent=text; messages.appendChild(el); messages.scrollTop=messages.scrollHeight; return el; }
  async function request(path, body) {
    if (!apiBase) throw new Error('Support backend is not configured yet. Please call ' + contact.phone + ' or email ' + contact.email + '.');
    const response = await fetch(apiBase + path, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Unable to send request right now. Please call or email our team.');
    return data;
  }
  async function sendChat(text) {
    addMessage(text,'user'); const typing=addMessage('One moment… / एक क्षण…');
    try { const data=await request('/api/chat',{message:text,language:/[\u0900-\u097F]/.test(text)?'hi':'auto'}); typing.textContent=data.reply || 'Please contact our team for help.'; }
    catch (err) { typing.textContent = apiBase ? (err.message || 'Sorry, support is temporarily unavailable.') : 'The live AI assistant is not connected yet. For help now, call ' + contact.phone + ' or email ' + contact.email + '. You can still prepare an enquiry in the Enquiry tab.'; }
  }
  root.querySelector('.ae-compose').addEventListener('submit', async e => { e.preventDefault(); const input=e.currentTarget.elements.message; const text=input.value.trim(); if(!text)return; input.value=''; await sendChat(text); });
  root.querySelectorAll('[data-question]').forEach(btn => btn.addEventListener('click', () => sendChat(btn.dataset.question)));
  const leadForm=root.querySelector('#ae-lead-form'), status=leadForm.querySelector('.ae-status');
  leadForm.addEventListener('submit', async e => {
    e.preventDefault(); status.className='ae-status'; status.textContent='Sending… / भेज रहे हैं…';
    const fd=new FormData(leadForm); const payload=Object.fromEntries(fd.entries());
    try { const data=await request('/api/leads',payload); status.className='ae-status ae-success'; status.textContent=data.message || 'Thank you! Your enquiry has been submitted.'; leadForm.reset(); }
    catch(err) { status.className='ae-status ae-error'; status.textContent=apiBase ? (err.message || 'Submission failed. Please call/email us.') : 'Online submission is not active yet. Please call ' + contact.phone + ' or email ' + contact.email + '. Your form has not been sent.'; }
  });
  document.addEventListener('keydown', e => { if(e.key==='Escape' && panel.classList.contains('ae-open')) close(); });
})();
