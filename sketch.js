const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random')
const palettes = require('nice-color-palettes')

const settings = {
  dimensions: [2048, 2048],
  background: '#fefae0'
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6)
  // const palette = random.shuffle(random.pick(palettes)).slice(0, colorCount)
  const palette = ['#606c38', '#283618', '#dda15e', '#bc6c25']
  const icons = ['-', '_']

  const createGrid = () => {
    const points = [];
    const count = 30;
    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);
        const radius = Math.abs(random.noise2D(u, v)) * 0.3;
        const circleRadius = Math.abs(random.noise2D(u, v)) * 0.03;
        points.push({
          radius,
          circleRadius,
          position: [u, v],
          color: random.pick(palette),
          rotation: random.noise2D(u, v),
        })
      }
    }
    return points;
  }

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const { position, radius, color, rotation, circleRadius } = data;
      const [u, v] = position;

      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      // context.beginPath();
      // context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      // context.fillStyle = color;
      // context.fill();

      // context.save();
      // context.fillStyle = color;
      // context.font = `${radius * width}px "Helvetica"`;
      // context.translate(x, y);
      // context.rotate(rotation);
      // context.fillText(random.pick(icons), 0, 0);

      context.beginPath();
      context.arc(x, y, circleRadius * width, 0, Math.PI * 2.5, false);
      context.fillStyle = color;
      context.fill();

      context.restore();

    })
  };
};

canvasSketch(sketch, settings);
