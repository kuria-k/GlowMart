// // services/mpesaService.js
// import axios from "axios";

// const API_BASE_URL = 'https://hypermodest-irena-washy.ngrok-free.dev/api';

// // Create axios instance with better error handling
// const mpesaClient = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Add response interceptor for debugging
// mpesaClient.interceptors.response.use(
//   (response) => {
//     console.log('✅ API Response:', response.status, response.data);
//     return response;
//   },
//   (error) => {
//     console.error('❌ API Error:', error.response?.status, error.response?.data);
//     return Promise.reject(error);
//   }
// );

// export const initiateMpesaPayment = async (phone, amount, reference) => {
//   try {
//     console.log('📤 Initiating payment:', { phone, amount, reference });
    
//     const response = await mpesaClient.post('/mpesa/initiate/', {
//       phone,
//       amount,
//       reference,
//       description: "Order Payment",
//     });
    
//     console.log('✅ Initiate response:', response.data);
    
//     return {
//       success: true,
//       checkout_request_id: response.data.checkout_request_id,
//       ...response.data
//     };
//   } catch (error) {
//     console.error("❌ M-PESA initiation error:", error);
//     return {
//       success: false,
//       error: error.response?.data?.error || error.message || "Failed to initiate payment",
//     };
//   }
// };

// export const checkPaymentStatus = async (checkoutRequestId) => {
//   try {
//     console.log('🔍 Checking status for:', checkoutRequestId);
    
//     const response = await mpesaClient.get(`/mpesa/status/${checkoutRequestId}/`);
    
//     console.log('✅ Status response:', response.data);
    
//     // Handle different response formats
//     if (response.data && response.data.status) {
//       return {
//         success: true,
//         status: response.data.status,
//         receipt: response.data.receipt || response.data.mpesa_receipt_number,
//         amount: response.data.amount,
//         result_code: response.data.result_code,
//         result_desc: response.data.result_desc,
//       };
//     } else if (response.data && response.data.success === false) {
//       return {
//         success: false,
//         status: 'error',
//         error: response.data.error
//       };
//     } else {
//       return {
//         success: true,
//         status: response.data.status || 'pending',
//         receipt: null,
//       };
//     }
//   } catch (error) {
//     console.error("❌ Status check error:", error);
    
//     // If we get a 200 but can't parse, try to get the raw response
//     if (error.response && error.response.status === 200) {
//       console.log('Raw response data:', error.response.data);
//       return {
//         success: true,
//         status: 'pending',
//         raw: error.response.data
//       };
//     }
    
//     return { 
//       success: false,
//       status: "error", 
//       error: error.response?.data?.error || error.message 
//     };
//   }
// };

// export const cancelMpesaPayment = async (checkoutRequestId) => {
//   try {
//     const response = await mpesaClient.post(`/mpesa/cancel/${checkoutRequestId}/`);
//     return {
//       success: true,
//       ...response.data
//     };
//   } catch (error) {
//     console.error("❌ Cancel error:", error);
//     return { 
//       success: false, 
//       error: error.response?.data?.error || error.message 
//     };
//   }
// };

// export const getTransactions = async () => {
//   try {
//     const response = await mpesaClient.get('/mpesa/transactions/');
//     return {
//       success: true,
//       transactions: response.data.transactions || []
//     };
//   } catch (error) {
//     console.error("❌ Get transactions error:", error);
//     return { 
//       success: false, 
//       transactions: [],
//       error: error.response?.data?.error || error.message 
//     };
//   }
// };


import axios from "axios";

const API_BASE_URL = 'https://hypermodest-irena-washy.ngrok-free.dev/api';

const mpesaClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Initiate payment
export const initiateMpesaPayment = async (phone, amount, reference) => {
  try {
    const response = await mpesaClient.post('/mpesa/initiate/', {
      phone,
      amount,
      reference,
      description: "Order Payment",
    });

    return {
      success: true,
      checkoutRequestId: response.data.checkout_request_id,
      message: response.data.message,
    };

  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to initiate payment",
    };
  }
};

// ✅ OPTIONAL: light status check (manual, not polling loop)
export const getPaymentStatus = async (checkoutRequestId) => {
  try {
    const response = await mpesaClient.get(`/mpesa/status/${checkoutRequestId}/`);

    return {
      success: true,
      status: response.data.status,
      receipt: response.data.receipt,
    };

  } catch (error) {
    return {
      success: false,
      status: "error",
      error: error.message,
    };
  }
};