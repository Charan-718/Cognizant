export const emptyAgentOutput = {
  riskScore: null,
  faultType: 'Awaiting analysis',
  severity: 'Normal',
  recommendedAction: 'No action yet',
  confidenceMode: 'Pending',
  explanation: 'Run the system to generate agent reasoning.',
  approvalRequired: false,
};

function normalizeRiskValue(riskScore) {
  const numericRisk = Number(riskScore);

  if (!Number.isFinite(numericRisk)) {
    return numericRisk;
  }

  return numericRisk > 0 && numericRisk <= 1 ? numericRisk * 100 : numericRisk;
}

function toBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }

  return Boolean(value);
}

function firstDefined(...values) {
  return values.find((value) => value !== undefined && value !== null);
}

function getNested(source, path) {
  return path.reduce((current, key) => current?.[key], source);
}

export function getSeverityLevel(severity, riskScore) {
  const value = String(severity || '').toLowerCase();

  if (value.includes('critical') || value.includes('high')) {
    return 'critical';
  }

  if (value.includes('medium') || value.includes('moderate')) {
    return 'medium';
  }

  const numericRisk = normalizeRiskValue(riskScore);

  if (Number.isFinite(numericRisk) && numericRisk >= 75) {
    return 'critical';
  }

  if (Number.isFinite(numericRisk) && numericRisk >= 40) {
    return 'medium';
  }

  return 'normal';
}

export function normalizeAgentOutput(rawOutput) {
  if (!rawOutput) {
    return {
      ...emptyAgentOutput,
      severityLevel: 'normal',
    };
  }

  const riskScore = firstDefined(
    rawOutput.risk_score,
    rawOutput.riskScore,
    rawOutput.risk,
    getNested(rawOutput, ['prediction_agent', 'risk']),
    getNested(rawOutput, ['prediction_agent', 'risk_score']),
    getNested(rawOutput, ['prediction', 'risk_score'])
  );

  const faultType = firstDefined(
    rawOutput.fault_type,
    rawOutput.faultType,
    rawOutput.fault,
    getNested(rawOutput, ['context_agent', 'fault']),
    getNested(rawOutput, ['context_agent', 'fault_type']),
    getNested(rawOutput, ['context', 'fault'])
  );

  const severity = firstDefined(
    rawOutput.severity,
    getNested(rawOutput, ['context_agent', 'severity']),
    getNested(rawOutput, ['context', 'severity'])
  );

  const recommendedAction = firstDefined(
    rawOutput.recommended_action,
    rawOutput.recommendedAction,
    rawOutput.action,
    getNested(rawOutput, ['decision_agent', 'action']),
    getNested(rawOutput, ['decision', 'action'])
  );

  const approvalRequired = toBoolean(
    firstDefined(
      rawOutput.approval_required,
      rawOutput.approvalRequired,
      getNested(rawOutput, ['confidence_agent', 'approval_required']),
      getNested(rawOutput, ['confidence', 'approval_required'])
    )
  );

  const confidenceMode = firstDefined(
    rawOutput.confidence_mode,
    rawOutput.confidenceMode,
    rawOutput.mode,
    getNested(rawOutput, ['confidence_agent', 'mode']),
    getNested(rawOutput, ['confidence', 'mode'])
  );

  const explanation = firstDefined(
    rawOutput.explanation,
    rawOutput.reasoning,
    rawOutput.llm_output,
    getNested(rawOutput, ['explanation_agent', 'explanation']),
    getNested(rawOutput, ['explanation_agent', 'reasoning']),
    getNested(rawOutput, ['explanation', 'reasoning'])
  );

  return {
    riskScore,
    faultType: faultType || emptyAgentOutput.faultType,
    severity: severity || emptyAgentOutput.severity,
    severityLevel: getSeverityLevel(severity, riskScore),
    recommendedAction: recommendedAction || emptyAgentOutput.recommendedAction,
    confidenceMode:
      confidenceMode || (approvalRequired ? 'Approval Required' : 'Auto'),
    explanation: explanation || emptyAgentOutput.explanation,
    approvalRequired,
  };
}

export function formatRiskScore(riskScore) {
  if (riskScore === null || riskScore === undefined || riskScore === '') {
    return '--';
  }

  const numericRisk = normalizeRiskValue(riskScore);

  if (!Number.isFinite(numericRisk)) {
    return String(riskScore);
  }

  return `${Math.round(numericRisk)}%`;
}
