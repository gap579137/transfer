"use client";

import { useState, useRef, useEffect } from "react";

export default function PinVerification({
  isOpen,
  onClose,
  onVerified,
  title = "PIN Required",
  message = "Please enter your PIN to continue:",
}) {
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin(["", "", "", ""]);
      setError("");
      // Focus first input when modal opens
      setTimeout(() => inputRefs[0].current?.focus(), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    // Only allow single digits
    if (value.length > 1) return;
    if (value && !/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    setError("");

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-verify when all digits are entered
    if (value && index === 3 && newPin.every((digit) => digit !== "")) {
      verifyPin(newPin.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to move to previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }

    // Handle Enter to verify pin
    if (e.key === "Enter" && pin.every((digit) => digit !== "")) {
      verifyPin(pin.join(""));
    }
  };

  const verifyPin = async (pinValue) => {
    setIsVerifying(true);
    setError("");

    try {
      // Simple PIN verification - in production, you'd want this server-side
      const correctPin = process.env.NEXT_PUBLIC_APP_PIN || "1234"; // Default for demo

      // Add a small delay to prevent brute force attempts
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (pinValue === correctPin) {
        onVerified();
        onClose();
      } else {
        setError("Incorrect PIN. Please try again.");
        setPin(["", "", "", ""]);
        setTimeout(() => inputRefs[0].current?.focus(), 100);
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleClose = () => {
    if (isVerifying) return;
    setPin(["", "", "", ""]);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={handleClose}
        aria-label="Close modal"
        disabled={isVerifying}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-sm mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={isVerifying}
          >
            ×
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          {/* PIN Input */}
          <div className="flex gap-3 justify-center mb-4">
            {[0, 1, 2, 3].map((position) => (
              <input
                key={`pin-digit-${position}`}
                ref={inputRefs[position]}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={pin[position]}
                onChange={(e) => handleInputChange(position, e.target.value)}
                onKeyDown={(e) => handleKeyDown(position, e)}
                className={`w-12 h-12 text-center text-xl font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isVerifying}
                autoComplete="off"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm mb-4 min-h-[20px]">
              {error}
            </div>
          )}

          {/* Verification Status */}
          {isVerifying && (
            <div className="text-blue-600 text-sm mb-4">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Verifying...
              </div>
            </div>
          )}

          {/* Manual Verify Button */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isVerifying}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => verifyPin(pin.join(""))}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isVerifying || pin.some((digit) => digit === "")}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
