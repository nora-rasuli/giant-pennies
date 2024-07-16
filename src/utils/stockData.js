import axios from 'axios';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

export async function fetchStockData(symbol) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        function: 'TIME_SERIES_DAILY',
        symbol: symbol,
        outputsize: 'full',
        apikey: API_KEY,
      },
    });

    const data = response.data['Time Series (Daily)'];
    return data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return undefined;
  }
}
