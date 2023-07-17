import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function MatchPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null); // 타입 지정
  const [rectanglePos, setRectanglePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) { return; }
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const drawRectangle = () => {
      if (context === null) { return; }
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'red';
      context.fillRect(rectanglePos.x, rectanglePos.y, 80, 80);
    };

    drawRectangle();

    const handleKeyDown = (event: React.KeyboardEvent) => {
      let newX = rectanglePos.x;
      let newY = rectanglePos.y;

      switch (event.code) {
        case 'KeyW':
          newY -= 10;
          break;
        case 'KeyS':
          newY += 10;
          break;
        case 'KeyA':
          newX -= 10;
          break;
        case 'KeyD':
          newX += 10;
          break;
        default:
          return;
      }

      axios.post('http://localhost:3001/api/move', { x: newX, y: newY })
        .then(() => setRectanglePos({ x: newX, y: newY }))
        .catch((error) => console.error(error));
    };

    window.addEventListener('keydown', handleKeyDown as any);

    return () => {
      window.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [rectanglePos]);

  return <canvas ref={canvasRef} width={800} height={600} />;
}