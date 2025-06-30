
import { generateRandom13DigitNumber } from '@/libs/axios';
import { encryptRequestBody } from '@/libs/encryptBody';
import axios from 'axios';
import { toast } from 'react-toastify';

export const downloadCsv = async (requestData: TODO) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    const encryptedData = encryptRequestBody(requestData);
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/accounts/export`,
      encryptedData,
      {
        headers: {
          urn: generateRandom13DigitNumber(),
          authToken: authToken,
        },
        responseType: 'blob',
      }
    );


    if (response.data.size < 1024) {
      const errorText = await new Response(response.data).text();

      try {
        const errorData = JSON.parse(errorText);


        if (errorData.apiResponseData?.responseCode !== '200' ||
          errorData.responseCode !== '200') {
          const errorMessage = errorData.apiResponseData?.responseMessage ||
            errorData.responseMessage ||
            'Request failed';
          toast.error(errorMessage);
          return;
        }
      } catch (err: TODO) {
        console.log("error", err)
      }
    }

    const blob = new Blob([response.data], { type: 'text/csv' });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
      a.remove();
    }, 100);

  } catch (error: TODO) {
    console.error('CSV download failed:', error);

    let errorMessage = error.message;
    if (error.response) {
      if (error.response.status === 401) {
        errorMessage = 'Session expired. Please login again.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }


      try {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
          errorMessage = errorData.apiResponseData?.responseMessage ||
            errorData.responseMessage ||
            errorMessage;
        }
      } catch (e) {
        console.error('Error parsing error response:', e);
      }
    }

    toast.error(errorMessage);
    throw error;
  }
};