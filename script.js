(function(){
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');

  // nav: solid on scroll + progress bar
  var nav = document.querySelector('.nav'), bar = document.querySelector('.progress');
  function onScroll(){
    var y = window.scrollY, h = document.documentElement.scrollHeight - innerHeight;
    if (nav) nav.classList.toggle('solid', y > 40);
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // mobile menu
  var mb = document.querySelector('.menu-btn'), links = document.querySelector('.links');
  if (mb) mb.addEventListener('click', function(){
    var o = links.classList.toggle('open'); mb.setAttribute('aria-expanded', o); mb.textContent = o ? '✕' : '☰';
  });
  if (links) links.addEventListener('click', function(e){ if (e.target.tagName === 'A') { links.classList.remove('open'); if (mb) mb.textContent = '☰'; } });

  // counters
  function count(el){
    var to = parseFloat(el.dataset.to), suf = el.dataset.suf || '', t0 = null, dur = 1800;
    if (reduce) { el.textContent = to.toLocaleString('en-US') + suf; return; }
    function step(t){
      if (!t0) t0 = t; var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(to * e).toLocaleString('en-US') + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // reveal on scroll (elements start visible without JS)
  var items = document.querySelectorAll('.rv, [data-to]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(en){
        if (!en.isIntersecting) return;
        var el = en.target;
        if (el.dataset.to) count(el); else el.classList.add('in');
        io.unobserve(el);
      });
    }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
    items.forEach(function(el){ io.observe(el); });
  } else items.forEach(function(el){ el.classList.add('in'); if (el.dataset.to) count(el); });

  // card glare + tilt
  if (!reduce && matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.card').forEach(function(c){
      c.addEventListener('pointermove', function(e){
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%');
        c.style.transform = 'perspective(900px) rotateY(' + (x - .5) * 8 + 'deg) rotateX(' + (.5 - y) * 8 + 'deg) translateY(-6px)';
      });
      c.addEventListener('pointerleave', function(){ c.style.transform = ''; });
    });
  }

  // lightbox
  var lb = document.querySelector('.lb');
  if (lb) {
    var img = lb.querySelector('img');
    document.querySelectorAll('[data-full]').forEach(function(b){
      b.addEventListener('click', function(){ img.src = b.dataset.full; img.alt = b.getAttribute('aria-label') || ''; lb.classList.add('open'); });
    });
    lb.addEventListener('click', function(e){ if (e.target !== img) lb.classList.remove('open'); });
    addEventListener('keydown', function(e){ if (e.key === 'Escape') lb.classList.remove('open'); });
  }

  var yr = document.getElementById('yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
