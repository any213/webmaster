/* =====================================================
   해솔스타그램 쇼케이스 (선생님이 추가한 연출용 코드)
   - ▶ 만든 과정 : 학생이 쓴 CSS · JS 가 한 줄씩 입력되며 화면이 완성되는 과정을 다시 보여줘요
   - </> 코드 보기 : 이 페이지를 만든 실제 코드를 개발자 화면처럼 보여줘요
   학생 코드는 건드리지 않아요.
   ===================================================== */
(function () {
  if (window.__hsShowcase) return; window.__hsShowcase = true;

  var NAME = (document.title || '').replace(/의 페이지$/, '').trim() || '학생';
  var SELF_RE = /^\s*<script src="showcase\.js"[^>]*><\/script>\s*$/;
  var source = null;            // 실제 파일 코드 (줄 배열)
  var userStyle = null;         // 학생이 쓴 <style>
  var userScript = null;        // 학생이 쓴 <script>
  document.querySelectorAll('style').forEach(function (s) { if (!userStyle && !s.dataset.hs) userStyle = s; });
  document.querySelectorAll('script:not([src])').forEach(function (s) { if (!userScript) userScript = s; });

  // 폰트 (주아체)
  var lk = document.createElement('link');
  lk.rel = 'stylesheet'; lk.href = 'https://fonts.googleapis.com/css2?family=Jua&display=swap';
  document.head.appendChild(lk);

  // 페이지 쪽 보조 스타일 (반짝임 · 엑스레이)
  var pageCss = document.createElement('style'); pageCss.dataset.hs = '1';
  pageCss.textContent =
    '@keyframes hsFlash{0%{outline-color:rgba(255,48,64,0)}20%{outline-color:rgba(255,48,64,1)}100%{outline-color:rgba(255,48,64,0)}}' +
    '.hs-flash{outline:3px solid rgba(255,48,64,0)!important;outline-offset:3px;animation:hsFlash 1.4s ease}' +
    'body.hs-x .profile,body.hs-x .post,body.hs-x .profile *,body.hs-x .post *{outline:1px dashed rgba(255,48,64,.55)!important;outline-offset:-1px}' +
    'body.hs-x .hs-hover{outline:2px solid #ff3040!important;background-color:rgba(255,48,64,.08)!important}' +
    'body.hs-padb{padding-bottom:46vh!important}' +
    'body{word-break:keep-all;overflow-wrap:break-word}';
  var sideCss = document.createElement('style'); sideCss.dataset.hs = '1'; document.head.appendChild(sideCss);
  document.head.appendChild(pageCss);

  // ───────── 화면 UI (Shadow DOM: 학생 CSS 와 섞이지 않게) ─────────
  var host = document.createElement('div');
  host.setAttribute('data-hs', 'host');
  document.documentElement.appendChild(host);   // body 밖에 두어야 화면 축소(zoom)에 영향받지 않아요
  var root = host.attachShadow({ mode: 'open' });
  root.innerHTML =
    '<style>' +
    ':host{all:initial}' +
    '.panel,.dock{word-break:keep-all;overflow-wrap:break-word}' +
    '*{box-sizing:border-box;margin:0;padding:0}' +
    '.dock{position:fixed;right:16px;bottom:16px;z-index:2147483000;display:flex;align-items:center;gap:8px;flex-wrap:wrap;justify-content:flex-end;' +
    ' font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif}' +
    '.who{background:rgba(20,20,35,.88);color:#fff;font-size:13px;padding:8px 13px;border-radius:999px;backdrop-filter:blur(6px);box-shadow:0 4px 16px rgba(0,0,0,.18)}' +
    '.who b{color:#ffd166}' +
    '.btn{font:inherit;font-size:14px;font-weight:700;border:0;cursor:pointer;border-radius:999px;padding:10px 16px;color:#fff;' +
    ' background:linear-gradient(45deg,#f09433,#dc2743,#bc1888);box-shadow:0 6px 18px rgba(188,24,136,.35);transition:transform .15s}' +
    '.btn:hover{transform:translateY(-2px)}' +
    '.btn.dark{background:#1b1b2f;box-shadow:0 6px 18px rgba(0,0,0,.25)}' +
    '.panel{position:fixed;z-index:2147483001;background:#12121f;color:#e8e9fa;display:none;flex-direction:column;' +
    ' font-family:-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;box-shadow:0 0 40px rgba(0,0,0,.35)}' +
    '.panel.on{display:flex}' +
    '.panel.right{top:16px;bottom:16px;border-radius:14px}' +
    '.panel.bottom{left:0;right:0;bottom:0;height:44vh;border-radius:16px 16px 0 0}' +
    '.head{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid #26263d}' +
    '.ttl{font-family:Jua,sans-serif;font-size:26px;color:#fff;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
    '.ttl small{display:block;font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic",sans-serif;font-size:14px;color:#9ba0ee;margin-bottom:2px}' +
    '.mini{font:inherit;font-size:14px;font-weight:700;border:1px solid #3a3a5a;background:#1d1d33;color:#e8e9fa;border-radius:8px;padding:6px 10px;cursor:pointer;white-space:nowrap}' +
    '.mini:hover{background:#2a2a48}' +
    '.bar{height:4px;background:#26263d}.bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#f09433,#dc2743,#bc1888);transition:width .4s}' +
    '.code{flex:1;overflow:auto;padding:12px 0 40px;font-family:"SFMono-Regular",Menlo,Consolas,"D2Coding",monospace;font-size:var(--fs,16px);line-height:1.7}' +
    '.ln{display:flex;white-space:pre-wrap;word-break:keep-all;overflow-wrap:anywhere;padding:0 16px 0 0}' +
    '.ln .no{flex:0 0 48px;text-align:right;padding-right:12px;color:#4a4c70;user-select:none}' +
    '.ln .tx{flex:1;min-width:0}' +
    '.ln.hot{background:rgba(255,48,64,.18)}' +
    '.c{color:#6e7196}.t{color:#9ba0ee}.s{color:#ffd166}.p{color:#7ee0b5}.v{color:#ffb38a}.k{color:#ff8fb1}.str{color:#ffd166}' +
    '.cur{display:inline-block;width:8px;height:1.1em;vertical-align:-2px;background:#ff3040;animation:blink .8s steps(1) infinite}' +
    '@keyframes blink{50%{opacity:0}}' +
    '.done{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;' +
    ' background:rgba(18,18,31,.94);padding:24px}' +
    '.done.on{display:flex}' +
    '.done .big{font-family:Jua,sans-serif;font-size:52px;color:#fff}' +
    '.done p{font-size:20px;line-height:1.6;color:#c9cbf0}.done p b{color:#ffd166;font-size:24px}' +
    '.done .row{display:flex;gap:8px;margin-top:6px}' +
    '.tip{position:fixed;z-index:2147483002;pointer-events:none;display:none;background:#ff3040;color:#fff;font:700 12px "SFMono-Regular",Menlo,Consolas,monospace;' +
    ' padding:4px 8px;border-radius:6px;white-space:nowrap}' +
    '</style>' +
    '<div class="dock" id="dock"><span class="who">✍️ <b>' + esc(NAME) + '</b> 학생이 직접 쓴 코드 <b id="cnt">…</b>줄</span>' +
    '<button class="btn" id="bPlay">▶ 만든 과정 보기</button><button class="btn dark" id="bCode">&lt;/&gt; 코드 보기</button></div>' +
    '<div class="panel" id="panel"><div class="head"><div class="ttl" id="ttl"></div>' +
    '<button class="mini" id="bFast">⏩ 빠르게</button><button class="mini" id="bClose">✕ 닫기</button></div>' +
    '<div class="bar"><i id="prog"></i></div><div class="code" id="code"></div>' +
    '<div class="done" id="done"><div class="big">완성! ✨</div><p id="doneTxt"></p>' +
    '<div class="row"><button class="btn" id="bAgain">↺ 다시 보기</button><button class="btn dark" id="bEnd">닫기</button></div></div></div>' +
    '<div class="tip" id="tip"></div>';

  var $ = function (id) { return root.getElementById(id); };
  var panel = $('panel'), codeBox = $('code'), ttl = $('ttl'), prog = $('prog');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // ───────── 실제 코드 불러오기 ─────────
  function loadSource() {
    if (source) return Promise.resolve(source);
    return fetch(location.href, { cache: 'no-store' }).then(function (r) { return r.text(); }).catch(function () {
      return '<!DOCTYPE html>\n' + document.documentElement.outerHTML;
    }).then(function (t) {
      source = t.replace(/\r/g, '').split('\n').filter(function (l) { return !SELF_RE.test(l); });
      while (source.length && !source[source.length - 1].trim()) source.pop();
      return source;
    });
  }
  loadSource().then(function (s) { $('cnt').textContent = s.length; });

  // ───────── 패널 위치 (넓으면 오른쪽, 좁으면 아래) ─────────
  // 넓으면: 카드는 왼쪽, 코드는 오른쪽 (인스타 댓글창처럼) / 좁으면: 아래
  var mode = 'bottom', isOpen = false, inFrame = window.parent !== window;
  function tellParent(msg) { if (inFrame) try { window.parent.postMessage(Object.assign({ hs: 1 }, msg), '*'); } catch (e) {} }
  // 카드 전체가 스크롤 없이 한눈에 보이도록 크기를 맞춰요 (너무 작아지지는 않게)
  function layout() {
    if (!isOpen) return;
    var W = window.innerWidth, H = window.innerHeight, gap = 24, z;
    sideCss.textContent = ''; document.body.classList.remove('hs-padb');
    var natH = document.documentElement.scrollHeight;
    panel.className = 'panel on';
    if (W >= 860) {
      mode = 'right';
      z = Math.max(0.6, Math.min(1, (H - 8) / natH));
      var card = 470 * z;
      var pw = Math.min(720, W - card - gap - 40);
      var left = Math.max(16, (W - card - gap - pw) / 2);
      panel.classList.add('right');
      panel.style.width = pw + 'px'; panel.style.left = (left + card + gap) + 'px'; panel.style.right = '';
      panel.style.setProperty('--fs', (pw >= 560 ? 16 : 14) + 'px');
      sideCss.textContent = 'body{zoom:' + z + ';margin-left:' + (left / z) + 'px!important;margin-right:0!important}';
    } else {
      mode = 'bottom';
      z = Math.max(0.55, Math.min(1, (H * 0.56 - 8) / natH, (W - 16) / 470));
      panel.classList.add('bottom'); panel.style.width = ''; panel.style.left = ''; panel.style.setProperty('--fs', '14px');
      sideCss.textContent = 'body{zoom:' + z + '}';
      document.body.classList.add('hs-padb');
    }
  }
  function refit() { setTimeout(layout, 50); setTimeout(layout, 750); }
  function openPanel() {
    isOpen = true; tellParent({ wide: true });
    $('dock').style.display = 'none';
    layout();
  }
  function closePanel() {
    isOpen = false; tellParent({ wide: false });
    panel.className = 'panel'; $('done').classList.remove('on');
    sideCss.textContent = '';
    document.body.classList.remove('hs-padb');
    $('dock').style.display = '';
  }
  window.addEventListener('resize', layout);
  // 홈 화면(바깥)에 '사람이 보고 있어요' 알리기 (화면보호기용)
  ['mousemove', 'mousedown', 'keydown', 'touchstart', 'wheel'].forEach(function (ev) {
    var last = 0;
    document.addEventListener(ev, function () { var n = Date.now(); if (n - last > 1000) { last = n; tellParent({ active: true }); } }, { passive: true });
  });
  function scrollToEl(el) {
    if (!el) return;
    var r = el.getBoundingClientRect();
    var visH = mode === 'bottom' ? window.innerHeight * 0.56 : window.innerHeight;
    var y = window.scrollY + r.top - Math.max(16, (visH - Math.min(r.height, visH)) / 2);
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
  function flash(el) {
    if (!el) return;
    el.classList.remove('hs-flash'); void el.offsetWidth; el.classList.add('hs-flash');
    setTimeout(function () { el.classList.remove('hs-flash'); }, 1500);
  }

  // ───────── 코드 색칠 ─────────
  function hlCss(line) {
    var i = line.indexOf('/*'), code = i >= 0 ? line.slice(0, i) : line, com = i >= 0 ? line.slice(i) : '';
    var out;
    var m = code.match(/^(\s*)([a-zA-Z-]+)(\s*:\s*)(.*)$/);
    if (code.indexOf('{') >= 0 || code.trim() === '}') out = '<span class="s">' + esc(code) + '</span>';
    else if (m) out = esc(m[1]) + '<span class="p">' + esc(m[2]) + '</span>' + esc(m[3]) + '<span class="v">' + esc(m[4]) + '</span>';
    else out = esc(code);
    return out + (com ? '<span class="c">' + esc(com) + '</span>' : '');
  }
  function hlJs(line) {
    var i = line.indexOf('//'), code = i >= 0 ? line.slice(0, i) : line, com = i >= 0 ? line.slice(i) : '';
    var out = esc(code)
      .replace(/(&quot;.*?&quot;|"[^"]*")/g, '<span class="str">$1</span>')
      .replace(/\b(let|function|if|else|return)\b/g, '<span class="k">$1</span>');
    return out + (com ? '<span class="c">' + esc(com) + '</span>' : '');
  }
  function hlHtml(line, inCss, inJs) {
    if (inCss) return hlCss(line);
    if (inJs) return hlJs(line);
    if (/^\s*<!--|^\s*=+|-->\s*$/.test(line)) return '<span class="c">' + esc(line) + '</span>';
    return esc(line).replace(/(&lt;\/?[a-zA-Z0-9!]+)([^&]*?)(\/?&gt;)/g, function (_, a, b, c) {
      return '<span class="t">' + a + '</span>' + b.replace(/([a-z-]+)=(&quot;|")(.*?)(&quot;|")/g, '<span class="p">$1</span>=<span class="str">"$3"</span>') + '<span class="t">' + c + '</span>';
    });
  }

  // ───────── ▶ 만든 과정 (변신 리플레이) ─────────
  var run = 0, speed = 1, liveCss, baseCss;
  function parseSteps(css) {
    var re = /\/\*\s*=+\s*\n\s*STEP\s*(\d+)\s*[—-]\s*([^\n]*)\n\s*선택자\s+([^=\n]+?)\s*=[^\n]*\n[\s\S]*?\*\//g;
    var ms = [], m;
    while ((m = re.exec(css))) ms.push({ no: m[1], title: m[2].trim(), sel: m[3].trim(), start: m.index, end: re.lastIndex });
    var bonus = css.indexOf('/* 인스타 아이콘 모양');
    if (bonus < 0) bonus = css.length;
    return {
      steps: ms.map(function (s, i) {
        var body = css.slice(s.end, i + 1 < ms.length ? ms[i + 1].start : bonus);
        var lines = body.split('\n').map(function (l) { return l.replace(/^  /, ''); });
        while (lines.length && !lines[0].trim()) lines.shift();
        while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
        var sel = s.sel.replace(/::?(before|after)/g, '').split(/\s*\/\s*/)[0];
        return { no: s.no, title: s.title, sel: sel, css: body, lines: lines };
      }),
      base: css.slice(bonus)
    };
  }
  function sleep(ms, id) { return new Promise(function (res, rej) { setTimeout(function () { id === run ? res() : rej('stop'); }, ms / speed); }); }

  function typeLines(lines, hl, id) {
    var finished = [], li = 0, ci = 0;
    function render(partial) {
      codeBox.innerHTML = finished.join('') + (partial !== null ? '<div class="ln"><span class="no">' + (li + 1) + '</span><span class="tx">' + hl(partial) + '<span class="cur"></span></span></div>' : '');
      codeBox.scrollTop = codeBox.scrollHeight;
    }
    return new Promise(function (res, rej) {
      function tick() {
        if (id !== run) return rej('stop');
        if (li >= lines.length) { render(null); return res(); }
        var line = lines[li], inCom = line.indexOf('/*') >= 0 && ci >= line.indexOf('/*') || line.indexOf('//') >= 0 && ci >= line.indexOf('//');
        ci += Math.ceil((inCom ? 14 : 3) * speed);
        if (ci >= line.length) {
          finished.push('<div class="ln"><span class="no">' + (li + 1) + '</span><span class="tx">' + (hl(line) || ' ') + '</span></div>');
          li++; ci = 0;
        }
        render(li < lines.length ? lines[li].slice(0, ci) : null);
        requestAnimationFrame(tick);
      }
      tick();
    });
  }

  function stopReplay() {
    run++;
    if (liveCss) { liveCss.remove(); liveCss = null; }
    if (baseCss) { baseCss.remove(); baseCss = null; }
    if (userStyle) userStyle.media = '';
  }

  function play() {
    if (!userStyle) return;
    stopReplay();
    var id = ++run; speed = 1; $('bFast').textContent = '⏩ 빠르게'; $('bFast').style.display = '';
    var P = parseSteps(userStyle.textContent);
    openPanel(); $('done').classList.remove('on');
    userStyle.media = 'not all';
    baseCss = document.createElement('style'); baseCss.dataset.hs = '1';
    baseCss.textContent = P.base + '\nimg{max-width:100%}\n.profile,.post,.profile *,.post *{transition:all .6s ease}';
    liveCss = document.createElement('style'); liveCss.dataset.hs = '1';
    document.head.appendChild(baseCss); document.head.appendChild(liveCss);
    refit();
    document.querySelectorAll('img').forEach(function (im) { if (!im.complete) im.addEventListener('load', refit, { once: true }); });
    window.scrollTo({ top: 0 });
    var total = P.steps.length + 2, k = 0;
    function setHead(small, big) { ttl.innerHTML = '<small>' + esc(small) + '</small>' + esc(big); prog.style.width = (k / total * 100) + '%'; }

    setHead('STEP 0 · HTML', '글자와 사진만 있는 뼈대');
    codeBox.innerHTML = '<div class="ln"><span class="no"> </span><span class="tx"><span class="c">/* 아직 CSS 가 하나도 없는 상태예요.\n   ' + esc(NAME) + ' 학생이 HTML 로 입력한 내용만 보여요. */</span></span></div>';
    var chain = sleep(2200, id);
    P.steps.forEach(function (st) {
      chain = chain.then(function () {
        k++;
        setHead('STEP ' + st.no + ' / ' + P.steps.length + ' · CSS', st.title);
        var target = document.querySelector(st.sel);
        scrollToEl(target);
        return typeLines(st.lines, hlCss, id).then(function () {
          liveCss.textContent += '\n' + st.css;
          setTimeout(function () { flash(target); }, 80);
          refit();
          return sleep(1300, id);
        });
      });
    });
    chain = chain.then(function () {
      k++;
      setHead('JavaScript', '하트를 누르면 움직이게');
      var heart = document.querySelector('.heart');
      scrollToEl(document.querySelector('.post .icons') || heart);
      var js = userScript ? userScript.textContent.split('\n').map(function (l) { return l.replace(/^    /, ''); }) : [];
      while (js.length && !js[0].trim()) js.shift();
      while (js.length && !js[js.length - 1].trim()) js.pop();
      return typeLines(js, hlJs, id).then(function () { return sleep(500, id); }).then(function () {
        if (heart) heart.click();
        return sleep(1100, id);
      }).then(function () {
        if (heart) heart.click();
        var photo = document.querySelector('.post h2');
        scrollToEl(photo);
        return sleep(700, id).then(function () {
          if (photo) photo.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          return sleep(1500, id);
        }).then(function () { if (heart && heart.classList.contains('liked')) heart.click(); });
      });
    });
    chain.then(function () {
      k = total; prog.style.width = '100%';
      liveCss.remove(); liveCss = null; userStyle.media = '';
      setTimeout(function () { if (baseCss) { baseCss.remove(); baseCss = null; } refit(); }, 700);
      $('bFast').style.display = 'none';
      $('doneTxt').innerHTML = '<b>' + esc(NAME) + '</b> 학생이 직접 쓴<br>코드 <b>' + (source ? source.length : '') + '</b>줄로 만든 페이지예요';
      $('done').classList.add('on');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }).catch(function () {});
  }

  // ───────── </> 코드 보기 (개발자 모드) ─────────
  var devOn = false, map = [], lineEls = [], hot = [];
  function dev() {
    stopReplay();
    loadSource().then(function (src) {
      openPanel(); devOn = true;
      $('bFast').style.display = 'none';
      ttl.innerHTML = '<small>' + esc(NAME) + '.html · 실제 코드</small>' + src.length + '줄 — 화면의 상자를 ' + (touchy ? '눌러' : '눌러 보거나 마우스를 올려') + ' 보세요';
      prog.style.width = '100%';
      var inCss = false, inJs = false, html = [];
      src.forEach(function (l, i) {
        if (/<\/style>/.test(l)) inCss = false;
        if (/<\/script>/.test(l)) inJs = false;
        html.push('<div class="ln" data-i="' + i + '"><span class="no">' + (i + 1) + '</span><span class="tx">' + (hlHtml(l, inCss, inJs) || ' ') + '</span></div>');
        if (/<style>/.test(l)) inCss = true;
        if (/<script>/.test(l)) inJs = true;
      });
      codeBox.innerHTML = html.join('');
      lineEls = codeBox.querySelectorAll('.ln');
      buildMap(src);
      document.body.classList.add('hs-x');
    });
  }
  function buildMap(src) {
    // 화면의 상자 ↔ 코드 줄 연결 (태그가 나오는 순서대로)
    map = [];
    var bodyStart = src.findIndex(function (l) { return /<body/.test(l); });
    var stop = src.findIndex(function (l) { return /<style>/.test(l); });
    if (bodyStart < 0 || stop < 0) return;
    var occ = [];
    for (var i = bodyStart + 1; i < stop; i++) {
      var re = /<([a-zA-Z][a-zA-Z0-9]*)\b/g, m;
      while ((m = re.exec(src[i]))) occ.push({ tag: m[1].toLowerCase(), line: i });
    }
    var els = [];
    var all = document.body.querySelectorAll('*');
    for (var j = 0; j < all.length; j++) {
      var e = all[j];
      if (e === host || e.tagName === 'STYLE' || e === userStyle) break;
      els.push(e);
    }
    if (els.length !== occ.length) return;
    for (var q = 0; q < els.length; q++) {
      if (els[q].tagName.toLowerCase() !== occ[q].tag) { map = []; return; }
      map.push({ el: els[q], line: occ[q].line });
    }
  }
  var lastHover = null;
  var touchy = window.matchMedia && window.matchMedia('(hover: none)').matches;
  // 코드 보기 중에는 눌러도 링크·하트가 동작하지 않고, 누른 상자의 코드를 보여줘요 (태블릿 터치용)
  ['click', 'dblclick'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      if (!devOn || e.target === host) return;
      e.preventDefault(); e.stopPropagation();
      pick(e.target, e.clientX, e.clientY);
    }, true);
  });
  document.addEventListener('mousemove', function (e) {
    if (!devOn || touchy) return;
    pick(e.target, e.clientX, e.clientY);
  });
  function pick(el, cx, cy) {
    if (el === host) return;
    var tip = $('tip');
    // svg 안쪽은 아이콘 전체로
    while (el && el.ownerSVGElement) el = el.parentNode;
    if (el && el.tagName === 'svg') el = el.parentNode;
    if (!el || el === document.body || el === document.documentElement) { tip.style.display = 'none'; return; }
    tip.style.display = 'block';
    tip.style.left = Math.min(cx + 14, window.innerWidth - 200) + 'px';
    tip.style.top = (cy + 16) + 'px';
    tip.textContent = '<' + el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? ' class="' + el.className.replace(/\s*hs-\S+/g, '').trim() + '"' : '').replace(' class=""', '') + '>';
    if (el === lastHover) return;
    if (lastHover) lastHover.classList.remove('hs-hover');
    lastHover = el; el.classList.add('hs-hover');
    hot.forEach(function (x) { x.classList.remove('hot'); }); hot = [];
    for (var i = 0; i < map.length; i++) if (map[i].el === el) {
      var ln = lineEls[map[i].line];
      if (ln) { ln.classList.add('hot'); hot.push(ln); ln.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      break;
    }
  }
  function devOff() {
    devOn = false; document.body.classList.remove('hs-x');
    if (lastHover) lastHover.classList.remove('hs-hover'); lastHover = null;
    $('tip').style.display = 'none';
  }

  // ───────── 버튼 ─────────
  $('bPlay').onclick = function () { devOff(); loadSource().then(play); };
  $('bCode').onclick = dev;
  $('bAgain').onclick = function () { play(); };
  $('bFast').onclick = function () { speed = speed === 1 ? 4 : 1; this.textContent = speed === 1 ? '⏩ 빠르게' : '▶ 보통 속도'; };
  $('bClose').onclick = $('bEnd').onclick = function () { stopReplay(); devOff(); closePanel(); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { stopReplay(); devOff(); closePanel(); } });
})();
