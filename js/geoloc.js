import { haversine } from "./module/utils/math.js";

const elements = {
  geolocation: document.querySelector("#coordinates"),
  cinemaList: document.querySelector("#cinemaList"),
  cinemaDistance: document.querySelector("#cinemaDistance"),
  myAddress: document.querySelector("#myAdress"),
};

const baseUrl = "https://api-adresse.data.gouv.fr";

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
function getCinemaResults() {
  return fetch(
    "https://data.culture.gouv.fr/api/explore/v2.1/catalog/datasets/etablissements-cinematographiques/records"
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Data API:", data);
      return data.results;
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Récupérer la géolocalisation au chargement de la page
    const userLocation = await getGeolocation();
    console.log("User Location:", userLocation);

    // Afficher la géolocalisation
    elements.geolocation.textContent = `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;

    // Récupérer l'adresse via une API
    const addressResponse = await fetch(
      `${baseUrl}/reverse?lat=${userLocation.latitude}&lon=${userLocation.longitude}`
    );
    const addressData = await addressResponse.json();
    const userAddress = addressData.features[0].properties.label;

    // Afficher l'adresse
    elements.myAddress.textContent = `Mon adresse : ${userAddress}`;

    // Récupérer les résultats des cinémas depuis l'API
    const cinemaResults = await getCinemaResults();
    console.log("Cinema Results:", cinemaResults);

    cinemaResults.forEach((cinema) => {
      // Assurez-vous que cinema.geolocalisation et cinema.nom existent avant de les utiliser
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
