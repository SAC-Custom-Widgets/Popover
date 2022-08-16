(function () {
    let tmpl = document.createElement('template');
    tmpl.innerHTML = '\
        <form id="form">\
            <table style="width: 100%;">\
            <tr>\
                <td style="width: 55%;">Background Color</td>\
                <td><input id="aps_bgcolor" type="color" name="backgroundColor"></td>\
            </tr>\
            </table>\
        </form>\
    ';

    class PopoverPropertySheet extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: 'open' });
            this._shadowRoot.appendChild(tmpl.content.cloneNode(true));
            // this._shadowRoot.getElementById("form").addEventListener("submit", this._submit.bind(this));
            this._shadowRoot.querySelectorAll("#form input").forEach(elem => {
                elem.addEventListener("change", this._submit.bind(this));
            });
            this._shadowRoot.querySelectorAll("#form textarea").forEach(elem => {
                elem.addEventListener("change", e => {
                    e.preventDefault();
                    this.dispatchEvent(new CustomEvent('propertiesChanged', {
                        "detail": {
                            "properties": {
                                [e.target.name]: JSON.parse(e.target.value)
                            }
                        }
                    }));
                    return false;
                });
            });
        }

        _submit(e) {
            e.preventDefault();
            this.dispatchEvent(new CustomEvent('propertiesChanged', {
                "detail": {
                    "properties": {
                        [e.target.name]: e.target.value
                    }
                }
            }));
            return false;
        }

        set backgroundColor(v) {
            this._shadowRoot.getElementById("aps_bgcolor").value = v;
        }

    }

    customElements.define('sdk-popover-aps', PopoverPropertySheet);
})();