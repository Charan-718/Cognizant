const statusLabels = {
  idle: 'Ready',
  processing: 'Processing',
  auto_executed: 'Auto executed',
  waiting_approval: 'Waiting approval',
  approved_executed: 'Approved and executed',
  rejected: 'Rejected',
  failed: 'Failed',
};

function StatusBadge({ status, severityLevel }) {
  return (
    <aside className={`status-badge ${severityLevel || 'normal'} ${status}`}>
      <span>Action Status</span>
      <strong>{statusLabels[status] || status}</strong>
    </aside>
  );
}

export default StatusBadge;
