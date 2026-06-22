chrome.storage.sync.get(['sitiosBloqueados', 'horaInicio', 'horaFin'], function(resultado) {
  const sitios = resultado.sitiosBloqueados || [];
  const inicio = resultado.horaInicio || "00:00";
  const fin = resultado.horaFin || "23:59";

  const ahora = new Date();
  const horaActual = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');

  let dentroDelHorario = false;
  if (inicio <= fin) {
    dentroDelHorario = horaActual >= inicio && horaActual <= fin;
  } else {
    dentroDelHorario = horaActual >= inicio || horaActual <= fin;
  }

  const dominioActual = window.location.hostname; 
  const debeBloquearse = sitios.some(sitio => sitio.length > 2 && dominioActual.includes(sitio));

  if (!debeBloquearse || !dentroDelHorario) return;

  const castigosDificiles = [
    "Reconozco que carezco de disciplina y estoy cediendo a impulsos mediocres.",
    "Mi tiempo es limitado y lo estoy desperdiciando miserablemente en distracciones vacías.",
    "Renuncio a la gratificación instantánea porque tengo metas más importantes que cumplir."
  ];
  
  const textoCastigo = castigosDificiles[Math.floor(Math.random() * castigosDificiles.length)];

  const muro = document.createElement("div");
  muro.style.cssText = "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: black; color: white; z-index: 999999999; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px; box-sizing: border-box;";

  muro.innerHTML = `
    <h1 style="font-size: 40px; margin-bottom: 20px;">PONTE A TRABAJAR.</h1>
    <p style="font-size: 20px; margin-bottom: 10px;">Para desbloquear esta página, escribe exactamente la siguiente frase (con mayúsculas y punto final):</p>
    <p style="font-size: 18px; color: #ff4444; font-weight: bold; margin-bottom: 20px; user-select: none; max-width: 800px;">${textoCastigo}</p>
    <textarea id="campoCastigo" style="width: 80%; max-width: 600px; height: 100px; font-size: 18px; padding: 10px; color: black;" autocomplete="off" spellcheck="false"></textarea>
    <p id="mensajeError" style="color: red; font-size: 20px; font-weight: bold; margin-top: 15px; display: none;">¡TE EQUIVOCASTE! EMPIEZA DE NUEVO.</p>
  `;

  document.body.appendChild(muro);
  document.body.style.overflow = "hidden";

  const input = muro.querySelector("#campoCastigo");
  const mensajeError = muro.querySelector("#mensajeError");

  input.addEventListener("paste", (e) => {
      e.preventDefault();
      alert("No seas tramposo. Escríbelo.");
  });

  input.addEventListener("input", (e) => {
    const textoEscrito = e.target.value;

    if (textoEscrito === textoCastigo) {
      muro.remove();
      document.body.style.overflow = "auto";
      input.value = ""; 

      const cronometro = document.createElement("div");
      cronometro.style.cssText = "position: fixed; top: 20px; right: 20px; background: rgba(10, 10, 10, 0.95); border: 2px solid #ff1a1a; padding: 15px 25px; border-radius: 8px; z-index: 999999999; box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); pointer-events: none; text-align: center; font-family: 'Courier New', Courier, monospace; min-width: 150px;";
      document.body.appendChild(cronometro);

      let tiempoRestante = 600; // Son 10 minutos reales de tiempo prestado.

      const actualizarReloj = () => {
        const minutos = Math.floor(tiempoRestante / 60);
        const segundos = tiempoRestante % 60;
        const tiempoFormateado = `${minutos}:${segundos.toString().padStart(2, '0')}`;
        
        cronometro.innerHTML = `
          <div style="font-size: 11px; color: #aaaaaa; letter-spacing: 2px; margin-bottom: 5px; font-weight: bold;">TIEMPO PRESTADO</div>
          <div style="font-size: 32px; color: #ff1a1a; font-weight: 900; text-shadow: 0 0 10px rgba(255,26,26,0.8);">${tiempoFormateado}</div>
        `;
        
        if (tiempoRestante <= 0) {
          clearInterval(intervalo);
          cronometro.remove(); 
          document.body.appendChild(muro); 
          document.body.style.overflow = "hidden"; 
        }
        tiempoRestante--;
      };

      actualizarReloj(); 
      const intervalo = setInterval(actualizarReloj, 1000);
      
    } 
    else if (!textoCastigo.startsWith(textoEscrito)) {
      mensajeError.style.display = "block";

      chrome.storage.sync.get(['datosFracasos'], function(resultado) {
        const hoy = new Date().toLocaleDateString();
        let datos = resultado.datosFracasos || { fallos: 0, fecha: hoy };
        
        if (datos.fecha !== hoy) {
          datos.fallos = 0;
          datos.fecha = hoy;
        }
        
        datos.fallos += 1;
        chrome.storage.sync.set({ datosFracasos: datos });
      });

      setTimeout(() => {
        input.value = "";
        mensajeError.style.display = "none";
      }, 500);
    }
  });
});