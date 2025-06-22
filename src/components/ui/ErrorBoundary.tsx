import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log error info to an error reporting service here
    // console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-8">
          <h1 className="text-3xl font-bold mb-4">משהו השתבש</h1>
          <p className="mb-4">אירעה שגיאה בלתי צפויה. נסה לרענן את הדף או לחזור מאוחר יותר.</p>
          <pre className="text-sm text-red-500 whitespace-pre-wrap break-all max-w-xl mx-auto bg-muted p-4 rounded-md">
            {this.state.error?.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
} 