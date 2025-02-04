const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            color-scheme: light dark;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .colour-picker-container {
            position: relative;
            display: inline-block;
        }
        button.colour-preview-button {
            width: 40px;
            height: 40px;
            border: 2px solid ButtonBorder;
            border-radius: 8px;
            cursor: pointer;
            position: relative;
            padding: 0;
            outline: none;
            background: none;
        }
        #colour-picker-widget {
            display: none;
            position: fixed;
            z-index: 9999;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: min(90vw, 600px);
            max-height: 85vh;
            flex-direction: column;
            align-items: center;
            background-color: Canvas;
            color: CanvasText;
            border: 1px solid ButtonBorder;
            border-radius: 10px;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
        }
        .widget-content {
            width: 100%;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 15px;
            max-height: calc(85vh - 40px);
            overflow-y: auto;
            padding-right: 5px; /* Prevent content shift when scrollbar appears */
        }
        /* Slider specific styles */
        .alpha-slider {
            -webkit-appearance: none;
            appearance: none;
            width: 95%;
            margin: 0 auto;
            display: block;
            height: 30px;
            border-radius: 15px;
            outline: none;
            opacity: 0.7;
            -webkit-transition: .2s;
            transition: opacity .2s;
            border: 1px solid ButtonBorder;
            flex-shrink: 0;
        }

        .alpha-slider:hover {
            opacity: 1;
        }

        .alpha-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            background: currentColor;
        }

        .alpha-slider::-moz-range-thumb {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 2px solid #fff;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            cursor: pointer;
            background: currentColor;
        }

        @media (max-width: 768px) {
            .alpha-slider {
                height: 40px;
            }
            .alpha-slider::-webkit-slider-thumb,
            .alpha-slider::-moz-range-thumb {
                width: 50px;
                height: 50px;
            }
        }

        /* Selected colour inputs */
        #selected-colour {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 5px;
            flex-shrink: 0;
        }

        #selected-colour input {
            width: 50px;
            padding: 2px 4px;
            text-align: center;
            background-color: Field;
            color: FieldText;
            border: 1px solid ButtonBorder;
            border-radius: 4px;
            font: inherit;
        }

        /* Confirm button */
        .confirm-button {
            background-color: ButtonFace;
            color: ButtonText;
            border: 1px solid ButtonBorder;
            padding: 8px 16px;
            border-radius: 4px;
            width: 100%;
            cursor: pointer;
            font: inherit;
        }

        .confirm-button:hover {
            background-color: ButtonHover;
        }

        @media (prefers-color-scheme: dark) {
            #colour-picker-widget {
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
        }

        #colour-picker {
            position: relative;
            width: 100%;
            padding-bottom: min(100%, calc(100% - 180px)); /* Adjust based on other elements */
            touch-action: none;
            border: 1px solid ButtonBorder;
            border-radius: 10px;
            flex-shrink: 0;
            margin-bottom: 10px;
            overflow: hidden;
        }

        #colour-picker canvas {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: inherit;
        }

        @media (orientation: landscape) {
            #colour-picker-widget {
                width: min(90vw, 800px);
            }

            .widget-content {
                flex-direction: column;
                align-items: center;
                max-width: 600px;
                margin: 0 auto;
            }

            #colour-picker {
                width: 100%;
                max-width: 500px;
                padding-bottom: min(500px, calc(90vh - 250px));
            }
        }

        @media (max-height: 700px) {
            #colour-picker {
                padding-bottom: min(100%, calc(60vh - 180px));
            }
        }

        @media (max-height: 600px) {
            #colour-picker {
                padding-bottom: min(100%, calc(50vh - 180px));
            }
        }
    </style>
    <div class="colour-picker-container">
        <button type="button" class="colour-preview-button"></button>
        <div id="colour-picker-widget" value="">
            <div class="widget-content">
                <div id="colour-picker">
                    <canvas></canvas>
                    <div id="selection-circle"></div>
                    <div id="colour-preview"></div>
                </div>
                <div class="slider-container">
                    <input type="range" class="alpha-slider" id="alpha-slider" min="0" max="1" step="0.01" value="1">
                </div>
                <div id="selected-colour">
                    <span>R:</span> <input type="text" id="colour-r" readonly>
                    <span>G:</span> <input type="text" id="colour-g" readonly>
                    <span>B:</span> <input type="text" id="colour-b" readonly>
                    <span>A:</span> <input type="text" id="colour-a" readonly>
                </div>
                <div class="action-buttons">
                    <button type="button" class="confirm-button">Confirm</button>
                </div>
            </div>
        </div>
    </div>
`;

class ColourPicker extends HTMLElement {
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.widget = shadowRoot.querySelector('#colour-picker-widget');
        this.previewButton = shadowRoot.querySelector('.colour-preview-button');
        this.confirmButton = shadowRoot.querySelector('.confirm-button');
        this.canvas = shadowRoot.querySelector('#colour-picker canvas');
        this.ctx = this.canvas.getContext('2d');
        this.colourRInput = shadowRoot.querySelector('#colour-r');
        this.colourGInput = shadowRoot.querySelector('#colour-g');
        this.colourBInput = shadowRoot.querySelector('#colour-b');
        this.colourAInput = shadowRoot.querySelector('#colour-a');
        this.selectionCircle = shadowRoot.querySelector('#selection-circle');
        this.colourPreview = shadowRoot.querySelector('#colour-preview');
        this.alphaSlider = shadowRoot.querySelector('#alpha-slider');
        
        this.alpha = 1;
        this.lastRGB = { r: 255, g: 0, b: 0 };

        this.boundPickColour = this.pickColour.bind(this);
        this.setupEventListeners();
        this.drawColourPicker();
        
        if (this.hasAttribute('value')) {
            this.updateColour(this.getAttribute('value'));
        }
        
        new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
                    this.updateColour(this.getAttribute('value'));
                }
            });
        }).observe(this, { attributes: true });
    }

    setupEventListeners() {
        this.previewButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.togglePicker();
        });
        
        this.confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.confirmColour();
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.startPicking(e);
            document.addEventListener('mousemove', this.boundPickColour);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', this.boundPickColour);
                this.stopPicking();
            }, { once: true });
        });

        this.canvas.addEventListener('touchstart', (e) => {
            this.startPicking(e);
            document.addEventListener('touchmove', this.boundPickColour);
            document.addEventListener('touchend', () => {
                document.removeEventListener('touchmove', this.boundPickColour);
                this.stopPicking();
            }, { once: true });
        });

        this.alphaSlider.addEventListener('input', () => this.updateAlpha());

        this.widget.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        document.addEventListener('click', (e) => {
            if (!this.widget.contains(e.target) && 
                !this.previewButton.contains(e.target) && 
                this.widget.style.display === 'flex') {
                this.widget.style.display = 'none';
            }
        });
    }

    togglePicker() {
        const isVisible = this.widget.style.display === 'flex';
        this.widget.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            this.initializePickerWithCurrentColour();
        }
    }

    confirmColour() {
        const currentColour = this.widget.getAttribute('value');
        this.setAttribute('value', currentColour);
        this.previewButton.style.backgroundColor = currentColour;
        this.widget.style.display = 'none';
        
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value: currentColour },
            bubbles: true
        }));
    }

    updateColour(colour) {
        this.previewButton.style.backgroundColor = colour;
        this.widget.setAttribute('value', colour);
    }

    initializePickerWithCurrentColour() {
        const currentColour = this.getAttribute('value');
        if (currentColour) {
        }
    }

    static get observedAttributes() {
        return ['value'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.updateColour(newValue);
        }
    }

    drawColourPicker() {
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(1 / 6, 'orange');
        gradient.addColorStop(2 / 6, 'yellow');
        gradient.addColorStop(3 / 6, 'green');
        gradient.addColorStop(4 / 6, 'cyan');
        gradient.addColorStop(5 / 6, 'blue');
        gradient.addColorStop(1, 'magenta');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const whiteGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        whiteGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        whiteGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = whiteGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const blackGradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        blackGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        blackGradient.addColorStop(1, 'rgba(0, 0, 0, 1)');
        this.ctx.fillStyle = blackGradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    pickColour(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.touches ? event.touches[0].clientX - rect.left : event.clientX - rect.left;
        let y = event.touches ? event.touches[0].clientY - rect.top : event.clientY - rect.top;

        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        const imageData = this.ctx.getImageData(x * (this.canvas.width / rect.width), y * (this.canvas.height / rect.height), 1, 1).data;
        this.lastRGB = { r: imageData[0], g: imageData[1], b: imageData[2] };
        const rgbaColour = `rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, ${this.alpha})`;
        
        this.colourRInput.value = this.lastRGB.r;
        this.colourGInput.value = this.lastRGB.g;
        this.colourBInput.value = this.lastRGB.b;
        this.colourAInput.value = this.alpha;
        
        this.selectionCircle.style.left = `${x - this.selectionCircle.offsetWidth / 2}px`;
        this.selectionCircle.style.top = `${y - this.selectionCircle.offsetHeight / 2}px`;
        
        this.updateColour(rgbaColour);
        this.updateAlphaSliderGradient();
    }

    startPicking(event) {
        this.pickColour(event);
    }

    stopPicking() {
        this.colourPreview.style.display = 'none';
    }

    updateAlpha() {
        this.alpha = this.alphaSlider.value;
        this.colourAInput.value = this.alpha;
        const rgbaColour = `rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, ${this.alpha})`;
        this.updateColour(rgbaColour);
    }

    updateAlphaSliderGradient() {
        const currentColour = `rgb(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b})`;
        this.alphaSlider.style.background = `linear-gradient(to right, rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, 0), rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, 1))`;
        this.alphaSlider.style.color = currentColour;
    }
}

if (!customElements.get('colour-picker')) {
    customElements.define('colour-picker', ColourPicker);
}

export default ColourPicker;