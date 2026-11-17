/** Mutable state that GSAP tweens and the WebGL render loops read every frame. */
export const ACCENT = '#D7FF3D'; // neon pear
export const fieldState = { settle: 0, scroll: 0, dim: 1, accent: ACCENT };
// trueColor: 0 = brand blues only, 1 = the photo's real colours.
export const portraitState = { progress: 0, trueColor: 1 };
