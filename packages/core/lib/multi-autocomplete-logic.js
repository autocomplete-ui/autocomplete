"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
class MultiAutocompleteLogic extends common_1.BaseAutocompleteLogic {
    constructor() {
        super();
        this._addSelectedItem = (item) => __awaiter(this, void 0, void 0, function* () {
            if (!item) {
                // if not item do nothing
                return;
            }
            let value = this.optionToValue(item);
            if (value instanceof Promise) {
                try {
                    value = yield value;
                }
                catch (e) {
                    console.error("[Autocomplete]:: can't add a value", e);
                }
            }
            if (value === null) {
                return;
            }
            const key = this.valueToKey(value);
            if (!this.state.valueMap.has(key)) {
                this.lastedSelectedKeys.push(key);
                this._addValue(key, value);
            }
            return true;
        });
        /**
         * listen to known keyboards like enter, arrow up and down
         *
         * @memberof AutocompleteLogic
         */
        this.onKeyDown = e => {
            // if (this.state.inputValue !== e.target.value) {
            //   this.onInputChange(e);
            // }
            switch (e.key) {
                case "ArrowUp":
                    if (!this.isThereAvailableOptions()) {
                        break;
                    }
                    do {
                        this.state.markedOptionIndex -= 1;
                        if (this.defaultMarkedOptionIndex === -1) {
                            if (this.state.markedOptionIndex < -1) {
                                this.state.markedOptionIndex = this.state.options.length - 1;
                            }
                        }
                        else if (this.state.markedOptionIndex < 0) {
                            this.state.markedOptionIndex = this.state.options.length - 1;
                        }
                    } while (this.getValueByOptionIndex(this.state.markedOptionIndex)); // increase the index if this option already selected
                    this.dispatch();
                    this.emitMarkedOptionChange();
                    break;
                case "ArrowDown":
                    if (!this.isThereAvailableOptions()) {
                        break;
                    }
                    do {
                        const addingOne = this.state.markedOptionIndex + 1;
                        if (addingOne === 0) {
                            this.state.markedOptionIndex = 0;
                        }
                        else {
                            this.state.markedOptionIndex =
                                addingOne % this.state.options.length;
                            if (this.state.markedOptionIndex === 0 &&
                                this.defaultMarkedOptionIndex === -1) {
                                this.state.markedOptionIndex = -1;
                            }
                        }
                    } while (this.getValueByOptionIndex(this.state.markedOptionIndex)); // decrease the index if this option already selected
                    this.dispatch();
                    this.emitMarkedOptionChange();
                    break;
                case "Enter":
                    if (!this.addMarkedOption()) {
                        // add value by text if there is input value
                        if (this.state.inputValue) {
                            this.addValueByInputText();
                            e.preventDefault();
                        }
                    }
                    else {
                        e.preventDefault();
                        this.emitOnEnter();
                    }
                    break;
                case "Backspace":
                    if (this.state.inputValue === "") {
                        this._removeValueByKey(this.lastedSelectedKeys.pop());
                        this.onChange();
                    }
                    break;
                case "Escape":
                    this.notShowSuggestionsInThisFocus = true;
                    this.dispatch();
            }
        };
        // todo
        this.onInputChange = e => {
            // reset
            this.notShowSuggestionsInThisFocus = false;
            // update the new value
            const value = e.target.value;
            this._changeInputValue(value);
            this.updateSuggestions();
            if (this.state.value) {
                // this.clearValue(); // todo
            }
            if (typeof this.args.onQueryChange === "function") {
                this.args.onQueryChange(this.state.inputValue);
            }
            this.state.markedOptionIndex = this.getDefaultMarker();
        };
        this.onBlur = (e) => __awaiter(this, void 0, void 0, function* () {
            if (this.args.selectOnBlur && this.state.inputValue) {
                if (!(yield this.addValueByInputText()) && this.args.requireMatch) {
                    // if required match remove the query
                    this.updateInputValue("");
                }
            }
            this.notShowSuggestionsInThisFocus = false;
            this.state.isFocus = false;
            setTimeout(() => {
                // todo close before on click happen
                this.dispatch();
            }, 500);
        });
        this.onFocus = e => {
            this.state.isFocus = true;
            if (!this.state.inDisplayMode) {
                this.updateSuggestions();
            }
        };
        this.getDefaultMarker = () => {
            if (this.defaultMarkedOptionIndex === 0) {
                let index = 0;
                while (this.getValueByOptionIndex(index)) {
                    index++;
                    if (index >= this.state.options.length) {
                        return -1;
                    }
                }
                return index;
            }
            return this.defaultMarkedOptionIndex;
        };
        this.getValueByOptionIndex = index => {
            const option = this.state.options[index];
            if (!option) {
                return;
            }
            const markedKey = this.optionToKey(option);
            return this.state.valueMap.get(markedKey);
        };
        this.addOption = this.addOption.bind(this);
    }
    get needToBeOpen() {
        // show option only if input in focus and user not press esc
        return this.state.isFocus && !this.notShowSuggestionsInThisFocus; // && !this.state.value;
    }
    updateSelectedItemAndQuery(item) {
        this.addSelectedItem(item);
        if (item) {
            const query = "";
            this.updateInputValue(query);
        }
    }
    initArgs(args) {
        this.updateArgs(args);
    }
    addOption(option) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.args.reduceValueByOption) {
                this._updateValue(yield this.args.reduceValueByOption({ option, value: this.state.value }));
                this.state.markedOptionIndex = this.getDefaultMarker();
                this.onChange();
                this.updateInputValue("");
            }
            else {
                yield this.updateSelectedItemAndQuery(option);
                this.state.markedOptionIndex = this.getDefaultMarker();
                this.dispatch();
            }
        });
    }
    addMarkedOption() {
        if (this.needToBeOpen &&
            this.state.options.length &&
            this.state.markedOptionIndex !== -1) {
            this.addOptionByIndex(this.state.markedOptionIndex);
            return true;
        }
    }
    addOptionByIndex(index) {
        const { options } = this.state;
        const option = options[index];
        if (option) {
            this.addOption(option);
        }
    }
    _updateValue(value) {
        this.state.value = value;
        let flag;
        this.lastedSelectedKeys = [];
        this.state.valueMap.clear();
        if (!(value instanceof Array)) {
            this.state.valueMap.clear();
            return;
        }
        for (const v of value) {
            const key = this.valueToKey(v);
            this.lastedSelectedKeys.push(key);
            this.state.valueMap.set(key, v);
        }
    }
    _addValue(key, value) {
        this.state.valueMap.set(key, value);
        if (!this.state.value) {
            this.state.value = [];
        }
        this.state.value.push(value);
        this.lastedSelectedKeys.push(key);
        this._changeInputValue("");
    }
    updateValue(value) { return this._updateValue(value); }
    ;
    clearValue() {
        this.state.valueMap.clear();
        this.state.inDisplayMode = false;
        this.state.value = [];
    }
}
exports.MultiAutocompleteLogic = MultiAutocompleteLogic;
//# sourceMappingURL=multi-autocomplete-logic.js.map