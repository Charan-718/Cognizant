import { formatRiskScore } from '../services/digitalTwin';

const steps = [
  { id: 'prediction', label: 'Prediction' },
  { id: 'context', label: 'Context' },
  { id: 'decision', label: 'Decision' },
  { id: 'confidence', label: 'Confidence' },
  { id: 'action', label: 'Action' },
];

function getStepDetail(step, output, status) {
  if (step.id === 'prediction') {
    return output.riskScore === null || output.riskScore === undefined
      ? 'Risk pending'
      : `${formatRiskScore(output.riskScore)} risk`;
  }

  if (step.id === 'context') {
    return `${output.faultType} - ${output.severity}`;
  }

  if (step.id === 'decision') {
    return output.recommendedAction;
  }

  if (step.id === 'confidence') {
    return output.confidenceMode;
  }

  if (status === 'auto_executed') return 'Auto executed';
  if (status === 'waiting_approval') return 'Waiting approval';
  if (status === 'approved_executed') return 'Approved and executed';
  if (status === 'rejected') return 'Rejected by operator';
  if (status === 'failed') return 'Execution failed';
  return 'Pending action';
}

function AgentFlow({ output, status }) {
  const hasRun = status !== 'idle';

  return (
    <section className="panel">
      <div className="panel-heading">
        <p className="eyebrow">Agent Flow</p>
        <h2>Prediction to Action</h2>
      </div>

      <div className="agent-flow">
        {steps.map((step, index) => (
          <article
            className={`flow-step ${hasRun ? 'complete' : ''} ${
              step.id === 'action' ? output.severityLevel : ''
            }`}
            key={step.id}
          >
            <div className="step-index">{index + 1}</div>
            <div>
              <strong>{step.label}</strong>
              <span>{getStepDetail(step, output, status)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default AgentFlow;
