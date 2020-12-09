import "../css/app.css";

class ShowAfter extends HTMLElement {
  constructor() { super(); }

  static get observedAttributes() { return ['date']; }

  connectedCallback() { this.setOpacity(); }

  attributeChangedCallback() { this.setOpacity(); }

  setOpacity() {
    let display = "none";
    if (new Date(this.getAttribute("date")) < Date.now()) {
      display = "init";
    }
    this.style.display = display;
  }

}

customElements.define("show-after", ShowAfter);
