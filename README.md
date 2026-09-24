# Paternidad FIFA

Resultados y estadísticas de la serie FIFA entre **Cabe** y **Verga**. Es una web app (PWA): se abre desde el navegador y se instala en el celular como una app, con ícono propio.

Con Firebase configurado, **cada uno entra con su cuenta de Google**, los dos ven los mismos datos en vivo y la app avisa cuando el otro carga o edita un partido. No hay usuarios ni contraseñas propias: solo pueden entrar las dos cuentas de Google que habilites.

Viene precargada con los 71 partidos de la planilla y los apodos de los 118 equipos.

---

## Paso 1 · Crear la base en línea (Firebase, gratis)

1. Entrá a <https://console.firebase.google.com> con tu cuenta de Google → **Crear un proyecto** → nombre `paternidad-fifa` → podés desactivar Google Analytics → **Crear**.
2. **Firestore:** *Compilación → Firestore Database → Crear base de datos*. Elegí la ubicación `southamerica-east1 (São Paulo)` y **modo de producción**.
3. **Reglas:** en Firestore, pestaña **Reglas**. Pegá el contenido de `firestore.rules`, **cambiá los dos emails por los Gmail de ustedes** (en minúsculas) y tocá **Publicar**.
4. **Ingreso con Google:** *Compilación → Authentication → Comenzar → Método de acceso → Google →* **Habilitar**. Elegí tu email como correo de asistencia y guardá. No actives ningún otro método.
5. **Configuración web:** ⚙ *Configuración del proyecto → General → Tus apps →* ícono **Web `</>`**. Poné un apodo (`paternidad-web`), sin Hosting, y tocá **Registrar app**. Copiá el bloque `firebaseConfig`.

> Cualquiera puede tocar "Entrar con Google", pero si su cuenta no está en las reglas de Firestore, la app le muestra "no tiene permiso" y no ve ni modifica nada.

## Paso 2 · Completar `config.js`

Abrí `config.js` y reemplazá la línea `window.PF_FIREBASE = null;` por el bloque del ejemplo que está en el mismo archivo, con:

- los datos del `firebaseConfig` que copiaste,
- los dos Gmail en `jugadores`, con el nombre que aparece en los avisos (Cabe / Verga).

## Paso 3 · Subir a GitHub y publicar

1. En <https://github.com> → **New repository** → nombre `paternidad-fifa` → **Public** → **Create repository**.
2. En el repo tocá **Add file → Upload files**, seleccioná **todos los archivos del zip** (son archivos sueltos, no hay carpetas) y tocá **Commit changes**.
   Si ya habías editado `config.js` en GitHub, no lo vuelvas a subir: dejalo afuera de la selección.
3. **Settings → Pages → Build and deployment**: en *Source* elegí **Deploy from a branch**, en *Branch* elegí `main` y `/ (root)`, y tocá **Save**.
4. En 1 o 2 minutos aparece el link: `https://TU_USUARIO.github.io/paternidad-fifa/`.
5. **Autorizar el sitio en Firebase (obligatorio para Google):** Authentication → **Configuración → Dominios autorizados → Agregar dominio** → `TU_USUARIO.github.io` (sin `https://` ni barra final).

La app avisa arriba si falta algo:
- *"Modo sin conexión con Google"*: `config.js` sigue vacío (`null`), así que falta el Paso 2.
- *"El archivo config.js tiene un error"*: falta una comilla, una coma o una llave. También podés pegar tal cual el bloque `const firebaseConfig = {...}` que te da Firebase: la app lo entiende.

## Paso 4 · Entrar y cargar los escudos

1. Abrí el link → **Entrar con Google** → elegí tu cuenta. La primera vez se cargan solos los 71 partidos y los apodos en la base.
2. En la app de Claude: **Partidos → Exportar respaldo**. Después, en esta app: **Partidos → Importar respaldo** con ese archivo. Así se suben los escudos.

## Paso 5 · Compartirla con tu compañero

1. Asegurate de que su Gmail esté en `firestore.rules` (publicado en Firebase) y en `config.js`.
2. Mandale el link por WhatsApp. Él toca **Entrar con Google**, elige su cuenta y listo: no tiene que registrarse.
3. Para instalarla, tocá el botón dorado **Instalar app** (arriba a la derecha):
   - **Android y computadora (Chrome o Edge):** se instala directo, con ícono propio y ventana propia. En la PC queda en el escritorio y en el menú Inicio.
   - **iPhone:** el botón muestra los pasos (Compartir → **Agregar a pantalla de inicio**). La app instalada tiene su propia sesión: la primera vez hay que tocar **Entrar con Google** de nuevo.

Para sumar o cambiar a alguien más adelante, editá la lista de emails en las reglas de Firestore y publicá. No hace falta tocar GitHub, salvo para cambiar el nombre que aparece en los avisos.

### Si el ingreso con Google falla

- *"Este sitio no está autorizado…"*: falta el paso 3.5, agregar `TU_USUARIO.github.io` en Dominios autorizados.
- *"El navegador bloqueó la ventana de Google"*: permití ventanas emergentes para el sitio, o volvé a tocar el botón.
- *"No tiene permiso para ver esta serie"*: ese Gmail no está en las reglas de Firestore, o no está escrito en minúsculas.

## Cómo llegan las actualizaciones

- **Datos:** cuando uno carga, edita o borra un partido, el otro lo ve en segundos, sin recargar, y le aparece un aviso ("Verga cargó el partido #72: …"). Si alguien carga sin internet, se sincroniza cuando vuelve la conexión.
- **Cambios en la app:** si modificás archivos en GitHub, subí también el número de `VERSION` en `sw.js` (por ejemplo `pf-v4`). Al abrir la app aparece "Hay una versión nueva → Actualizar".
- Los avisos aparecen con la app abierta. Las notificaciones push con la app cerrada requieren un servidor aparte (Firebase Cloud Functions, plan pago) y no están incluidas.

## Sin Firebase

Si dejás `window.PF_FIREBASE = null;`, la app funciona igual pero cada teléfono guarda su propia copia (sin login). Para pasar datos de uno a otro, usá **Exportar / Importar respaldo**.

## Estructura (todo en la raíz, sin carpetas)

```
index.html            App completa (incluye los gráficos y el logo)
config.js             Conexión a Firebase y Gmail de los jugadores
firestore.rules       Reglas de seguridad (pegar en Firebase)
manifest.webmanifest  Datos de instalación (nombre, íconos, colores)
sw.js                 Modo sin conexión y aviso de versión nueva
seed.json             Partidos y apodos precargados
logo.png, icon-*.png, maskable-512.png, apple-touch-icon.png, favicon-32.png   Íconos
```

Uso esperado dentro del plan gratuito de Firebase: sobra. Cada vez que se abre la app lee unos 300 documentos y el límite es de 50.000 por día.
