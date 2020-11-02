import { LitElement, html, css } from 'lit-element';

export class A11yTabindex extends LitElement {
  static get properties() {
    return {
      progress: { type: Number },
    };
  }

  static get styles() {
    return css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        font-size: calc(10px + 2vmin);
        color: #1a2b42;
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
      }

      :host([alteredbackground]) {
        background-color: #DCE775;
      }

      main {
        flex-grow: 1;
      }

      .app-footer {
        font-size: calc(12px + 0.5vmin);
        align-items: center;
      }

      .app-footer a {
        margin-left: 5px;
      }

      label {
        display: block;
      }

      code {
        display: block;
        margin-top: 64px;
        background-color: #fff;
        padding: 24px;
        font-size: 1.5rem;
      }

      #loading {
        position: relative;
      }

      .progress {
        background-color: #ffc107;
      }
    `;
  }

  constructor() {
    super();
    this.progress = 0;
  }

  firstUpdated() {
    setTimeout(() => {
      this._tick();
    }, 2000);
  }

  _tick() {
    const { progress } = this;
    if (progress === 100) {
      return;
    }
    this.progress = progress + 1;
    requestAnimationFrame(this._tick.bind(this));
  }

  render() {
    const { progress } = this;
    return html`
      <main>
        <h1>Custom progress bar</h1>

        <label for="loading">Loading content..</label>
        <div id="loading">
          <div class="progress" role="progressbar" style="width: ${progress}%">${progress}%</div>
        </div>

        <code>
        ${`<label for="loading">Loading content..</label>`}<br/>
        ${`<progress id="loading" role="progressbar" style="width: ${progress}%"> ${progress}% </progress>`}
        </code>
      </main>
    `;
  }


}
