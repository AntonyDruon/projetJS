import { haversine } from "./module/utils/math.js";
import { getCinemaResults } from "./api.js";

const elements = {
  geolocation: document.querySelector("#coordinates"),
  cinemaList: document.querySelector("#cinemaList"),
  cinemaDistance: document.querySelector("#cinemaDistance"),
};

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

// Fonction pour récupérer les résultats des cinémas depuis l'API

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Récupérer la géolocalisation au chargement de la page
    const userLocation = await getGeolocation();
    console.log("User Location:", userLocation);

    // Afficher la géolocalisation
    elements.geolocation.textContent = `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;

    // Récupérer les résultats des cinémas depuis l'API
    const cinemaResults = await getCinemaResults();
    console.log("Cinema Resultat:", cinemaResults);

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

        const cinemaInfo = document.createElement("li");
        cinemaInfo.textContent = `${cinema.nom} - Distance: ${distance.toFixed(
          2
        )} km`;
        elements.cinemaDistance.appendChild(cinemaInfo);
      } else {
        console.error("Informations insuffisantes pour le cinéma:", cinema);
      }
    });
  } catch (error) {
    console.error("Une erreur a été détectée : " + error);
  }
});
