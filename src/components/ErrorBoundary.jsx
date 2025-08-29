import React from "react";
export default class ErrorBoundary extends React.Component {
  constructor(p) {
    super(p);
    this.state = { hasError: false, msg: "" };
  }
  static getDerivedStateFromError(e) {
    return { hasError: true, msg: e?.message || "Error" };
  }
  componentDidCatch(e, info) {
    console.error("App error:", e, info);
  }
  render() {
    return this.state.hasError ? (
      <div className="container-xxl py-4">
        <h2>Something went wrong.</h2>
        <pre>{this.state.msg}</pre>
      </div>
    ) : (
      this.props.children
    );
  }
}
