/** Astro/DOM adaptations of React Bits TrueFocus and VariableProximity.
 * Source: https://github.com/DavidHDev/react-bits
 * Copyright (c) 2026 David Haz. MIT + Commons Clause; see public/licenses/react-bits.txt.
 * Adaptations: no React runtime, no blur/glow/autoplay, event-driven updates,
 * reduced-motion/touch fallbacks, fixed glyph widths and CJK line wrapping.
 */
const enabled = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
const cleanups: Array<() => void> = [];

function setupFocus(list: HTMLElement) {
  const frame = document.createElement('li');
  frame.className = 'focus-frame';
  frame.setAttribute('aria-hidden', 'true');
  frame.innerHTML = '<i></i><i></i><i></i><i></i>';
  list.append(frame);
  let active: HTMLElement | null = null;
  const position = () => {
    if (!active) return;
    const entering = !frame.classList.contains('is-visible');
    if (entering) frame.style.transition = 'none';
    const parent = list.getBoundingClientRect();
    const rect = active.getBoundingClientRect();
    frame.style.transform = `translate(${rect.left - parent.left - 9}px,${rect.top - parent.top - 5}px)`;
    frame.style.width = `${rect.width + 18}px`;
    frame.style.height = `${rect.height + 10}px`;
    if (entering) { frame.getBoundingClientRect(); frame.style.transition = ''; }
    frame.classList.add('is-visible');
  };
  const enter = (event: Event) => {
    const target = (event.target as Element).closest<HTMLElement>('.post-title-link');
    if (!target || !list.contains(target)) return;
    active = target.querySelector<HTMLElement>('.post-title-text');
    position();
  };
  const leave = (event: Event) => {
    const next = (event as FocusEvent).relatedTarget as Element | null;
    if (next instanceof Element && list.contains(next) && next.closest('.post-title-link')) return;
    if (list.querySelector('.post-title-link:focus-visible')) return;
    active = null;
    frame.classList.remove('is-visible');
  };
  list.addEventListener('pointerover', enter);
  list.addEventListener('focusin', enter);
  list.addEventListener('pointerleave', leave);
  list.addEventListener('focusout', leave);
  const observer = new ResizeObserver(position);
  observer.observe(list);
  cleanups.push(() => {
    observer.disconnect(); frame.remove();
    list.removeEventListener('pointerover', enter); list.removeEventListener('focusin', enter);
    list.removeEventListener('pointerleave', leave); list.removeEventListener('focusout', leave);
  });
}

function setupProximity(title: HTMLElement) {
  if (title.children.length) return; // Preserve author-provided rich headings.
  const warp = title.hasAttribute('data-warp-text');
  const label = title.textContent ?? '';
  const oldLabel = title.getAttribute('aria-label');
  title.setAttribute('aria-label', label);
  title.classList.add('proximity-title');
  const characters: HTMLSpanElement[] = [];
  const fragment = document.createDocumentFragment();
  const isChinese = title.matches(':lang(zh)');
  const words = isChinese ? Array.from(label) : label.split(/(\s+)/);
  words.forEach(word => {
    if (/^\s+$/.test(word)) { fragment.append(document.createTextNode(word)); return; }
    const group = document.createElement('span');
    group.className = 'proximity-word';
    group.setAttribute('aria-hidden', 'true');
    for (const letter of Array.from(word)) {
      const span = document.createElement('span');
      span.className = 'proximity-letter'; span.textContent = letter;
      group.append(span); characters.push(span);
    }
    fragment.append(group);
  });
  title.replaceChildren(fragment);
  const measure = () => {
    characters.forEach(letter => { letter.style.width = ''; letter.style.fontWeight = '650'; letter.style.fontVariationSettings = ''; letter.style.setProperty('--warp-shift', '0px'); });
    const widths = characters.map(letter => letter.getBoundingClientRect().width);
    characters.forEach((letter, i) => letter.style.width = `${widths[i]}px`);
  };
  measure();
  let pending = 0;
  let point = { x: 0, y: 0 };
  const render = () => {
    pending = 0;
    const rects = characters.map(letter => letter.getBoundingClientRect());
    characters.forEach((letter, i) => {
      const rect = rects[i];
      const distance = Math.hypot(point.x - rect.left - rect.width / 2, point.y - rect.top - rect.height / 2);
      const falloff = Math.max(0, 1 - distance / 130) ** 2;
      letter.style.fontWeight = String(Math.round(650 + 200 * falloff));
      letter.style.setProperty('--warp-shift', `${(2.8 * falloff).toFixed(2)}px`);
      // Source Serif's optical axis adds the local glyph deformation of TextPressure,
      // while keeping the selected editorial font and fixed line layout.
      if (warp && !isChinese) letter.style.fontVariationSettings = `'opsz' ${24 - 14 * falloff}`;
    });
  };
  const move = (event: PointerEvent) => {
    point = { x: event.clientX, y: event.clientY };
    if (!pending) pending = requestAnimationFrame(render);
  };
  const reset = () => {
    cancelAnimationFrame(pending); pending = 0;
    characters.forEach(letter => { letter.style.fontWeight = '650'; letter.style.fontVariationSettings = ''; letter.style.setProperty('--warp-shift', '0px'); });
  };
  title.addEventListener('pointermove', move);
  title.addEventListener('pointerleave', reset);
  window.addEventListener('resize', measure);
  cleanups.push(() => {
    reset(); title.removeEventListener('pointermove', move); title.removeEventListener('pointerleave', reset);
    window.removeEventListener('resize', measure);
    title.textContent = label; title.classList.remove('proximity-title');
    if (oldLabel === null) title.removeAttribute('aria-label'); else title.setAttribute('aria-label', oldLabel);
  });
}
let generation = 0;
async function update() {
  const current = ++generation;
  cleanups.splice(0).forEach(cleanup => cleanup());
  if (!enabled.matches) return;
  await document.fonts.ready;
  if (!enabled.matches || current !== generation) return;
  document.querySelectorAll<HTMLElement>('.post-list').forEach(setupFocus);
  document.querySelectorAll<HTMLElement>('.article-header h1, [data-warp-text]').forEach(setupProximity);
}
enabled.addEventListener('change', update);
void update();
