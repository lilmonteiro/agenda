import { ListIconComponent } from "./ListIconComponent.js";

let currentContact;
export class ListItemContainer extends HTMLElement {
    constructor(data) {
        super();
        currentContact = data;

        const shadowRoot = this.attachShadow({ mode: 'open' });

        shadowRoot.innerHTML = /*html*/ `
            <style>
                :host {
                    display:flex;
                    position:relative;
                    cursor: pointer;
                }
                :host(:hover){
                    background-color: rgb(215, 215, 215);
                }
                :host(:active){
                    background-color: rgb(225, 225, 225);
                    opacity: .5;
                }               
                .contact_name {
                    display: flex;
                    position: relative;
                    left: 50px;
                    justify-self:start;
                }
                .contact_name p{
                    padding: 1em;
                    margin: 0;
                }                
            </style>

            <list-icon>
                ${data.name.first[0]}
            </list-icon>

            <div class="contact_name">                
                <p>
                    <slot></slot>
                </p>
            </div>
        `;   
    }
    
    connectedCallback() {        
    }

    disconnectedCallback() {
    }    

    attributeChangedCallback(name, oldValue, newValue){
        console.log(name, oldValue, newValue);
    }
}

customElements.define('list-item-container', ListItemContainer)