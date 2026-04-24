class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error('ErrorBoundary caught an error:', error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center p-8 bg-gray-800 rounded-xl">
            <h1 className="text-2xl font-bold mb-4 text-red-500">Error Occurred</h1>
            <button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col" data-name="app" data-file="memory-app.js">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <Memory />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ErrorBoundary><App /></ErrorBoundary>);
