"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("3D Model failed to load:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-950/80 backdrop-blur-sm z-50">
          <div className="text-center max-w-xs px-6">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-stone-400" />
            </div>
            <p className="text-sm font-semibold text-stone-200 mb-1">
              3D Model Unavailable
            </p>
            <p className="text-xs text-stone-500 mb-5 leading-relaxed">
              The apparel model failed to load. Try switching silhouettes or refreshing the page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-stone-950 text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
