function HumanApproval({ action, disabled, onDecision }) {
  return (
    <section className="panel approval-panel">
      <div className="panel-heading">
        <p className="eyebrow">Human-in-the-Loop</p>
        <h2>WhatsApp Approval</h2>
      </div>

      <div className="whatsapp-card">
        <div className="message-meta">Communication Agent</div>
        <p>Machine risk high. Reduce speed?</p>
        <small>Recommended action: {action}</small>
      </div>

      <div className="approval-actions">
        <button
          className="approve-button"
          type="button"
          disabled={disabled}
          onClick={() => onDecision(true)}
        >
          Approve
        </button>
        <button
          className="reject-button"
          type="button"
          disabled={disabled}
          onClick={() => onDecision(false)}
        >
          Reject
        </button>
      </div>
    </section>
  );
}

export default HumanApproval;
