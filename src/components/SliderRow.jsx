function SliderRow({ label, value, min, max, onChange }) {
  return (
    <div className="slider-row">
      <div className="slider-row__head">
        <span>{label}</span>
        <span>{value}h</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={0.5}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />

      <div className="slider-row__axis">
        <span>{min}h</span>
        <span>{max}h</span>
      </div>
    </div>
  );
}

export default SliderRow;
