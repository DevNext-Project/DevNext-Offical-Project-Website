class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)] text-white">
          <div className="text-center p-8 bg-[var(--bg-card)] rounded-xl max-w-md">
            <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
            <p className="text-[var(--text-muted)] mb-6">予期せぬエラーが発生しました。ページをリロードしてください。</p>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-primary"
            >
              リロード
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  try {
    return (
      <div className="min-h-screen flex flex-col" data-name="app" data-file="app.js">
        <Header />
        <main className="flex-grow">
          <Hero />
          <Features />
          <About />
          <Team />
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
