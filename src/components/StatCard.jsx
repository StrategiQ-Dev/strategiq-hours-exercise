function StatCard({ label, value, navy = false }) {
  return (
    <div className={`stat-card ${navy ? "stat-card--navy" : ""}`}>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

export default StatCard;
