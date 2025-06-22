'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            {/* Error Message */}
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              哎呀，出错了！
            </h2>
            <p className="text-gray-600 mb-6">
              应用遇到了一个意外错误。别担心，这通常只是临时问题。
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 mb-2">
                  查看错误详情
                </summary>
                <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-800 overflow-auto max-h-32">
                  <div className="mb-2">
                    <strong>错误信息:</strong>
                  </div>
                  <div className="mb-2">{this.state.error.message}</div>
                  {this.state.errorInfo && (
                    <>
                      <div className="mb-2">
                        <strong>组件堆栈:</strong>
                      </div>
                      <div>{this.state.errorInfo.componentStack}</div>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={this.handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                重试
              </Button>
              <Button
                onClick={this.handleGoHome}
                variant="outline"
                className="w-full">
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </div>

            {/* Additional Help */}
            <p className="text-xs text-gray-500 mt-6">
              如果问题持续存在，请尝试刷新页面或联系技术支持。
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
