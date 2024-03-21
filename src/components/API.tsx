import useFetch from '../hooks/useFetch';
import Table from './Table';

function RequisitionApi() {
  const url = 'https://swapi.dev/api/planets';
  const { data, loading, error } = useFetch(url);

  if (error) return <p>{error}</p>;

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table planets={ data } />
      )}
    </div>
  );
}

export default RequisitionApi;
