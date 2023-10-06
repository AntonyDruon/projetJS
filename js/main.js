const apiUrl =
  "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records";

fetch(apiUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    return response.json();
  })
  .then((data) => {
    if (data && data.results) {
      const cinemaList = data.results;

      if (cinemaList && cinemaList.length > 0) {
        cinemaList.sort((a, b) => b.fauteuils - a.fauteuils);

        const cinemaListElement = document.getElementById("cinemaList");
        cinemaList.forEach((cinema) => {
          const li = document.createElement("li");
          li.textContent = `${cinema.nom} - ${cinema.adresse} - ${cinema.commune}`;
          cinemaListElement.appendChild(li);
        });
      } else {
        console.error("La liste de cinémas est vide ou non définie.");
      }
    } else {
      console.error(
        "Les données ne sont pas définies ou ne contiennent pas la propriété results."
      );
    }
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des données:", error);
  });
