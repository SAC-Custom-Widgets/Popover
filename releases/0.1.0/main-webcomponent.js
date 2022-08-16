(function () {

    let tmpl = document.createElement('template');
    tmpl.innerHTML = '\
    <style>\
        #popover-hint {\
            font-size: 50px;\
            background-color: #aaaaaa;\
            opacity: 0.5;\
            line-height: 64px;\
            height: 100%;\
            border-radius: 100%;\
            text-align: center;\
            display: none;\
        }\
        #popover-hint.visible {\
            display: block;\
        }\
        #popover {\
            position: absolute;\
            display: none;\
        }\
        \
        /*custom*/\
        #popover {\
            padding: 20px;\
            border-radius: 5px;\
            width: 200px;\
        }\
        #popover:before{ \
            content: \'\';\
            display: block;\
            position: absolute;\
            width: 0;\
            height: 0;\
            left: -30px;\
            top: calc(50% - 10px);\
            border: 10px solid transparent;\
            border-right: 20px solid white;\
        }\
        #popover.right:before{\
            display: none;\
        }\
        #popover.right:after{ \
            content: \'\';\
            display: block;\
            position: absolute;\
            width: 0;\
            height: 0;\
            right: -30px;\
            top: calc(50% - 10px);\
            border: 10px solid transparent;\
            border-left: 20px solid white;\
        }\
    </style>\
    <div id="popover" width="100%" height="100%"></div>\
    <div id="popover-hint" width="100%" height="100%" title="This widget is not visible during run time. Please use the API to show popovers.">i</div>\
    ';

    class Popover extends HTMLElement {
        constructor() {
            super();
            this.appendChild(tmpl.content.cloneNode(true));
            this.style.height = "100%";
            this.style.display = "block";
            this._handler = () => this.hidden = true;
            if (document.body.querySelector(".sapAppBuildingOutlineCanvasSplitter")) {
                this.querySelector("#popover-hint").className = "visible";
            }
            this.ref = this.querySelector("#popover").cloneNode();
            document.body.appendChild(this.ref);
            window.addEventListener("resize", this._handler);
        }

        attachScrollListener() {
            const scrollElement = document.querySelector(".sapLumiraStoryReusableLayoutScrollableContainer");
            (scrollElement || window).addEventListener("scroll", this._handler);
        }

        detachScrollListener() {
            const scrollElement = document.querySelector(".sapLumiraStoryReusableLayoutScrollableContainer");
            (scrollElement || window).removeEventListener("scroll", this._handler);
        }

        div() {
            return this.ref;
        }

        BBox() {
            const container = this.div().cloneNode(true);
            container.style.visibility = "hidden";
            container.style.display = "block";
            this.appendChild(container);
            const result = container.getBoundingClientRect();
            this.removeChild(container);
            return result;
        }

        recalcPos() {
            this.div().className = "";
            const bbox = this.BBox();
            const scrollElement = document.querySelector(".sapLumiraStoryReusableLayoutScrollableContainer") || {
                scrollLeft: 0, scrollTop: 0
            };
            const style = this.div().style;

            style.left = this.x - scrollElement.scrollLeft + "px";
            style.top = (this.y - bbox.height / 2) - scrollElement.scrollTop + "px";

            const bb = this.div().getBoundingClientRect();

            if (bb.left + bb.width > window.innerWidth) {
                style.left = bb.left - bb.width - 320 + "px";
                this.div().className = "right";
            }
            if (bb.top + bb.height > window.innerHeight) {
                style.top = window.innerHeight - bb.height + "px";
            }
        }

        set backgroundColor(v) {
            this.div().style.backgroundColor = v;
        }

        set height(v) {
            this.style.height = v;
        }

        set width(v) {
            this.style.width = v;
        }

        set hidden(v) {
            this.div().style.display = v ? "none" : "block";
            if (!v) {
                setTimeout(this.attachScrollListener.bind(this), 120);
            } else {
                this.detachScrollListener();
            }
        }

        set position(v) {
            if (!v) { return; }
            this.x = v.x;
            this.y = v.y;
            this.recalcPos();
            setTimeout(this.recalcPos.bind(this), 100);
        }

        set content(v) {
            this.div().innerHTML = v;
            this.recalcPos();
        }

        get content() {
            return this.div().innerHTML;
        }
    }

    customElements.define('sdk-popover', Popover);
})();