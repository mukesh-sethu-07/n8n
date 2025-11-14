import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { WorkflowEditor } from './pages/WorkflowEditor';
import { ExecutionHistory } from './pages/ExecutionHistory';
import { Button } from './components/ui/Button';
import { Workflow, History } from 'lucide-react';
import { cn } from './lib/utils';
import './styles/globals.css';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Workflows', icon: Workflow },
    { path: '/executions', label: 'Executions', icon: History },
  ];

  return (
    <nav className="border-b bg-card">
      <div className="flex items-center px-6 py-3 gap-2">
        <div className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white" />
          </div>
          <span className="text-lg font-bold">n8n</span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link key={item.path} to={item.path}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                className={cn('flex items-center gap-2')}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<WorkflowEditor />} />
            <Route path="/executions" element={<ExecutionHistory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
