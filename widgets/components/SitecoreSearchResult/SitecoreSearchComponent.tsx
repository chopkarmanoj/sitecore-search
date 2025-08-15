import React, { useState, useEffect } from 'react';
import { useSearchResults } from '@sitecore-search/react';

const SitecoreSearchComponent = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const {
    queryResult,
    isLoading,
    error,
    setQueryParams,
  } = useSearchResults();

  useEffect(() => {
    if (query.trim()) {
      setQueryParams({
        query,
        page: 1,
        pageSize: 10,
      });
    }
  }, [query]);

  useEffect(() => {
    if (queryResult?.results?.length) {
      console.log('Search Results:', queryResult.results);
      setResults(queryResult.results);
    }
  }, [queryResult]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value)}
      />
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {results.map((item, index) => (
          <li key={index}>
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SitecoreSearchComponent;
