import { motion } from 'framer-motion';

export default function StatsCard({ icon, label, value, color = 'var(--primary)', bgColor = 'var(--primary-50)' }) {
  return (
    <motion.div className="stats-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="stats-icon" style={{ background: bgColor, color }}>
        {icon}
      </div>
      <div>
        <div className="stats-value" style={{ color }}>{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    </motion.div>
  );
}
