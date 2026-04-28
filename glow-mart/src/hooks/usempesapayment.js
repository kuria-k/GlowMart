// src/hooks/useMpesaPayment.js
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { mpesaAPI } from "../services/mpesaservies";

export const PAYMENT_STATUS = {
  IDLE: "idle",
  INITIATING: "initiating",
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
  TIMEOUT: "timeout",
};

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLING_ATTEMPTS = 40; // 2 minutes max

export const useMpesaPayment = () => {
  const [paymentState, setPaymentState] = useState({
    status: PAYMENT_STATUS.IDLE,
    checkoutRequestId: null,
    receiptNumber: null,
    amount: null,
    error: null,
    attemptCount: 0,
  });

  const pollingIntervalRef = useRef(null);
  const isPollingRef = useRef(false);
  const abortControllerRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    isPollingRef.current = false;
  }, []);

  // Start polling for payment status
  const startPolling = useCallback(
    async (checkoutRequestId, orderId, orderNumber, onSuccess, onFailure) => {
      if (isPollingRef.current) {
        console.log("Polling already in progress");
        return;
      }

      isPollingRef.current = true;
      let attempts = 0;

      const poll = async () => {
        attempts++;
        console.log(`🔍 Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS}`);

        try {
          const status = await mpesaAPI.checkStatus(checkoutRequestId);
          console.log("📊 Status:", status);

          setPaymentState((prev) => ({
            ...prev,
            attemptCount: attempts,
          }));

          // Handle different statuses
          switch (status.status) {
            case PAYMENT_STATUS.COMPLETED:
              console.log("✅ Payment completed!");
              stopPolling();
              setPaymentState((prev) => ({
                ...prev,
                status: PAYMENT_STATUS.COMPLETED,
                receiptNumber: status.receipt_number,
                amount: status.amount,
              }));
              onSuccess(status.receipt_number, status.amount);
              break;

            case PAYMENT_STATUS.PROCESSING:
              console.log("⏳ Payment processing...");
              setPaymentState((prev) => ({
                ...prev,
                status: PAYMENT_STATUS.PROCESSING,
              }));
              break;

            case PAYMENT_STATUS.FAILED:
              console.log("❌ Payment failed");
              stopPolling();
              setPaymentState((prev) => ({
                ...prev,
                status: PAYMENT_STATUS.FAILED,
                error: status.error || "Payment failed",
              }));
              onFailure(status.error || "Payment failed");
              break;

            case PAYMENT_STATUS.CANCELLED:
              console.log("🚫 Payment cancelled");
              stopPolling();
              setPaymentState((prev) => ({
                ...prev,
                status: PAYMENT_STATUS.CANCELLED,
              }));
              onFailure("Payment cancelled");
              break;

            case PAYMENT_STATUS.TIMEOUT:
              console.log("⏰ Payment timeout");
              stopPolling();
              setPaymentState((prev) => ({
                ...prev,
                status: PAYMENT_STATUS.TIMEOUT,
                error: "Payment request timed out",
              }));
              onFailure("Payment timeout");
              break;

            default:
              // Still pending
              if (attempts >= MAX_POLLING_ATTEMPTS) {
                console.log("Max polling attempts reached");
                stopPolling();
                setPaymentState((prev) => ({
                  ...prev,
                  status: PAYMENT_STATUS.TIMEOUT,
                  error: "Payment confirmation timeout",
                }));
                onFailure("Payment confirmation timeout");
              }
              break;
          }
        } catch (error) {
          console.error("Polling error:", error);
          if (attempts >= MAX_POLLING_ATTEMPTS) {
            stopPolling();
            setPaymentState((prev) => ({
              ...prev,
              status: PAYMENT_STATUS.TIMEOUT,
              error: "Unable to confirm payment status",
            }));
            onFailure("Status check failed");
          }
        }
      };

      // Start polling
      poll();
      pollingIntervalRef.current = setInterval(poll, POLLING_INTERVAL);
    },
    [stopPolling]
  );

  // Initiate payment
  const initiatePayment = useCallback(
    async (phoneNumber, amount, orderReference, orderId, orderNumber, onSuccess, onFailure) => {
      // Reset state
      setPaymentState({
        status: PAYMENT_STATUS.INITIATING,
        checkoutRequestId: null,
        receiptNumber: null,
        amount: null,
        error: null,
        attemptCount: 0,
      });

      try {
        const result = await mpesaAPI.initiatePayment(phoneNumber, amount, orderReference);

        if (!result.success) {
          setPaymentState((prev) => ({
            ...prev,
            status: PAYMENT_STATUS.FAILED,
            error: result.error,
          }));
          onFailure(result.error);
          return false;
        }

        const checkoutId = result.checkout_request_id;

        setPaymentState((prev) => ({
          ...prev,
          checkoutRequestId: checkoutId,
          status: PAYMENT_STATUS.PENDING,
        }));

        // Start polling
        await startPolling(checkoutId, orderId, orderNumber, onSuccess, onFailure);

        return true;
      } catch (error) {
        console.error("Payment initiation error:", error);
        setPaymentState((prev) => ({
          ...prev,
          status: PAYMENT_STATUS.FAILED,
          error: error.message,
        }));
        onFailure(error.message);
        return false;
      }
    },
    [startPolling]
  );

  // Cancel payment
  const cancelPayment = useCallback(async () => {
    if (!paymentState.checkoutRequestId) return;

    stopPolling();

    try {
      await mpesaAPI.cancelPayment(paymentState.checkoutRequestId);
      setPaymentState((prev) => ({
        ...prev,
        status: PAYMENT_STATUS.CANCELLED,
      }));
    } catch (error) {
      console.error("Cancel error:", error);
    }
  }, [paymentState.checkoutRequestId, stopPolling]);

  // Reset payment state
  const resetPayment = useCallback(() => {
    stopPolling();
    setPaymentState({
      status: PAYMENT_STATUS.IDLE,
      checkoutRequestId: null,
      receiptNumber: null,
      amount: null,
      error: null,
      attemptCount: 0,
    });
  }, [stopPolling]);

  return {
    paymentState,
    initiatePayment,
    cancelPayment,
    resetPayment,
    PAYMENT_STATUS,
  };
};