export const algoliaSearch = async (
  index: 'mementos',
  query: string,
  filters: string,
  page: number
) => {
  try {
    const response = await fetch(
      `https://${process.env.ALGOLIA_APP_ID}-dsn.algolia.net/1/indexes/${index}/query`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Algolia-API-Key': `${process.env.ALGOLIA_API_KEY}`,
          'X-Algolia-Application-Id': `${process.env.ALGOLIA_APP_ID}`,
        },
        body: JSON.stringify({
          query,
          filters,
          hitsPerPage: 20,
          page,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    return {
      hits: data,
      nbHits: data.nbHits,
      nbPages: data.nbPages,
      page: data.page,
    };
  } catch (error) {
    console.error(error);
  }
};
