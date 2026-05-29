/*
 * Speech bubble that pops above the oneko pet. Owns its own DOM node and
 * auto-hide timer. Positioning is anchored to the cat's centre, with the
 * bubble's bottom pointer sitting ~6px above the sprite's top edge.
 */
export function createOnekoBubble(parent) {
  const existing = document.getElementById('oneko-bubble');
  if (existing) existing.remove();

  const el = document.createElement('div');
  el.id = 'oneko-bubble';
  el.setAttribute('aria-hidden', 'true');
  el.setAttribute('data-show', 'false');
  parent.appendChild(el);

  let hideTimer = null;

  function show(text, duration = 1800) {
    el.textContent = text;
    el.setAttribute('data-show', 'true');
    if (hideTimer) clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      el.setAttribute('data-show', 'false');
    }, duration);
  }

  // Anchor the bubble's bottom-center pointer ~6px above the cat.
  function moveTo(nekoPosX, nekoPosY) {
    el.style.left = `${nekoPosX}px`;
    el.style.top  = `${nekoPosY - 16 - 6}px`;
  }

  function destroy() {
    if (hideTimer) clearTimeout(hideTimer);
    el.remove();
  }

  return { show, moveTo, destroy };
}
