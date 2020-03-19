export class ListIconComponent extends HTMLElement {
    constructor(data) {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display: block;
                    position: absolute;
                    background-image: url(assets/initial_bg.svg);
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: 30px;
                    left: 1em;
                    color: white;
                }
               
                :host p {
                    padding: 1em;
                    margin: 0;
                }
             
            </style>
           
           <div class="contact_initial">
                <p>
                    ${
                        data ? data.name.first[0] : "<slot></slot>"
                    }
                </p>
            </div>
        `;

    }

    connectedCallback() {       
    }

    disconnectedCallback() {
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
    }
}
customElements.define('list-icon', ListIconComponent)