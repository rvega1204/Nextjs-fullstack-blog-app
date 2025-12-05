"use client";

/**
 * ErrorComponent displays an error message and provides a button to retry an action.
 * It's designed to be used as an error boundary fallback component, offering a user-friendly
 * way to recover from render-time errors.
 *
 * @param {object} props - The component's properties.
 * @param {Error} props.error - The error object caught by the error boundary. This object is expected
 *   to have a `message` property that will be displayed to the user.
 * @param {function(): void} props.reset - A callback function provided by the error boundary to reset its state.
 *   Invoking this function typically attempts to re-render the wrapped component tree,
 *   allowing the user to "try again" after an error.
 * @returns {JSX.Element} A React functional component that renders an error message and a retry button.
 */
const ErrorComponent = ({ error, reset }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 text-red-700">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="mb-4">{error?.message}</p>
      <button
        onClick={() => reset()}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorComponent;
