import axios from 'axios';

export const fetchData = async (url: string) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        throw error; // Rethrow to handle it in the calling function
    }
};