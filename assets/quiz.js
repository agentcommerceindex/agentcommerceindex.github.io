// Selbsttest: läuft nur im Browser, speichert und sendet nichts.
(function () {
  var form = document.getElementById('quiz');
  if (!form) return;
  var t = form.dataset;
  var result = document.getElementById('quiz-result');
  var hint = form.querySelector('.hint');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var qs = form.querySelectorAll('fieldset');
    var total = 0, answered = 0, gaps = [];
    qs.forEach(function (q, i) {
      var c = q.querySelector('input:checked');
      if (!c) return;
      answered++;
      var v = Number(c.value);
      total += v;
      if (v < 2) gaps.push({ i: i, v: v, fix: q.dataset.fix });
    });
    if (answered < qs.length) {
      hint.textContent = t.missing.replace('{n}', qs.length - answered);
      return;
    }
    hint.textContent = '';
    var score = Math.round(total / (qs.length * 2) * 100);
    gaps.sort(function (a, b) { return a.v - b.v || a.i - b.i; });

    result.querySelector('[data-out="score"]').firstChild.nodeValue = score;
    result.querySelector('[data-out="verdict"]').textContent =
      score >= 80 ? t.high : score >= 50 ? t.mid : t.low;
    var list = result.querySelector('[data-out="fixes"]');
    list.innerHTML = '';
    if (!gaps.length) {
      var li = document.createElement('li');
      li.textContent = t.none;
      list.appendChild(li);
    }
    gaps.slice(0, 3).forEach(function (g) {
      var li = document.createElement('li');
      li.textContent = g.fix;
      list.appendChild(li);
    });
    result.hidden = false;
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
