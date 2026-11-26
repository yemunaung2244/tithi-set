const SIZE = 192;
const RADIANS = Math.PI / 180;
const wrapTurn = angle => (angle + 540) % 360 - 180;

export const litFraction = angle => (1 - Math.cos(angle * RADIANS)) / 2;

let texture;
let texturePromise;

function loadTexture() {
  texturePromise ??= new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      const map = document.createElement('canvas');
      map.width = image.naturalWidth;
      map.height = image.naturalHeight;
      const context = map.getContext('2d');
      context.drawImage(image, 0, 0);
      texture = context.getImageData(0, 0, map.width, map.height);
      resolve();
    };
    image.onerror = resolve;
    // Lunar surface texture from NASA SVS CGI Moon Kit: https://svs.gsfc.nasa.gov/4720/
    image.src = new URL('./moon-surface.jpg', import.meta.url).href;
  });
  return texturePromise;
}

function makeSurface() {
  const surface = [];
  const radius = SIZE / 2 - 1;
  for (let row = 0; row < SIZE; row++) {
    const y = (radius - row + .5) / radius;
    for (let column = 0; column < SIZE; column++) {
      const x = (column - radius - .5) / radius;
      const squared = x*x + y*y;
      if (squared >= 1) continue;
      const z = Math.sqrt(1 - squared);
      let albedo = 205;
      if (texture) {
        const u = Math.floor((.5 + Math.atan2(x,z) / (2*Math.PI)) * texture.width);
        const v = Math.floor((.5 - Math.asin(y) / Math.PI) * texture.height);
        const index = (v * texture.width + u) * 4;
        const rgb = texture.data;
        albedo = Math.min(255, (rgb[index]*.2126 + rgb[index+1]*.7152 + rgb[index+2]*.0722)*1.15 + 35);
      }
      surface.push({index:(row*SIZE+column)*4, x, z, albedo});
    }
  }
  return surface;
}

export async function showMoon(canvas, angle, preceding = angle) {
  await loadTexture();
  if (!canvas.isConnected) return;
  const context = canvas.getContext('2d');
  if (!context) return;
  const surface = makeSurface();
  const frame = context.createImageData(SIZE, SIZE);
  function paint(value) {
    const xLight = Math.sin(value * RADIANS);
    const zLight = -Math.cos(value * RADIANS);
    for (const {index,x,z,albedo} of surface) {
      const illumination = x*xLight + z*zLight;
      const light = Math.max(0, Math.min(1, illumination*7 + .1));
      const shade = .075 + .925 * light * (.82 + .18*z);
      const gray = albedo * shade;
      frame.data[index] = gray;
      frame.data[index+1] = gray;
      frame.data[index+2] = gray;
      frame.data[index+3] = 255;
    }
    context.putImageData(frame, 0, 0);
  }
  const turn = wrapTurn(angle-preceding);
  if (Math.abs(turn)<.05 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    paint(angle);
    return;
  }
  const started = performance.now();
  paint(preceding);
  function tick(now) {
    if (!canvas.isConnected) return;
    const progress = Math.min(1, (now-started)/450);
    paint(preceding + turn * (1-(1-progress)**3));
    if (progress<1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
