import { useMemo, useState } from 'react';
import './App.css';
import AppLayout from './layout/AppLayout';
import AppRoutes from './routes/AppRoutes';

function App() {
  const [loading, setLoading] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');

  const apiBaseLabel = useMemo(() => import.meta.env.VITE_API_BASE_URL || 'Vite proxy (/api -> localhost:8080)', []);

  async function executeRequest(label, requestFn) {
    setLoading(true);
    setError('');

    try {
      const payload = await requestFn();
      setResponseData({ label, payload });
    } catch (requestError) {
      setError(requestError.message || 'Unexpected request error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppLayout apiBaseLabel={apiBaseLabel}>
      <AppRoutes
        executeRequest={executeRequest}
        loading={loading}
        error={error}
        responseData={responseData}
      />
    </AppLayout>
  );
}

export default App;
