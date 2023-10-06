import { haversine } from "./module/utils/math.js";
import { getCinemaResults } from "./api.js";

const elements = {
  geolocation: document.querySelector("#coordinates"),
  cinemaList: document.querySelector("#cinemaList"),
  cinemaDistance: document.querySelector("#cinemaDistance"),
};
console.log("Elements:", elements);

// Fonction pour récupérer la géolocalisation de l'utilisateur
function getGeolocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error.message);
      }
    );
  });
}

// Fonction pour récupérer et afficher les cinémas avec pagination
async function getCinemasWithPagination(offset = 0, limit = 10) {
  try {
    console.log(
      "getCinemasWithPagination called with offset:",
      offset,
      "limit:",
      limit
    );
    const userLocation = await getGeolocation();
    console.log("User Location:", userLocation);

    elements.geolocation.textContent = `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;

    const cinemaResults = await getCinemaResults(offset, limit);
    console.log("Cinema Resultat:", cinemaResults);

    // Mettre à jour cinemaList
    elements.cinemaList.innerHTML = "";
    // Mettre à jour cinemaDistance
    elements.cinemaDistance.innerHTML = "";

    cinemaResults.forEach((cinema) => {
      if (
        cinema.geolocalisation &&
        cinema.geolocalisation.lat &&
        cinema.geolocalisation.lon &&
        cinema.nom
      ) {
        const cinemaLocation = [
          cinema.geolocalisation.lat,
          cinema.geolocalisation.lon,
        ];
        const distance = haversine(
          [userLocation.latitude, userLocation.longitude],
          cinemaLocation
        );

        // Mettre à jour cinemaList
        const cinemaInfoList = document.createElement("li");
        cinemaInfoList.textContent = `${cinema.nom} ${cinema.adresse} ${cinema.commune}`;
        elements.cinemaList.appendChild(cinemaInfoList);

        // Mettre à jour cinemaDistance
        const cinemaInfoDistance = document.createElement("li");
        cinemaInfoDistance.textContent = `${
          cinema.nom
        } - Distance: ${distance.toFixed(2)} km`;
        elements.cinemaDistance.appendChild(cinemaInfoDistance);
      } else {
        console.error("Informations insuffisantes pour le cinéma:", cinema);
      }
    });
  } catch (error) {
    console.error("Une erreur a été détectée : " + error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded");
  // Appeler la fonction avec pagination (exemple : page 1, 10 résultats par page)
  getCinemasWithPagination(0, 10);

  // Vous pouvez également ajouter un bouton dans votre HTML pour permettre à l'utilisateur de changer de page
  const nextPageButton = document.getElementById("nextPageButton");
  const prevPageButton = document.getElementById("prevPageButton");

  let currentPage = 0;

  nextPageButton.addEventListener("click", () => {
    currentPage++;
    getCinemasWithPagination(currentPage * 10, 10);
  });

  prevPageButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      getCinemasWithPagination(currentPage * 10, 10);
    }
  });
});

// Fonction pour récupérer les résultats des cinémas depuis l'API
