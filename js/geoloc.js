const elements = {
  geolocation: document.querySelector("#geolocation"),
  coordinates: document.querySelector("#coordinates"),
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

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Récupérer la géolocalisation au chargement de la page
    const userLocation = await getGeolocation();
    console.log(userLocation);

    // Afficher les résultats
    console.log(
      `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`
    );
    elements.coordinates.textContent = `Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`;
  } catch (error) {
    console.error("Une erreur a été détectée : " + error);
  }
});
