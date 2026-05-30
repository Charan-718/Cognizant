import { formatRiskScore } from '../services/digitalTwin';

function DashboardCard({ label, value, tone, wide }) {
  return (
    <article className={`dashboard-card ${tone || ''} ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function OutputDashboard({ output }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Agent Outputs</p>
        <h2>Output Dashboard</h2>
      </div>

      <div className="dashboard-grid">
        <DashboardCard
          label="Risk Score"
          value={formatRiskScore(output.riskScore)}
          tone={output.severityLevel}
        />
        <DashboardCard label="Fault Type" value={output.faultType} />
        <DashboardCard
          label="Severity"
          value={output.severity}
          tone={output.severityLevel}
        />
        <DashboardCard
          label="Recommended Action"
          value={output.recommendedAction}
        />
        <DashboardCard label="Confidence Mode" value={output.confidenceMode} />
        <DashboardCard label="Explanation" value={output.explanation} wide />
      </div>
    </section>
  );
}

export default OutputDashboard;
