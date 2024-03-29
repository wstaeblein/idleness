class idleness {

    constructor(cfgs, autoStart) {
        this.timeoutid = 0;
        this.throttling = false;
        this.isRunning = false;
        this.startTimeStamp = 0;
        this.setConfigs(cfgs || {});
        this._isIdle = true;
        this.eventNames = [ 'keydown', 'keypress', 'dragstart', 'contextmenu', 'mousedown', 'mousemove', 'scroll', 'touchmove', 'touchstart', 'wheel', 'visibilitychange' ]
        if (autoStart) { this.start(); }       
    }

    get elapsed() { return this.isRunning ? new Date().getTime() - this.startTimeStamp : -1; }
    get isIdle() { return this._isIdle; }

    start() {
        let uactions = this.#userActions.bind(this);
        for (const event of this.eventNames) {
            document.addEventListener(event, uactions, { passive: true });
        }
        addEventListener('resize', uactions);
        this.isRunning = true;
        this.#userActions();
    }

    stop() {
        let uactions = this.#userActions.bind(this);
        if (this.isRunning) {
            for (const event of this.eventNames) {
                document.removeEventListener(event, uactions);
            }
            removeEventListener('resize', uactions);
            if (this.timeoutid) { clearTimeout(this.timeoutid); }
            this.isRunning = false;
        }
    }
    
    setConfigs(cfgs) {
        let defaults = { timeout: 900000, throttle: 250, idleFn: null, useEvent: true };
        this.configs = Object.assign(defaults, this.configs || {}, cfgs);
    }

    #userActions() { 
        if (!this.isRunning || (this.configs.throttle && this.throttling)) { return; }

        if (this._isIdle) { this.#response(false); }
        this._isIdle = false;
        this.startTimeStamp = new Date().getTime();

        if (this.timeoutid) { clearTimeout(this.timeoutid); }
        var self = this;

        this.timeoutid = setTimeout(function() {
            self.#response.bind(self, true)();
            self._isIdle = true;
            self.startTimeStamp = new Date().getTime();
        }, self.configs.timeout);

        if (self.configs.throttle) {
            self.throttling = true; 
            this.#beginThrottle();
        }
    }

    #response(status) { 
        if (typeof this.configs.idleFn == 'function') { this.configs.idleFn(status); } 
        if (this.configs.useEvent) {
            const event = new CustomEvent('idle', { detail: { idle: status }});
            document.dispatchEvent(event);
        }
    }

    #beginThrottle() { setTimeout(() => this.throttling = false, this.configs.throttle); }
}