/* eslint-disable no-undef */
window.desktopApp = true;
const { ipcRenderer } = require('electron');

const observer = new MutationObserver((mutations) => {
  mutations.forEach(() => {
    ipcRenderer.sendToHost('page', { title: document.title, URL: document.URL });
  });
});

ipcRenderer.on('getTitle', () => {
  ipcRenderer.sendToHost('page', { title: document.title, URL: document.URL });
});

window.onload = () => {
  observer.observe(document.querySelector('title'), { childList: true });
};
