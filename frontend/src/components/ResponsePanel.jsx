function ResponsePanel({ loading, error, responseData }) {
  return (
    <section className="response-card">
      <h2>API Response</h2>
      {loading && <p className="info">Request in progress...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && !responseData && <p className="info">Run any action to view response payload.</p>}
      {responseData && (
        <>
          <p className="response-label">{responseData.label}</p>
          <pre>{JSON.stringify(responseData.payload, null, 2)}</pre>
        </>
      )}
    </section>
  );
}

export default ResponsePanel;

