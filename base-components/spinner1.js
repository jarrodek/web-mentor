function renderValue(elm) {
  const { value = 0 } = elm;
  elm.shadowRoot.querySelector('#value').value = value;
}

function upHandler(elm) {
  const { value = 0 } = elm;
  elm.value = value + 1;
  renderValue(elm);
}

function downHandler(elm) {
  const { value = 0 } = elm;
  elm.value = value - 1;
  renderValue(elm);
}

export class SpinnerBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
    <style>
    :host {
      display: flex;
    }

    .actions {
      display: flex;
      flex-direction: column;
    }
    </style>

    <input id="value" type="text" tabindex="-1"/>

    <div class="actions">
      <button id="up" tabindex="-1">▲</button>
      <button id="down" tabindex="-1">▼</button>
    </div>
    `;

    this.shadowRoot.querySelector('#up').addEventListener('click', () => upHandler(this));
    this.shadowRoot.querySelector('#down').addEventListener('click', () => downHandler(this));
  }

  connectedCallback() {
    renderValue(this);
    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', '0');
    }
  }
}

window.customElements.define('spinner-base', SpinnerBase);
