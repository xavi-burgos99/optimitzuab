if (typeof op !== 'object')
  var op = {};

op.menu = class {
  buttons = [];

  constructor() {
    this.menu = document.querySelector('.op-menu');
    if (!this.menu) throw new Error('Menu not found');
    this.buttons = document.querySelectorAll('.op-menu-link');
    if (!this.buttons) throw new Error('Menu links not found');
    this.buttons.forEach((button) => {
      this.#checkActive(button);
    });
  }

  #checkActive(button) {
    if (!(button instanceof HTMLElement)) throw new Error('Button is not an HTMLElement');
    if (button.classList.contains('active')) return;
    if (!button.hasAttribute('href')) return;
    const href = button.getAttribute('href').trim('/');
    const path = window.location.pathname.trim('/');
    if (href === path || (href !== '/' && path.startsWith(href)))
      button.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new op.menu();
});