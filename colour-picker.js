// Template for the colour picker component
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
            width: 20em;
            height: 3em;
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
            width: 98vw;
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
            cursor: text;
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
            flex: 1;
            height: 100%;
            padding-bottom: 0;
            touch-action: none;
            border: 1px solid ButtonBorder;
            border-radius: 10px;
            overflow: hidden;
            margin: 0;
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
                width: 90vw;
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

        #selection-circle {
            position: absolute;
            width: 20px;
            height: 20px;
            pointer-events: none;
            transform: translate(-50%, -50%);
            z-index: 1;
        }

        #selection-circle::before,
        #selection-circle::after {
            content: '';
            position: absolute;
            background: white;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }

        #selection-circle::before {
            width: 20px;
            height: 2px;
            left: 0;
            top: 50%;
        }

        #selection-circle::after {
            width: 2px;
            height: 20px;
            top: 0;
            left: 50%;
        }

        #colour-preview {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
            border: 2px solid #fff;
            border-radius: 50%;
            pointer-events: none;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
            display: none;
            z-index: 2;
        }

        .hue-picker {
            width: 30px;
            height: 100%;
            flex-shrink: 0;
            align-self: stretch;
            border: 1px solid ButtonBorder;
            position: relative;
            overflow: hidden;
            cursor: default;  /* Changed from ns-resize */
            user-select: none;
        }

        .hue-picker canvas {
            width: 100%;
            height: 100%;
            cursor: default;  /* Added to ensure cursor stays default */
        }

        .hue-line {
            position: absolute;
            width: calc(100% + 6px);
            height: 2px;
            background: white;
            left: -3px;
            pointer-events: none;
            box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
            transform: translateY(-50%);
        }

        .picker-container {
            position: relative;
            width: 100%;
            display: flex;
            gap: 10px;
            align-items: stretch;
            overflow: hidden;
            aspect-ratio: 1/1;
        }

        @media (orientation: landscape) {
            #colour-picker-widget {
                width: 90vw;
            }

            .widget-content {
                flex-direction: column;
                align-items: center;
                max-width: 600px;
                margin: 0 auto;
            }

            .picker-container {
                height: min(500px, calc(90vh - 250px));
                max-width: 500px;
                margin: 0 auto;
                padding: 0;
            }

            #colour-picker {
                width: 100%;
                max-width: 500px;
                padding-bottom: min(500px, calc(90vh - 250px));
            }
        }

        @media (max-height: 700px) {
            .picker-container {
                height: calc(60vh - 180px);
            }
        }

        @media (max-height: 600px) {
            .picker-container {
                height: calc(50vh - 180px);
            }
        }
    </style>
    <div class="colour-picker-container">
        <button type="button" class="colour-preview-button"></button>
        <div id="colour-picker-widget" value="">
            <div class="widget-content">
                <div class="picker-container">
                    <div id="colour-picker">
                        <canvas></canvas>
                        <div id="selection-circle"></div>
                        <div id="colour-preview"></div>
                    </div>
                    <div class="hue-picker">
                        <canvas></canvas>
                        <div class="hue-line"></div>
                    </div>
                </div>
                <div class="slider-container">
                    <input type="range" class="alpha-slider" id="alpha-slider" min="0" max="1" step="0.01" value="1">
                </div>
                <div id="selected-colour">
                    <span>R:</span> <input type="text" id="colour-r">
                    <span>G:</span> <input type="text" id="colour-g">
                    <span>B:</span> <input type="text" id="colour-b">
                    <span>A:</span> <input type="text" id="colour-a">
                </div>
                <div class="action-buttons">
                    <button type="button" class="confirm-button">Confirm</button>
                </div>
            </div>
        </div>
    </div>
`;

/**
 * Custom element that provides a color picker with RGB and alpha channel support
 * @extends HTMLElement
 */
class ColourPicker extends HTMLElement {
    /**
     * Initialize the colour picker and set up its DOM structure
     */
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
        
        // Replace hue-related properties
        this.huePicker = shadowRoot.querySelector('.hue-picker');
        this.hueCanvas = this.huePicker.querySelector('canvas');
        this.hueCtx = this.hueCanvas.getContext('2d');
        this.hueLine = shadowRoot.querySelector('.hue-line');
        
        this.alpha = 1;
        this.lastRGB = { r: 255, g: 0, b: 0 };
        this.hue = 0;
        this.saturation = 1;
        this.value = 1;

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

        // Add input event listeners for RGBA inputs
        this.colourRInput.addEventListener('input', () => this.updateFromInputs());
        this.colourGInput.addEventListener('input', () => this.updateFromInputs());
        this.colourBInput.addEventListener('input', () => this.updateFromInputs());
        this.colourAInput.addEventListener('input', () => this.updateFromInputs());

        // Add validation on blur
        this.colourRInput.addEventListener('blur', () => this.validateInput(this.colourRInput, 0, 255));
        this.colourGInput.addEventListener('blur', () => this.validateInput(this.colourGInput, 0, 255));
        this.colourBInput.addEventListener('blur', () => this.validateInput(this.colourBInput, 0, 255));
        this.colourAInput.addEventListener('blur', () => this.validateInput(this.colourAInput, 0, 1));

        // Add canvas resize observer
        this.resizeObserver = new ResizeObserver(() => {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.drawSaturationValue();
        });
        this.resizeObserver.observe(this.canvas);

        // Add hue canvas resize observer
        const hueResizeObserver = new ResizeObserver(() => {
            this.hueCanvas.width = this.hueCanvas.clientWidth;
            this.hueCanvas.height = this.hueCanvas.clientHeight;
            this.drawHueGradient();
        });
        hueResizeObserver.observe(this.hueCanvas);

        // Initialize canvas sizes immediately
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.hueCanvas.width = this.hueCanvas.clientWidth;
        this.hueCanvas.height = this.hueCanvas.clientHeight;

        // Draw gradients immediately
        this.drawHueGradient();
        this.drawSaturationValue();
    }

    /**
     * Set up all event listeners for the colour picker
     */
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
            e.preventDefault();
            this.isPicking = true;
            this.pickColour(e);
            
            const onMouseMove = (e) => {
                if (this.isPicking) {
                    e.preventDefault();
                    this.pickColour(e);
                }
            };
            
            const onMouseUp = () => {
                this.isPicking = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isPicking = true;
            this.pickColour(e);
            
            const onTouchMove = (e) => {
                if (this.isPicking) {
                    e.preventDefault();
                    this.pickColour(e);
                }
            };
            
            const onTouchEnd = () => {
                this.isPicking = false;
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        }, { passive: false });

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

        // Replace hue slider events with canvas events
        const updateHueFromPosition = (clientY) => {
            const rect = this.hueCanvas.getBoundingClientRect();
            const percent = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
            this.hue = Math.round(360 * (1 - percent));
            this.updateHueLine();
            this.drawSaturationValue();
            this.updateColorFromHSV();
        };

        this.hueCanvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            updateHueFromPosition(e.clientY);
            
            const onMouseMove = (e) => {
                e.preventDefault();
                updateHueFromPosition(e.clientY);
            };
            
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        this.hueCanvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            updateHueFromPosition(e.touches[0].clientY);
            
            const onTouchMove = (e) => {
                e.preventDefault();
                updateHueFromPosition(e.touches[0].clientY);
            };
            
            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
            };
            
            document.addEventListener('touchmove', onTouchMove, { passive: false });
            document.addEventListener('touchend', onTouchEnd);
        }, { passive: false });
    }

    /**
     * Toggle the visibility of the colour picker widget
     */
    togglePicker() {
        const isVisible = this.widget.style.display === 'flex';
        this.widget.style.display = isVisible ? 'none' : 'flex';
        if (!isVisible) {
            this.initializePickerWithCurrentColour();
        }
    }

    /**
     * Confirm the selected colour and dispatch change event
     */
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

    /**
     * Update the colour display in the picker and preview button
     * @param {string} colour - RGBA colour string
     */
    updateColour(colour) {
        this.previewButton.style.backgroundColor = colour;
        this.widget.setAttribute('value', colour);
    }

    /**
     * Initialize the picker with the current colour value
     */
    initializePickerWithCurrentColour() {
        const currentColour = this.getAttribute('value');
        if (currentColour) {
            const rgba = currentColour.match(/rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)/);
            if (rgba) {
                this.alpha = parseFloat(rgba[4]);
                this.lastRGB = { r: parseInt(rgba[1]), g: parseInt(rgba[2]), b: parseInt(rgba[3]) };
                
                // Convert RGB to HSV
                const r = this.lastRGB.r / 255;
                const g = this.lastRGB.g / 255;
                const b = this.lastRGB.b / 255;
                
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                const delta = max - min;
                
                this.value = max;
                this.saturation = max === 0 ? 0 : delta / max;
                
                if (delta === 0) this.hue = 0;
                else if (max === r) this.hue = 60 * (((g - b) / delta) % 6);
                else if (max === g) this.hue = 60 * ((b - r) / delta + 2);
                else this.hue = 60 * ((r - g) / delta + 4);
                
                if (this.hue < 0) this.hue += 360;
                
                this.drawSaturationValue();
                
                // Update UI
                const rect = this.canvas.getBoundingClientRect();
                this.selectionCircle.style.left = `${this.saturation * rect.width}px`;
                this.selectionCircle.style.top = `${(1 - this.value) * rect.height}px`;
                
                this.updateColour(currentColour);
                this.updateAlphaSliderGradient();
                
                // Update hue indicator instead of slider
                this.drawHueGradient();
                this.updateHueLine();
            }
        }
    }

    /**
     * Calculate the approximate position of a color in the picker
     * @param {Object} rgb - RGB color object with r, g, b properties
     * @returns {Object} Position object with x, y coordinates
     */
    approximateColorPosition(rgb) {
        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        let h;
        if (delta === 0) h = 0;
        else if (max === r) h = ((g - b) / delta) % 6;
        else if (max === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;
        
        h = h * 60;
        if (h < 0) h += 360;
        
        const s = max === 0 ? 0 : delta / max;
        
        const v = max;
        
        const x = h / 360;
        const y = 1 - v; 
        
        return { x, y };
    }

    /**
     * Specify which attributes should be observed for changes
     * @returns {string[]} Array of attribute names to observe
     */
    static get observedAttributes() {
        return ['value'];
    }

    /**
     * Handle attribute changes
     * @param {string} name - Name of the changed attribute
     * @param {string} oldValue - Previous value
     * @param {string} newValue - New value
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value' && oldValue !== newValue) {
            this.updateColour(newValue);
        }
    }

    /**
     * Draw the colour picker gradient canvas
     */
    drawColourPicker() {
        this.drawSaturationValue();
    }

    /**
     * Draw the saturation and value gradient canvas
     */
    drawSaturationValue() {
        const width = this.canvas.width || this.canvas.clientWidth;
        const height = this.canvas.height || this.canvas.clientHeight;
        
        // Ensure canvas dimensions are set
        if (this.canvas.width !== width) this.canvas.width = width;
        if (this.canvas.height !== height) this.canvas.height = height;
        
        this.ctx.clearRect(0, 0, width, height);

        // Convert hue to RGB for base color
        const hueRgb = this.hsvToRgb(this.hue, 1, 1);
        
        // Create saturation gradient (white to color)
        const satGradient = this.ctx.createLinearGradient(0, 0, width, 0);
        satGradient.addColorStop(0, 'white');
        satGradient.addColorStop(1, `rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b})`);
        this.ctx.fillStyle = satGradient;
        this.ctx.fillRect(0, 0, width, height);

        // Create value gradient (transparent to black)
        const valGradient = this.ctx.createLinearGradient(0, 0, 0, height);
        valGradient.addColorStop(0, 'rgba(0,0,0,0)');
        valGradient.addColorStop(1, 'black');
        this.ctx.fillStyle = valGradient;
        this.ctx.fillRect(0, 0, width, height);
    }

    /**
     * Handle colour picking from the canvas
     * @param {Event} event - Mouse or touch event
     */
    pickColour(event) {
        event.preventDefault(); // Prevent default behavior
        const rect = this.canvas.getBoundingClientRect();
        let x, y;
        
        if (event.touches) {
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        } else {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        }

        // Constrain values to canvas bounds
        x = Math.max(0, Math.min(x, rect.width));
        y = Math.max(0, Math.min(y, rect.height));

        // Update saturation and value
        this.saturation = x / rect.width;
        this.value = 1 - (y / rect.height);

        // Update the selection circle position
        this.selectionCircle.style.left = `${x}px`;
        this.selectionCircle.style.top = `${y}px`;

        // Update the color
        this.updateColorFromHSV();
    }

    /**
     * Start the colour picking process
     * @param {Event} event - Mouse or touch event
     */
    startPicking(event) {
        this.pickColour(event);
    }

    /**
     * Stop the colour picking process
     */
    stopPicking() {
        this.colourPreview.style.display = 'none';
    }

    /**
     * Update the alpha channel value
     */
    updateAlpha() {
        this.alpha = this.alphaSlider.value;
        this.colourAInput.value = this.alpha;
        const rgbaColour = `rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, ${this.alpha})`;
        this.updateColour(rgbaColour);
    }

    /**
     * Update the alpha slider gradient based on current colour
     */
    updateAlphaSliderGradient() {
        const currentColour = `rgb(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b})`;
        this.alphaSlider.style.background = `linear-gradient(to right, rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, 0), rgba(${this.lastRGB.r}, ${this.lastRGB.g}, ${this.lastRGB.b}, 1))`;
        this.alphaSlider.style.color = currentColour;
    }

    /**
     * Validate input values within specified range
     * @param {HTMLInputElement} input - Input element to validate
     * @param {number} min - Minimum allowed value
     * @param {number} max - Maximum allowed value
     */
    validateInput(input, min, max) {
        let value = parseFloat(input.value);
        if (isNaN(value)) value = min;
        value = Math.max(min, Math.min(max, value));
        input.value = value;
        this.updateFromInputs();
    }

    /**
     * Update colour from RGBA input values
     */
    updateFromInputs() {
        const r = Math.min(255, Math.max(0, parseInt(this.colourRInput.value) || 0));
        const g = Math.min(255, Math.max(0, parseInt(this.colourGInput.value) || 0));
        const b = Math.min(255, Math.max(0, parseInt(this.colourBInput.value) || 0));
        const a = Math.min(1, Math.max(0, parseFloat(this.colourAInput.value) || 0));

        this.lastRGB = { r, g, b };
        this.alpha = a;
        
        const rgbaColour = `rgba(${r}, ${g}, ${b}, ${a})`;
        this.updateColour(rgbaColour);
        this.updateAlphaSliderGradient();
        
        // Update alpha slider to match
        this.alphaSlider.value = a;

        // Move selection circle to match RGB values
        const rect = this.canvas.getBoundingClientRect();
        const pos = this.approximateColorPosition(this.lastRGB);
        this.selectionCircle.style.left = `${pos.x * rect.width}px`;
        this.selectionCircle.style.top = `${pos.y * rect.height}px`;
    }

    /**
     * Update color from HSV values
     */
    updateColorFromHSV() {
        const rgb = this.hsvToRgb(this.hue, this.saturation, this.value);
        this.lastRGB = rgb;
        const rgbaColour = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${this.alpha})`;
        
        this.colourRInput.value = rgb.r;
        this.colourGInput.value = rgb.g;
        this.colourBInput.value = rgb.b;
        this.colourAInput.value = this.alpha;
        
        this.updateColour(rgbaColour);
        this.updateAlphaSliderGradient();
    }

    /**
     * Convert HSV to RGB
     * @param {number} h - Hue
     * @param {number} s - Saturation
     * @param {number} v - Value
     * @returns {Object} RGB color object with r, g, b properties
     */
    hsvToRgb(h, s, v) {
        const c = v * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = v - c;
        
        let r = 0, g = 0, b = 0;
        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
        else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
        else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
        else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
        else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }
        
        return {
            r: Math.round((r + m) * 255),
            g: Math.round((g + m) * 255),
            b: Math.round((b + m) * 255)
        };
    }

    /**
     * Draw the hue gradient on the canvas
     */
    drawHueGradient() {
        const width = this.hueCanvas.width || this.hueCanvas.clientWidth;
        const height = this.hueCanvas.height || this.hueCanvas.clientHeight;
        
        // Ensure canvas dimensions are set
        if (this.hueCanvas.width !== width) this.hueCanvas.width = width;
        if (this.hueCanvas.height !== height) this.hueCanvas.height = height;

        const gradient = this.hueCtx.createLinearGradient(0, 0, 0, height);
        
        // Create smoother gradient with more color stops
        for (let i = 0; i <= 360; i += 1) {
            const rgb = this.hsvToRgb(i, 1, 1);
            gradient.addColorStop(1 - (i / 360), `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);
        }
        
        this.hueCtx.fillStyle = gradient;
        this.hueCtx.fillRect(0, 0, width, height);
    }

    /**
     * Update the hue line position
     */
    updateHueLine() {
        const percent = 1 - (this.hue / 360);
        this.hueLine.style.top = `${percent * 100}%`;
    }
}

// Register the custom element if not already registered
if (!customElements.get('colour-picker')) {
    customElements.define('colour-picker', ColourPicker);
}

export default ColourPicker;