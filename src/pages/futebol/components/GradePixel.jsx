
export function GradePixel({ matriz, cores, tamanho = 4 }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${matriz[0].length}, ${tamanho}px)`,
        gridTemplateRows: `repeat(${matriz.length}, ${tamanho}px)`,
        lineHeight: 0,
      }}
    >
      {matriz.flatMap((linha, y) =>
        linha.map((codigo, x) => (
          <div
            key={`${x}-${y}`}
            style={{
              width: tamanho,
              height: tamanho,
              backgroundColor: codigo === "." ? "transparent" : cores[codigo],
            }}
          />
        ))
      )}
    </div>
  );
}