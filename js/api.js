const apiUrl =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";

export function getCinemaResults(offset = 0, limit = 10) {
  return fetch(`${apiUrl}?offset=${offset}&limit=${limit}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("Data API:", data);
      return data.results;
    });
}
