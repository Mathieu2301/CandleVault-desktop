const { ipcRenderer } = require('electron');

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    ipcRenderer.sendToHost('title', document.title);
  });
});

ipcRenderer.on('getTitle', () => {
  ipcRenderer.sendToHost('title', document.title);
});

window.onload = () => {
  observer.observe(document.querySelector('title'), { childList: true });
};
