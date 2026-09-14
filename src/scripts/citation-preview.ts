const refs = document.querySelectorAll<HTMLAnchorElement>('[data-footnote-ref]');
if (refs.length) {
  const tooltip = document.createElement('div');
  tooltip.id = 'citation-preview';
  tooltip.className = 'citation-preview';
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;
  document.body.append(tooltip);
  let active: HTMLAnchorElement | undefined;
  let originalDescription: string | null = null;
  let timer: ReturnType<typeof setTimeout>;
  let keyboard = false;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const hide = () => {
    clearTimeout(timer);
    if (active) {
      if (originalDescription === null) active.removeAttribute('aria-describedby');
      else active.setAttribute('aria-describedby', originalDescription);
    }
    active = undefined;
    tooltip.hidden = true;
  };
  const show = (ref: HTMLAnchorElement) => {
    hide();
    const target = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
    if (!target) return;
    const copy = target.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('[data-footnote-backref]').forEach(node => node.remove());
    tooltip.textContent = `${ref.textContent}. ${copy.textContent?.trim() ?? ''}`;
    tooltip.lang = ref.closest('[lang]')?.getAttribute('lang') ?? document.documentElement.lang;
    tooltip.hidden = false;
    const rect = ref.getBoundingClientRect();
    const box = tooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.left - 16, innerWidth - box.width - 12));
    const top = rect.top >= box.height + 20 ? rect.top - box.height - 8 : rect.bottom + 8;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${Math.max(12, Math.min(top, innerHeight - box.height - 12))}px`;
    active = ref;
    originalDescription = ref.getAttribute('aria-describedby');
    ref.setAttribute('aria-describedby', [originalDescription, tooltip.id].filter(Boolean).join(' '));
  };
  const deferHide = () => { clearTimeout(timer); timer = setTimeout(hide, 160); };
  document.addEventListener('keydown', event => {
    keyboard = true;
    if (event.key === 'Escape') hide();
  });
  document.addEventListener('pointerdown', () => { keyboard = false; });
  refs.forEach(ref => {
    ref.addEventListener('pointerenter', () => {
      if (finePointer.matches) { clearTimeout(timer); timer = setTimeout(() => show(ref), 120); }
    });
    ref.addEventListener('pointerleave', () => {
      if (document.activeElement !== ref) deferHide();
    });
    ref.addEventListener('focus', () => { if (keyboard) show(ref); });
    ref.addEventListener('blur', deferHide);
    ref.addEventListener('click', hide);
  });
  tooltip.addEventListener('pointerenter', () => clearTimeout(timer));
  tooltip.addEventListener('pointerleave', deferHide);
  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('resize', hide);
}
