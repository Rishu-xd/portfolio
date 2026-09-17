type Props = {
  text: string;
  layers?: number;
  position?: [number, number];
};

function getLayerOffset(
  position: [number, number],
  layers: number,
  index: number
) {
  return {
    x: position[0] * (index / layers),
    y: position[1] * (index / layers),
  };
}

export default function DepthText({
  text,
  layers = 10,
  position = [0, 0],
}: Props) {
  return (
    <div className="relative">
      {/* Depth layers */}
      {Array.from({ length: layers }).map((_, i) => {
        const depth = i + 1;
        const offset = getLayerOffset(position, layers, i);

        /*
         * EXACT SAME opacity behavior
         */
        const opacity =
          0.35 * (1 - i / layers);

        return (
          <div
            key={i}
            className="absolute inset-0 text-6xl font-bold"
            style={{
              color: `rgba(0, 0, 0, ${opacity})`,

              transform: `
                translate(
                  ${offset.x}px,
                  ${offset.y}px
                )
              `,

              /*
               * EXACT SAME blur behavior
               */
              filter: `blur(${depth * 0.15}px)`,
            }}
          >
            {text}
          </div>
        );
      })}

      {/* Actual surface — NEVER moves */}
      <div className="relative text-6xl font-bold text-black">
        {text}
      </div>
    </div>
  );
}