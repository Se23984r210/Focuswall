const contadorFallos = document.getElementById('contadorFallos');
const insultoTexto = document.getElementById('insultoTexto');

chrome.storage.sync.get(['datosFracasos'], (resultado) => {
  if(contadorFallos) {
    const hoy = new Date().toLocaleDateString();
    let datos = resultado.datosFracasos || { fallos: 0, fecha: hoy };
    
    if (datos.fecha !== hoy) {
      datos.fallos = 0;
    }

    const fallos = datos.fallos;
    contadorFallos.innerText = fallos;
    
    if (fallos === 0) insultoTexto.innerText = "Milagro. Tienes autocontrol.";
    else if (fallos < 5) insultoTexto.innerText = "Débil. Te gana la ansiedad.";
    else if (fallos < 15) insultoTexto.innerText = "Esclavo de la dopamina.";
    else if (fallos < 30) insultoTexto.innerText = "Patético. No tienes salvación.";
    else insultoTexto.innerText = "Tu cerebro está frito.";
  }
});

const inputWeb = document.getElementById('nuevaWeb');
const btnAgregar = document.getElementById('agregarBtn');
const listaWebs = document.getElementById('listaWebs');

function renderizarLista(sitios) {
  listaWebs.innerHTML = '';
  sitios.forEach((sitio, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${sitio.toUpperCase()}</span>
      <button class="delete-btn" data-index="${index}">✕</button>
    `;
    listaWebs.appendChild(li);
  });

  document.querySelectorAll('.delete-btn').forEach(boton => {
    boton.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      const li = e.target.parentElement;

      li.innerHTML = `
        <div class="antimafia-container">
          <span class="antimafia-label">DESBLOQUEO. CALCULA EL VALOR DE X:</span>
          <span style="font-size: 13px; color: #fff; font-weight: bold; font-family: monospace; text-align: center; margin: 4px 0;">5x + 200 = -1000</span>
          <input type="text" class="input-castigo-borrar" placeholder="Respuesta..." autocomplete="off">
          <button class="primary cancelar-borrar" style="margin-top:4px;">Abortar</button>
        </div>
      `;

      const inputCastigo = li.querySelector('.input-castigo-borrar');
      const btnCancelar = li.querySelector('.cancelar-borrar');

      inputCastigo.addEventListener('paste', (ev) => ev.preventDefault());

      inputCastigo.addEventListener('input', (event) => {
        if (event.target.value.trim() === "-240") {
          sitios.splice(index, 1);
          chrome.storage.sync.set({ sitiosBloqueados: sitios }, () => {
            renderizarLista(sitios);
          });
        }
      });

      btnCancelar.addEventListener('click', () => renderizarLista(sitios));
    });
  });
}

chrome.storage.sync.get(['sitiosBloqueados'], (resultado) => {
  const sitios = resultado.sitiosBloqueados || [];
  renderizarLista(sitios);
});

btnAgregar.addEventListener('click', () => {
  let dominio = inputWeb.value.trim().toLowerCase();
  if (dominio === "") return;
  dominio = dominio.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

  chrome.storage.sync.get(['sitiosBloqueados'], (resultado) => {
    const sitios = resultado.sitiosBloqueados || [];
    if (!sitios.includes(dominio)) {
      sitios.push(dominio);
      chrome.storage.sync.set({ sitiosBloqueados: sitios }, () => {
        renderizarLista(sitios);
        inputWeb.value = '';
      });
    }
  });
});

const inputInicio = document.getElementById('horaInicio');
const inputFin = document.getElementById('horaFin');
const btnHorario = document.getElementById('btnHorario');
const msgHorario = document.getElementById('msgHorario');

chrome.storage.sync.get(['horaInicio', 'horaFin'], (res) => {
  if (res.horaInicio) inputInicio.value = res.horaInicio;
  if (res.horaFin) inputFin.value = res.horaFin;
});

btnHorario.addEventListener('click', () => {
  chrome.storage.sync.set({
    horaInicio: inputInicio.value,
    horaFin: inputFin.value
  }, () => {
    msgHorario.style.display = 'block';
    setTimeout(() => msgHorario.style.display = 'none', 2000);
  });
});