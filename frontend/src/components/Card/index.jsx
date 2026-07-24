import './styles.css'

export default function Card({ label, value, delta, icon }) {
  return (
    <div className="card kpi-card">
      {icon && <div className="kpi-ico">{icon}</div>}
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && <div className="delta">{delta}</div>}
    </div>
  )
}