import React from 'react';

class ErrorBoundaryPage extends React.Component {
   constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
   }

   static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true, error };
   }

   componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
      console.log(error, errorInfo)
      // logErrorToMyService(error, errorInfo);
   }

   render() {
      if (this.state.hasError) {
         // You can render any custom fallback UI
         return <h1>Something went wrong due to ERROR: {this.state.error.message}</h1>;
      }

      return this.props.children;
   }
}


export default ErrorBoundaryPage;