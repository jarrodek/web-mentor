import { SpinnerBase } from './spinner1.js';

function focusBlur(elm, e) {
  if (e.type === 'focus') {
    elm.style.borderColor = '#2196F3';
  } else {
    elm.style.borderColor = '#E0E0E0';
  }
}

class SpinnerDesign extends SpinnerBase {
  constructor() {
    super();
    const style = document.createElement('style');
    style.innerHTML = `
    :host {
      border: 1px #E0E0E0 solid;
      display: inline-flex;
      border-radius: 12px;
      overflow: hidden;
    }

    input,
    button {
      outline: none;
      border: none;
    }

    input {
      padding-left: 0.8rem;
    }

    button {
      font-size: 0.5rem;
      height: 16px;
      background-color: #EEEEEE;
      box-sizing: content-box;
      color: #455A64;
    }
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.querySelector('#value').addEventListener('focus', (e) => focusBlur(this, e));
    this.shadowRoot.querySelector('#value').addEventListener('blur', (e) => focusBlur(this, e));
  }
}

window.customElements.define('spinner-design', SpinnerDesign);
