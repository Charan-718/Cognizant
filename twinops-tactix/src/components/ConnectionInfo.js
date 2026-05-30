import { API_BASE_URL } from '../services/api';

function ConnectionInfo() {
  return (
    <section className="connection-info">
      <div>
        <span>FastAPI Base</span>
        <strong>{API_BASE_URL}</strong>
      </div>
      <div>
        <span>Endpoints</span>
        <strong>POST /input, GET /process, POST /approve</strong>
      </div>
    </section>
  );
}

export default ConnectionInfo;
