const apiUrl =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";

export function getCinemaResults() {
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Data API:", data);
      return data.results;
    });
}
