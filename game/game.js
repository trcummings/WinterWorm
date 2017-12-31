import { Application } from 'pixi.js';

document.addEventListener('DOMContentLoaded', () => {
  console.log('dom content loaded');

  const app = new Application(800, 600, { backgroundColor: 0x1099bb });
  document.body.appendChild(app.view);
});
