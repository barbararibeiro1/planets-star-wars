import { useState, useEffect } from 'react';

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();

        const dataWithoutResidents = result.results.map((item:any) => {
          const { residents, ...rest } = item;
          return rest;
        });
        setData(dataWithoutResidents);
      } catch (fetchError) {
        if (fetchError instanceof Error) {
          setError(fetchError.toString());
        } else {
          setError('An unexpected error has occurred. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
