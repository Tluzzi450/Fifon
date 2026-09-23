/*
  CONEXIÓN EN LÍNEA (Firebase + cuenta de Google)
  -----------------------------------------------
  Con window.PF_FIREBASE = null la app guarda los datos solo en cada teléfono.
  Para que Cabe y Verga entren con su cuenta de Google y vean lo mismo en vivo,
  completá este bloque con los datos de tu proyecto de Firebase (ver README).
*/
window.PF_FIREBASE = null;

/* Ejemplo — borrá la línea de arriba y completá esto:

window.PF_FIREBASE = {
  serie: "principal",          // nombre de la serie en la base (no hace falta cambiarlo)
  jugadores: {                 // Gmail de cada uno → cómo aparece en los avisos
    "email.de.cabe@gmail.com": "Cabe",
    "email.de.verga@gmail.com": "Verga"
  },
  config: {                    // copiado de Firebase → Configuración del proyecto → Tus apps → Web
    apiKey: "AIza...",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
  }
};
*/
