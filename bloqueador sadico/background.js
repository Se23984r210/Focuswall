// El castigo final si desinstalan la extensión por cobardes
chrome.runtime.setUninstallURL("https://www.google.com/search?q=por+que+soy+tan+debil+y+no+tengo+disciplina");

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.includes("chrome://extensions")) {
    
    chrome.storage.sync.get(['horaInicio', 'horaFin'], (res) => {
      const inicio = res.horaInicio || "00:00";
      const fin = res.horaFin || "23:59";
      
      const ahora = new Date();
      const horaActual = ahora.getHours().toString().padStart(2, '0') + ":" + ahora.getMinutes().toString().padStart(2, '0');

      let bloqueado = false;
      if (inicio <= fin) {
        bloqueado = horaActual >= inicio && horaActual <= fin;
      } else {
        bloqueado = horaActual >= inicio || horaActual <= fin;
      }

      if (bloqueado) {
        chrome.tabs.remove(tabId); // Te cierra la pestaña al instante
      }
    });
  }
});