/**
 * kDown 1.0.0
 * @author Alex Duloz ~ @alexduloz
 * MIT license
 *
 * Documentation intended for Closure Compiler
 * https://developers.google.com/closure/compiler/docs/js-for-compiler
 */
(function() {


    if (!window.addEventListener) {
        return;
    }

    // trim for older browsers
    if (!String.prototype.trim) {
        String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }

    // Our kDown blueprint
    var self = blueprint = {

        /**
         * "Private" variables
         *
         * @return {kDown}
         */
        _: function() {

            this._ignoreInput = false;

            this._cmdOrCtrl = true;

            this._logKeyCodes = false;

            this._preventDefault = true;

            this._whenDownKeys = [];

            this._whenDownCallback = [];

            this._whenDownContext = [];

            this._whenShortcutKeys = [];

            this._whenShortcutCallback = [];

            this._whenShortcutContext = [];

            this._event;

            this._down = {};

            this._count = 0;

            this._keysAsString = [
                "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
                "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
                "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12",
                "left", "up", "right", "down", "arrayleft", "arrayup", "arrayright", "arraydown",
                "alt", "altkey", "ctrl", "ctrlkey", "shift", "shiftkey", "meta", "metakey", "cmd", "cmdkey",
                "backspace", "del", "delete", "end", "enter", "escape", "esc", "home", "insert", "pageup", "pagedown", "tab", "space"
            ];

            this._keysAsStringLength = this._keysAsString.length;

            this._keysAsKeyCode = [
                // Letters
                65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
                // Numbers
                48, 49, 50, 51, 52, 53, 54, 55, 56, 57,
                // F(n)
                112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
                // Arrows
                37, 38, 39, 40, 37, 38, 39, 40,
                // Modifiers
                18, 18, 17, 17, 16, 16, [224, 17, 91, 93], [224, 17, 91, 93], [224, 17, 91, 93], [224, 17, 91, 93],
                // Misc (tab, del, esc...)
                8, 8, 46, 35, 13, 27, 27, 36, 45, 33, 34, 9, 32
            ];

            this._keysAsKeyCodeLength = this._keysAsKeyCode.length;

            this._keyUpHandler = function(event) {
                if (self._ignoreInput === true) {
                    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                        return;
                    }
                }

                self._event = event;

                if (event.metaKey) {
                    self._down = {};
                    self._count = 0;
                    return;
                }

                delete self._down[event.which];

                self._count--;
                if (self._count < 0) {
                    self._count = 0;
                }
            };

            this._keyDownHandler = function(event) {
                if (self._logKeyCodes === true) {
                    console.log(event.which);
                }

                if (self._ignoreInput === true) {
                    if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                        return;
                    }
                }

                self._event = event;

                var whenShortcutKeysLength = self._whenShortcutKeys.length;

                if (whenShortcutKeysLength > 0) {
                    for (var k = 0; k < whenShortcutKeysLength; k++) {
                        if (self.isShortcut(self._whenShortcutKeys[k])) {

                            // Assume a callback will be fired
                            var fireCallback = true;
                            // Is our current combination bound to a certain context?
                            if (self._whenShortcutContext[k]) {

                                var l = self._whenShortcutContext[k].length;

                                // Since we have a context, callback must be proven
                                fireCallback = false;

                                for (var i = 0; i < l; i++) {
                                    if ( !! (self._whenShortcutContext[k][i] && self._whenShortcutContext[k][i].nodeType === 1)) {
                                        if (event.target.getAttribute("data-whenshortcut-context-" + k) === null || +event.target.getAttribute("data-whenshortcut-context-" + k) !== i) {
                                            if (fireCallback === true) {
                                                continue;
                                            }
                                        } else {
                                            fireCallback = true;
                                        }
                                    }
                                }
                            }

                            if (fireCallback === true) {
                                if (self.isFunction(self._whenShortcutCallback[k])) {
                                    self._whenShortcutCallback[k](self._event);
                                }
                            }
                        }
                    }
                }

                // The cmd key prevents us from counting keys and is only allowed
                // for shortcuts (modifiers + one "regular" key).
                // We don't count keys if the cmd key is down.
                if (event.metaKey) {
                    self._down = {};
                    self._count = 0;
                    return;
                }

                if (!self._down[event.which]) {
                    self._count++;
                }

                self._down[event.which] = true;

                var whenDownKeysLength = self._whenDownKeys.length;

                if (whenDownKeysLength > 0) {

                    for (var k = 0; k < whenDownKeysLength; k++) {
                        if (self.isDown(self._whenDownKeys[k])) {

                            // Assume a callback will be fired
                            var fireCallback = true;
                            // Is our current combination bound to a certain context?
                            if (self._whenDownContext[k]) {

                                var l = self._whenDownContext[k].length;

                                // Since we have a context, callback must be proven
                                fireCallback = false;

                                for (var i = 0; i < l; i++) {
                                    if ( !! (self._whenDownContext[k][i] && self._whenDownContext[k][i].nodeType === 1)) {
                                        if (event.target.getAttribute("data-whendown-context-" + k) === null || +event.target.getAttribute("data-whendown-context-" + k) !== i) {
                                            if (fireCallback === true) {
                                                continue;
                                            }
                                        } else {
                                            fireCallback = true;
                                        }
                                    }
                                }
                            }

                            if (fireCallback === true) {
                                if (self.isFunction(self._whenDownCallback[k])) {
                                    self._whenDownCallback[k](self._event);
                                }
                            }
                        }
                    }
                }
            }

            return this;
        },

        /**
         * Config:
         * Tells kDown whether to listen
         * or not to input fields.
         *
         * Default is false.
         *
         * @param {Boolean=} [yesOrNope]
         * @see kDown#config
         * @return {kDown}
         */
        ignoreInput: function(yesOrNope) {
            this._ignoreInput = (!this.isBool(yesOrNope)) ? false : yesOrNope;
            return this;
        },

        /**
         * Config:
         * Tells kDown to consider the
         * "Command" and "Ctrl" as if
         * they were the same key.
         *
         * Default is true.
         *
         * @param {Boolean=} [yesOrNope]
         * @see kDown#config
         * @return {kDown}
         */
        cmdOrCtrl: function(yesOrNope) {
            this._cmdOrCtrl = (!this.isBool(yesOrNope)) ? true : yesOrNope;
            return this;
        },

        /**
         * Config:
         * Tells kDown whether to log key codes
         * or not.
         *
         * Note: should probably set to false
         * in production.
         *
         * Default is false.
         *
         * @param {Boolean=} [yesOrNope]
         * @see kDown#config
         * @return {kDown}
         */
        logKeyCodes: function(yesOrNope) {
            this._logKeyCodes = (!this.isBool(yesOrNope)) ? false : yesOrNope;
            return this;
        },

        /**
         * Config:
         * Tells kDown whether to prevent default
         * behavior of a given combination or not.
         * If set to true, applies *only* if
         * a given combination has been detected.
         *
         * Default is true.
         *
         * @param {Boolean=} [yesOrNope]
         * @see kDown#config
         * @return {Object}
         */
        preventDefault: function(yesOrNope) {
            this._preventDefault = (!this.isBool(yesOrNope)) ? true : yesOrNope;
            return this;
        },

        /**
         * Provides a shortcut for
         * other config methods.
         *
         * @param {Object} userConfig
         * @see kDown#ignoreInput
         * @see kDown#cmdOrCtrl
         * @see kDown#logKeyCodes
         * @see kDown#preventDefault
         * @return {kDown}
         */
        config: function(userConfig) {
            if (!this.isObject(userConfig)) {
                return;
            }

            if (this.isBool(userConfig.ignoreInput)) {
                this._ignoreInput = userConfig.ignoreInput;
            }

            if (this.isBool(userConfig.cmdOrCtrl)) {
                this._cmdOrCtrl = userConfig.cmdOrCtrl;
            }

            if (this.isBool(userConfig.logKeyCodes)) {
                this._logKeyCodes = userConfig.logKeyCodes;
            }

            if (this.isBool(userConfig.preventDefault)) {
                this._preventDefault = userConfig.preventDefault;
            }
            return this;
        },

        /**
         * Listens to keydown and keyup events
         * and attaches handlers (defined in the "_" method).
         *
         * kDown automatically listens to window.document.
         * To change that behavior, use the "remove" method
         * and call "listen" again for the context of your
         * choice.
         *
         * @param {Window|Document|HTMLElement} context What to listen to
         * @return {kDown}
         */
        listen: function(context) {
            context.addEventListener("keyup", self._keyUpHandler, true);
            context.addEventListener("keydown", self._keyDownHandler, true);
            return this;
        },

        /**
         * Quits listening to context.
         *
         * @param {Window|Document|HTMLElement} context
         * @return {kDown}
         */
        remove: function(context) {
            context.removeEventListener("keyup", self._keyUpHandler, true);
            context.removeEventListener("keydown", self._keyDownHandler, true);
            return this;
        },

        /**
         * Detects if a shortcut has been triggered.
         *
         * A shortcut consists of a series of modifiers
         * plus *one* single "regular" key.
         *
         * This method should be used inside a keydown handler.
         * If it makes more sense to you to pass the event
         * object to this method, you can. If not provided,
         * kDown will use the event object it has set internally.
         *
         * @param {Number|String|Array} keys
         * @param {Event=} [event]
         * @return {Boolean}
         */
        isShortcut: function(keys, event) {
            var event = event || self._event,
                toAnalyze = this.format(keys);

            if (self.isUndefined(event)) {
                return false;
            }

            var toAnalyzeLength = toAnalyze.length;

            if (toAnalyzeLength === 0) {
                return false;
            }

			var found = 0;
			var yo = [];

            for (var k = 0; k < toAnalyzeLength; k++) {
                // shiftKey
                if (toAnalyze[k] === 16 && event.shiftKey) {
                    found++;
                }
                // altKey
                else if (toAnalyze[k] === 18 && event.altKey) {
                    found++;
                }
                // ctrlKey || metaKey
                else if ( (self._cmdOrCtrl === true) && ( toAnalyze[k] === 17 || (this.isArray(toAnalyze[k])) && toAnalyze[k].toString() === [224, 17, 91, 93].toString() ) ) { 
                    if (event.metaKey || event.ctrlKey) {
                        found++;
                    }

                }
                // ctrlKey only
                else if (self._cmdOrCtrl === false && toAnalyze[k] === 17) {
                    if (event.ctrlKey) {
                        found++;
                    }
                }
                // metaKey only
                else if (self._cmdOrCtrl === false && ( (this.isArray(toAnalyze[k])) && toAnalyze[k].toString() === [224, 17, 91, 93].toString() ) ) {
                    if (event.metaKey) {
                        found++;
                    }
                    // "Regular" keys
                } else if (event.which === toAnalyze[k] || ((this.isArray(toAnalyze[k])) && toAnalyze[k].indexOf(event.which) !== -1)) {
                    found++;
                }
            }
			return ( found === toAnalyzeLength );
        },

        /**
         * Detects if a shortcut has been triggered.
         *
         * A shortcut consists of a series of modifiers
         * plus *one* single "regular" key.
         *
         * This method works as a standalone. No need to
         * include it inside an event handler.
         *
         * @param {Number|String|Array} keys
         * @param {function([event])} callback
         * @param {HTMLElement} context
         * @return {kDown}
         */
        whenShortcut: function(keys, callback, context) {
            this._whenShortcutKeys.push(keys);
            this._whenShortcutCallback.push(callback);

            if (context) {
                // We must be able to loop through our context
                var context = (toString.call(context) !== "[object HTMLCollection]") ? new Array(context) : context,
                    lastId = (this._whenShortcutKeys.length - 1),
                    l = context.length;
                for (var i = 0; i < l; i++) {
                    if ( !! (context[i] && context[i].nodeType === 1)) {
                        context[i].setAttribute("data-whenshortcut-context-" + lastId, i);
                    }
                }
            }

            this._whenShortcutContext.push(context);

            return this;
        },

        /**
         * Detects if a series of keys are down.
         *
         * This method should be used inside a keydown handler.
         * If it makes more sense to you to pass the event
         * object to this method, you can. If not provided,
         * kDown will use the event object it has set internally.
         *
         * IMPORTANT: The Mac command key is a problematic one
         * (or rather, its implementation and its detection is problematic).
         * If you want to listen to more than one "regular" key
         * (say "a+b"), kDown has to count keys, which the cmd
         * prevents from doing.
         *
         * If you're going to use this method, it will not
         * work with combinations involving the cmd key.
         * You should use the isShortcut method instead.
         *
         * More on the command key: 
         * http://bitspushedaround.com/on-a-few-things-you-may-not-know-about-the-hellish-command-key-and-javascript-events
         *
         * @param {Integer|String|Array} keys
         * @param {Event=} [event]
         * @return {Boolean}
         */
        isDown: function(keys, event) {
            var event = event || self._event;

            var toAnalyze = this.format(keys);

            var i = 0,
                found = 0,
                toAnalyzeLength = toAnalyze.length;

            for (var prop in self._down) {
                if (self._down.hasOwnProperty(prop)) {
                    for (var k = 0; k <= toAnalyzeLength; k++) {

                        if (this.isArray(toAnalyze[k])) {
                            // Why "+prop" sintead of "prop"? 
                            // to make sure we have the correct
                            // type: (int) in our case.
                            if (toAnalyze[k].indexOf(+prop) !== -1) {
                                found++;
                            }
                        } else if (toAnalyze[k] === +prop) {
                            found++;
                        }
                    }
                    i++;
                }
            }

            if ((i === found) && (toAnalyzeLength === found)) {
                if (this._preventDefault === true) {
                    event.preventDefault;
                }
                return true;
            }
            return false;
        },

        /**
         * Detects if a combination has been triggered.
         *
         * This method works as a standalone. No need to
         * include it inside an event handler.
         *
         * @param {Integer|String|Array} keys
         * @param {function([event])} callback
         * @param {HTMLElement} context
         * @return {Object}
         */
        whenDown: function(keys, callback, context) {
            this._whenDownKeys.push(keys);
            this._whenDownCallback.push(callback);

            if (context) {
                // We must be able to loop through our context
                var context = (toString.call(context) !== "[object HTMLCollection]") ? new Array(context) : context,
                    lastId = (this._whenDownKeys.length - 1),
                    l = context.length;
                for (var i = 0; i < l; i++) {
                    if ( !! (context[i] && context[i].nodeType === 1)) {
                        context[i].setAttribute("data-whendown-context-" + lastId, i);
                    }
                }
            }

            this._whenDownContext.push(context);

            return this;
        },

        /**
         * Tells how many keys are down.
         *
         * @return {Number}
         */
        countKeys: function() {
            return this._count;
        },

        /**
         * Returns an array of the key codes
         * of the keys that are down.
         *
         * @return {Array}
         */
        getKeys: function() {
            var result = [];

            for (var prop in self._down) {
                if (this._down.hasOwnProperty(prop)) {
                    // Why "+prop" sintead of "prop"? 
                    // to make sure we have the correct
                    // type: (int) in our case.
                    result.push(+prop);
                }
            }
            return result;
        },

        /**
         * Makes sure we have an array of
         * key codes for internal use.
         *
         * Various accepted formats:
         * "2"
         * "alt+2"
         * ["alt","2"]
         * ["alt",50]
         * [18,50]
         * 50
         * ["a",["x","y","z"]]
         * etc.
         *
         * @param {Integer|String|Array} keys
         * @return {Array}
         */
        format: function(keys) {
            var output = [];

            // Deal with a single integer
            if (this.isInteger(keys)) {
                output.push(keys);
            }

            // Deal with strings
            if (this.isString(keys)) {

                // one single key to take into account
                if (keys.indexOf('+') === -1) {
                    output.push(self.strToKeyCode(keys.trim()));
                }

                // series of keys to take into account, typed as a string
                if (keys.indexOf('+') !== -1) {
                    var kArray = keys.split("+"),
                        kArrayLength = kArray.length;

                    for (var k = 0; k < kArrayLength; k++) {
                        if (kArray[k]) {
                            output.push(self.strToKeyCode(kArray[k].trim()));
                        }
                    }
                }
            }

            // Deal with arrays (made either of integers, strings or arrays)
            if (this.isArray(keys)) {
                var keysLength = keys.length;
                for (var k = 0; k < keysLength; k++) {

                    // Keys typed as a string
                    if (this.isString(keys[k])) {
                        output.push(self.strToKeyCode(keys[k].trim()));
                    }

                    // Keys typed as keyCode (=typed as integers)
                    if (this.isInteger(keys[k])) {
                        output.push(keys[k]);
                    }

                    // Keys typed as array
                    if (this.isArray(keys[k])) {
                        output.push(this.format(keys[k]));
                    }
                }
            }
            return output;
        },

        /**
         * Takes a string, spits back a key code.
         *
         * This will only work for the strings
         * internally defined by kDown.
         * Don't try this on *any* string as
         * keyboard implementations vary from
         * country to country.
         *
         * @param {String} str
         * @return {Boolean|Number}
         */
        strToKeyCode: function(str) {
            if (!self.isString(str)) {
                return false;
            }

            var str = str.toLowerCase();

            for (var k = 0; k < this._keysAsStringLength; k++) {
                if (this._keysAsString[k] === str) {
                    return this._keysAsKeyCode[k];
                }
            }
            return false;
        },

        /**
         * Compares two arrays
         *
         * @param {Array} array1
         * @param {Array} array2
         * @return {Boolean}
         */
        compare: function(array1, array2) {
            if (!this.isArray(array1) || !this.isArray(array2)) {
                return false;
            }

            if (array1.length !== array2.length) {
                return false;
            }

            var toCompare1 = array1.sort().join(","),
                toCompare2 = array2.sort().join(",");

            return (toCompare1 === toCompare2);
        },
        
        // A few utilities

        /**
         * Is function?
         *
         * @return {Boolean}
         */
        isFunction: function(input) {
            return (Object.prototype.toString.call(input) === '[object Function]');
        },

        /**
         * Is array?
         *
         * @return {Boolean}
         */
        isArray: function(input) {
            return (Object.prototype.toString.call(input) === '[object Array]');
        },

        /**
         * Is boolean?
         *
         * @return {Boolean}
         */
        isBool: function(input) {
            return (Object.prototype.toString.call(input) === '[object Boolean]');
        },

        /**
         * Is object?
         *
         * @return {Boolean}
         */
        isObject: function(input) {
            return (Object.prototype.toString.call(input) === '[object Object]');
        },

        /**
         * Is integer?
         *
         * @return {Boolean}
         */
        isInteger: function(input) {
            return (Object.prototype.toString.call(input) === '[object Number]' && input % 1 === 0);
        },

        /**
         * Is undefined?
         *
         * @return {Boolean}
         */
        isUndefined: function(input) {
            return (Object.prototype.toString.call(input) === '[object Undefined]');
        },

        /**
         * Is string?
         *
         * @return {Boolean}
         */
        isString: function(input) {
            return (Object.prototype.toString.call(input) === '[object String]');
        },

    }
    blueprint._().listen(window.document);
    window.kDown = blueprint;
})(window);