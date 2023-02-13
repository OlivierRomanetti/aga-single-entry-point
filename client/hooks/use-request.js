import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess, onError }) => {
  const doRequest = async () => {
    try {
      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      if (onError) {
        onError(err);
      }
    }
  };

  return { doRequest };
};

export default useRequest;
