import React, { useEffect, useMemo } from 'react';
import { useExecutionStore } from '@/stores/executionStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, Clock, RefreshCw, ArrowLeft, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export const ExecutionHistory: React.FC = () => {
  const {
    executions,
    selectedExecution,
    isLoading,
    filterStatus,
    loadExecutions,
    loadExecutionById,
    setFilterStatus,
    clearSelectedExecution,
  } = useExecutionStore();

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  const filteredExecutions = useMemo(() => {
    if (filterStatus === 'all') return executions;
    return executions.filter((exec) => exec.status === filterStatus);
  }, [executions, filterStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'running':
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      success: 'bg-green-100 text-green-800',
      error: 'bg-red-100 text-red-800',
      running: 'bg-blue-100 text-blue-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (start: string, end?: string) => {
    const startTime = new Date(start).getTime();
    const endTime = end ? new Date(end).getTime() : Date.now();
    const duration = endTime - startTime;

    if (duration < 1000) return `${duration}ms`;
    if (duration < 60000) return `${(duration / 1000).toFixed(1)}s`;
    return `${(duration / 60000).toFixed(1)}m`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (selectedExecution) {
    return (
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <header className="border-b px-6 py-4 bg-card flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={clearSelectedExecution}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to List
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Execution Details</h1>
            <p className="text-sm text-muted-foreground">
              ID: {selectedExecution.id} • {formatDateTime(selectedExecution.startedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(selectedExecution.status)}
            <span
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium',
                getStatusBadge(selectedExecution.status)
              )}
            >
              {selectedExecution.status.toUpperCase()}
            </span>
          </div>
        </header>

        {/* Execution Details */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Started At</span>
                    <p className="font-medium">{formatDateTime(selectedExecution.startedAt)}</p>
                  </div>
                  {selectedExecution.finishedAt && (
                    <div>
                      <span className="text-sm text-muted-foreground">Finished At</span>
                      <p className="font-medium">
                        {formatDateTime(selectedExecution.finishedAt)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm text-muted-foreground">Duration</span>
                    <p className="font-medium">
                      {formatDuration(
                        selectedExecution.startedAt,
                        selectedExecution.finishedAt
                      )}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Workflow ID</span>
                    <p className="font-medium font-mono text-sm">
                      {selectedExecution.workflowId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Error Card */}
            {selectedExecution.error && (
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Error
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-red-50 p-4 rounded text-sm text-red-900 overflow-auto">
                    {selectedExecution.error}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Execution Data */}
            {selectedExecution.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Execution Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(selectedExecution.data).map(([nodeId, nodeData]) => (
                      <div key={nodeId} className="border rounded-lg p-4">
                        <h3 className="font-medium mb-2 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          Node: {nodeId}
                        </h3>
                        <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto max-h-[400px]">
                          {JSON.stringify(nodeData, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Execution History</h1>
            <p className="text-sm text-muted-foreground mt-1">
              View all workflow execution history
            </p>
          </div>
          <Button size="sm" onClick={() => loadExecutions()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mt-4">
          {(['all', 'success', 'error', 'running'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                filterStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-2 text-xs opacity-75">
                (
                {status === 'all'
                  ? executions.length
                  : executions.filter((e) => e.status === status).length}
                )
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Execution List */}
      <div className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredExecutions.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Clock className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No executions found</h3>
            <p className="text-sm text-gray-500 mt-1">
              {filterStatus !== 'all'
                ? `No ${filterStatus} executions yet`
                : 'Execute a workflow to see results here'}
            </p>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-3">
            {filteredExecutions.map((execution) => (
              <Card
                key={execution.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => execution.id && loadExecutionById(execution.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Icon */}
                    <div>{getStatusIcon(execution.status)}</div>

                    {/* Execution Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full text-xs font-medium',
                            getStatusBadge(execution.status)
                          )}
                        >
                          {execution.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(execution.startedAt)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-mono">Workflow: {execution.workflowId}</span>
                      </div>
                      {execution.error && (
                        <div className="text-sm text-red-600 mt-1 truncate">
                          Error: {execution.error}
                        </div>
                      )}
                    </div>

                    {/* Duration */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Duration</div>
                      <div className="font-medium">
                        {formatDuration(execution.startedAt, execution.finishedAt)}
                      </div>
                    </div>

                    {/* View Button */}
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
