import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

export const typesenseInstantsearchAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY || 'xyz',
    nodes: [{
			host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
			port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
			protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http'
    }]
  },
  additionalSearchParameters: {
    num_typos: 3,
  },
	collectionSpecificSearchParameters: {
    articles: {
      query_by: "title,content,tags",
    },
  },
});
