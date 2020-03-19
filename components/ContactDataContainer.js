export class ContactDataContainer extends HTMLElement {
    constructor(iconsrc) {
        super();

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = /*html*/ `
            <style>
               
                .label-icon:before{
                    content: "";
                    background-image: url(${iconsrc});
                    background-repeat: no-repeat;
                    background-position: center center;
                    align-self: center;
                    float: left;
                    display: inline-block;
                    width: 1em;
                    height: 1em;
                    top: .05em;
                    position: relative;
                    margin-right: .5em;
                }

                :host p{
                    padding: 0;
                    margin: 0;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

               
            </style>
            <div>
                <p class="label-icon">
                    <slot></slot>
                </p>
            </div>
        `
    }

    connectedCallback() {
        console.log('the element is in the DOM');
    }

    disconnectedCallback() {
        console.log('the element is out the DOM');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(name, oldValue, newValue);
    }
}

customElements.define('contact-data-container', ContactDataContainer);