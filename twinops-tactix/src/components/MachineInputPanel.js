const fields = [
  { id: 'temperature', label: 'Temperature', unit: 'C' },
  { id: 'vibration', label: 'Vibration', unit: 'mm/s' },
  { id: 'speed', label: 'Speed', unit: 'RPM' },
  { id: 'load', label: 'Load', unit: '%' },
];

function MachineInputPanel({ values, isRunning, onChange, onSubmit }) {
  return (
    <form className="panel input-panel" onSubmit={onSubmit}>
      <div className="panel-heading">
        <p className="eyebrow">Machine Telemetry</p>
        <h2>Input Panel</h2>
      </div>

      <div className="field-stack">
        {fields.map((field) => (
          <label className="input-field" key={field.id}>
            <span>{field.label}</span>
            <div className="input-with-unit">
              <input
                type="number"
                step="any"
                value={values[field.id]}
                placeholder="0"
                required
                onChange={(event) => onChange(field.id, event.target.value)}
              />
              <small>{field.unit}</small>
            </div>
          </label>
        ))}
      </div>

      <button className="primary-button" type="submit" disabled={isRunning}>
        {isRunning ? 'Running System...' : 'Run System'}
      </button>
    </form>
  );
}

export default MachineInputPanel;
