import { useMemo, useState } from 'react';
import './App.css';
import AgentFlow from './components/AgentFlow';
import ConnectionInfo from './components/ConnectionInfo';
import HumanApproval from './components/HumanApproval';
import MachineInputPanel from './components/MachineInputPanel';
import OutputDashboard from './components/OutputDashboard';
import StatusBadge from './components/StatusBadge';
import {
  processAgents,
  submitApproval,
  submitMachineInput,
} from './services/api';
import { normalizeAgentOutput } from './services/digitalTwin';

const initialReadings = {
  temperature: '',
  vibration: '',
  speed: '',
  load: '',
};

function App() {
  const [readings, setReadings] = useState(initialReadings);
  const [agentOutput, setAgentOutput] = useState(null);
  const [status, setStatus] = useState('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState('');

  const output = useMemo(
    () => normalizeAgentOutput(agentOutput),
    [agentOutput]
  );

  const handleReadingChange = (field, value) => {
    setReadings((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleRunSystem = async (event) => {
    event.preventDefault();
    setIsRunning(true);
    setError('');
    setStatus('processing');

    try {
      const payload = Object.fromEntries(
        Object.entries(readings).map(([key, value]) => [key, Number(value)])
      );

      await submitMachineInput(payload);
      const processResult = await processAgents();
      const normalizedOutput = normalizeAgentOutput(processResult);

      setAgentOutput(processResult);
      setStatus(
        normalizedOutput.approvalRequired
          ? 'waiting_approval'
          : 'auto_executed'
      );
    } catch (requestError) {
      setStatus('failed');
      setError(requestError.message || 'Unable to run the digital twin system.');
    } finally {
      setIsRunning(false);
    }
  };

  const handleApprovalDecision = async (approved) => {
    setIsApproving(true);
    setError('');

    try {
      await submitApproval(approved);
      setStatus(approved ? 'approved_executed' : 'rejected');
    } catch (requestError) {
      setError(requestError.message || 'Unable to submit approval decision.');
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Factory Digital Twin</p>
          <h1>Agentic AI-Human Machine Control</h1>
        </div>
        <StatusBadge status={status} severityLevel={output.severityLevel} />
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <MachineInputPanel
            values={readings}
            isRunning={isRunning}
            onChange={handleReadingChange}
            onSubmit={handleRunSystem}
          />
          <ConnectionInfo />
        </aside>

        <div className="dashboard-column">
          {error && <div className="error-banner">{error}</div>}
          <AgentFlow output={output} status={status} />
          <OutputDashboard output={output} />
          {output.approvalRequired && (
            <HumanApproval
              action={output.recommendedAction}
              disabled={isApproving || status !== 'waiting_approval'}
              onDecision={handleApprovalDecision}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
