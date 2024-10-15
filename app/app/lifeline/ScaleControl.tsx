interface Props {
  scale: number;
  setScale: (scale: number) => void;
}

export default function ScaleControl({ scale, setScale }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-8 shadow-lg flex items-center justify-center z-50">
      <input
        type="range"
        min="1"
        max="48"
        step="1"
        value={scale}
        onChange={(e) => setScale(Number(e.target.value))}
        className="w-48"
      />
    </div>
  );
}
