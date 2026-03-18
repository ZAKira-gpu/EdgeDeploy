import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { useState } from 'react';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import ConversionProgress from './components/ConversionProgress';
import ResultsPage from './components/ResultsPage';
import HistoryPage from './components/HistoryPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [conversionData, setConversionData] = useState<any>(null);

  return (
    <div className="dark size-full bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/auth"
            element={<AuthPage onAuthenticate={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard onStartConversion={setConversionData} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/converting"
            element={isAuthenticated ? <ConversionProgress data={conversionData} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/results"
            element={isAuthenticated ? <ResultsPage data={conversionData} /> : <Navigate to="/auth" />}
          />
          <Route
            path="/history"
            element={isAuthenticated ? <HistoryPage /> : <Navigate to="/auth" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
