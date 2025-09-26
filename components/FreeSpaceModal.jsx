"use client";

import { useState } from "react";
import PinVerification from "./PinVerification.jsx";

export default function FreeSpaceModal({
  isOpen,
  onClose,
  currentFree,
  totalSpace,
  onUpdate,
  isLoading,
}) {
  const [freeSpace, setFreeSpace] = useState(currentFree?.toString() || "");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFree = Number.parseFloat(freeSpace);
    if (!Number.isNaN(newFree) && newFree >= 0 && newFree <= totalSpace) {
      const newUsed = totalSpace - newFree;
      const updateData = { free: newFree, used: newUsed };
      
      // Store the update data and show PIN modal
      setPendingUpdate(updateData);
      setShowPinModal(true);
    }
  };

  const handlePinVerified = async () => {
    if (pendingUpdate) {
      await onUpdate(pendingUpdate);
      setPendingUpdate(null);
      onClose();
    }
  };

  const handlePinModalClose = () => {
    setShowPinModal(false);
    setPendingUpdate(null);
  };

  const handleClose = () => {
    setFreeSpace(currentFree?.toString() || "");
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
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Update Free Space</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-xl"
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="freeSpaceInput"
              className="block text-sm font-medium mb-2"
            >
              Free Space Available (TB)
            </label>
            <input
              id="freeSpaceInput"
              type="number"
              step="0.01"
              min="0"
              max={totalSpace}
              value={freeSpace}
              onChange={(e) => setFreeSpace(e.target.value)}
              className="w-full rounded-xl border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter free space in TB"
              disabled={isLoading}
              required
            />
            <div className="mt-1 text-sm text-gray-600">
              Total capacity: {totalSpace} TB
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading || !freeSpace}
            >
              {isLoading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
      
      {/* PIN Verification Modal */}
      <PinVerification
        isOpen={showPinModal}
        onClose={handlePinModalClose}
        onVerified={handlePinVerified}
        title="PIN Required"
        message="Please enter your PIN to update free space:"
      />
    </div>
  );
}
