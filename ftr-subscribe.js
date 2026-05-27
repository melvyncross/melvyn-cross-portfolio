/**
 * ftr-subscribe.js — Footer newsletter subscribe form handler
 * Wires up #ftr-subscribe-form → POST /api/subscribe
 * Back-to-top smooth scroll for #ftr-totop
 */
(function () {

  /* ── Back to top ── */
  var totop = document.getElementById('ftr-totop');
  if (totop) {
    totop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Subscribe form ── */
  var form = document.getElementById('ftr-subscribe-form');
  if (!form) return;

  var input = document.getElementById('ftr-email');
  var msg   = document.getElementById('ftr-form-msg');
  var btn   = form.querySelector('.ftr__btn');

  function showMsg(text, type) {
    msg.textContent = text;
    msg.className   = 'ftr__form-msg ftr__form-msg--' + type;
    msg.hidden      = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = (input ? input.value : '').trim();

    if (!email) {
      showMsg('Please enter your email address.', 'err');
      if (input) input.focus();
      return;
    }

    /* Optimistic UI */
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
    if (msg) { msg.hidden = true; }

    fetch('/api/subscribe', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email: email }),
    })
    .then(function (res) { return res.json().then(function (d) { return { ok: res.ok, data: d }; }); })
    .then(function (r) {
      if (r.ok && r.data.ok) {
        showMsg("You're in — welcome to The Dispatch.", 'ok');
        form.reset();
      } else {
        showMsg(r.data.error || 'Something went wrong. Please try again.', 'err');
      }
    })
    .catch(function () {
      showMsg('Network error. Please check your connection and try again.', 'err');
    })
    .finally(function () {
      if (btn) { btn.disabled = false; btn.textContent = 'Subscribe →'; }
    });
  });

})();
