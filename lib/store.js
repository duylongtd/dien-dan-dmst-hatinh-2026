// Mutable singleton shared between the DOM scroll layer and the WebGL frame
// loop. Avoids React re-renders on every scroll tick.
export const scene = {
  morph: 0, // target morph segment for the particle field (0..3)
  scatter: 1, // 1 = scattered (pre-load), 0 = assembled
  scroll: 0, // 0..1 page scroll progress
  section: 0, // active section index
  ready: false,
};
