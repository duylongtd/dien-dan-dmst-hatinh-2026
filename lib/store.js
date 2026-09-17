// Mutable singleton shared between the DOM scroll layer and the WebGL frame
// loop. Avoids React re-renders on every scroll tick.
export const scene = {
  morph: 0, // target morph segment for the particle field (0..3)
  scatter: 1, // 1 = scattered (pre-load), 0 = assembled
  scroll: 0, // 0..1 page scroll progress
  section: 0, // active section index
  ready: false,
  lenis: null, // the Lenis instance, once mounted
};

// Programmatic scroll that cooperates with Lenis instead of fighting it
// (native scrollIntoView + Lenis wheel hijacking = stutter).
export function scrollToId(id) {
  if (typeof document === 'undefined') return;
  const el = document.getElementById(id);
  if (!el) return;
  if (scene.lenis) scene.lenis.scrollTo(el, { duration: 1.2 });
  else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
