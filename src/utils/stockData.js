import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchVOOStockData() {
  const response = await axios.get(BASE_URL, {
    params: {
      function: 'TIME_SERIES_DAILY',
      symbol: 'VOO',
      outputsize: 'full',
      apikey: API_KEY,
    },
  });

  return response.data['Time Series (Daily)'];
}
