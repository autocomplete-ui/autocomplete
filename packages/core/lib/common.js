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
const core_1 = require("@storex/core");
class BaseAutocompleteLogic extends core_1.Dispatcher {
    constructor(args) {
        super();
        this.notShowSuggestionsInThisFocus = false;
        this.defaultMarkedOptionIndex = -1;
        this.state = {
            inDisplayMode: false,
            inputValue: "",
            isFocus: false,
            isOptionsLoading: false,
            markedOptionIndex: this.defaultMarkedOptionIndex,
            optionsDir: {},
            options: [],
            value: undefined,
            valueMap: new Map()
        };
        this.lastedSelectedKeys = [];
        this._markedOptionChangeFunc = undefined;
        this._onEnterFunc = undefined;
        this.onInputChange = e => undefined;
        this.onKeyDown = e => undefined;
        this.onBlur = e => undefined;
        this.onFocus = e => undefined;
        this._addSelectedItem = (item) => __awaiter(this, void 0, void 0, function* () { return undefined; });
        this.onInputValueChange = () => {
            if (typeof this.args.onQueryChange === "function") {
                this.args.onQueryChange(this.state.inputValue);
            }
            else {
                this.dispatch();
            }
        };
        this.addOptionByKey = key => {
            const { optionsDir } = this.state;
            const option = optionsDir[key];
            if (option) {
                this.addOption(option);
            }
        };
        // getElementsToDelete = (value) => {
        //   let operator;
        //   const values: any = Array.from(this.state.valueMap.values());
        //   const valueIndex = values.indexOf(value);
        //   if(valueIndex > 0){
        //     operator = values[valueIndex-1].type === 'operator' && values[valueIndex-1];
        //   } else {
        //     operator = values[valueIndex+1] && values[valueIndex+1].type === 'operator' && values[valueIndex+1];
        //   }
        //   // values.forEach((v:any,i:number)=>{
        //   //   if(value.key === v.key){
        //   //     if(i === 0){
        //   //       keysIndexes.push(i);
        //   //       values[i+1] && values[i+1].type === 'operator' && keysIndexes.push(i+1);
        //   //     } else {
        //   //       keysIndexes.push(i);
        //   //       values[i-1] && values[i-1].type === 'operator' && keysIndexes.push(i-1);
        //   //     }
        //   //   }
        //   // })
        //   return [value,operator];
        // }
        // removeValue = value => {
        //   const valuesToDelete = this.getElementsToDelete(value);
        //   valuesToDelete.forEach(value => {
        //     value && value.key && this._removeValueByKey(value.key)
        //   })
        //   this.onChange();
        // };
        this.removeValue = value => {
            const key = this.valueToKey(value);
            this._removeValueByKey(key);
            this.onChange();
        };
        this._removeValueByKey = key => {
            this.state.valueMap.delete(key);
            this._updateValue(Array.from(this.state.valueMap.values()));
            this.state.markedOptionIndex = this.getDefaultMarker();
        };
        this._changeInputValue = value => {
            this.state.inputValue = value;
        };
        this.updateInputValue = value => {
            if (this.state.inputValue !== value) {
                this._changeInputValue(value);
                this.onInputValueChange();
            }
        };
        this.getOptions = (query) => {
            if (typeof this.args.getOptions === "function") {
                return this.args.getOptions(query);
            }
            return [];
        };
        this.getFirstMatchOption = (text) => __awaiter(this, void 0, void 0, function* () {
            const options = (yield this.getOptions(text)) || [];
            return options[0];
        });
        this.updateSuggestions = () => __awaiter(this, void 0, void 0, function* () {
            if (this.state.isOptionsLoading) {
                this.needToLoadSuggestion = true;
                return;
            }
            this.needToLoadSuggestion = false;
            this.state.isOptionsLoading = true;
            const query = this.state.inputValue;
            let result = this.getOptions(query);
            if (result instanceof Promise) {
                this.dispatch();
                result = yield result;
            }
            if (result instanceof Array) {
                this.state.options = result;
                this.state.optionsDir = {};
                for (const option of result) {
                    const key = this.optionToKey(option);
                    this.state.optionsDir[key] = option;
                }
                this.state.isOptionsLoading = false;
                this.dispatch();
            }
            else {
                throw new Error("");
            }
            if (this.needToLoadSuggestion) {
                this.updateSuggestions();
            }
        });
        ////////////////// translate wrapper functions ///////////////////////
        this.optionToValue = option => {
            if (typeof this.args.optionToValue === "function") {
                return this.args.optionToValue(option);
            }
            return option;
        };
        this.valueToKey = value => {
            if (typeof this.args.valueToKey === "function") {
                return this.args.valueToKey(value);
            }
            return value;
        };
        this.valueToDisplay = value => {
            if (typeof this.args.valueToDisplay === "function") {
                return this.args.valueToDisplay(value);
            }
            return value;
        };
        this.optionToKey = item => {
            if (typeof this.args.optionToKey === "function" && item) {
                return this.args.optionToKey(item);
            }
            return item;
        };
        this.queryToValue = query => {
            if (typeof this.args.queryToValue === "function") {
                return this.args.queryToValue(query);
            }
            return query;
        };
        this.optionToDisplay = item => {
            if (typeof this.args.optionToDisplay === "function") {
                return this.args.optionToDisplay(item);
            }
            return item;
        };
        if (args) {
            this.updateArgs(args);
        }
    }
    addSelectedItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            if (yield this._addSelectedItem(item)) {
                this.onChange();
                this.onInputValueChange();
            }
        });
    }
    addValueByInputText(test) {
        return __awaiter(this, void 0, void 0, function* () {
            let text = test || this.state.inputValue;
            // if (!text) {
            //   return false;
            // }
            //let
            let option;
            if (!this.args.requireMatch) {
                let value = yield this.queryToValue(text);
                if (value === null) {
                    return;
                }
                else if (option === undefined) {
                    value = text;
                }
                const key = this.valueToKey(value);
                this._addValue(key, value);
                this.onChange();
                this.onInputValueChange();
                return true;
            }
            else {
                option = yield this.getFirstMatchOption(text); // if there is
                if (option) {
                    this.addOption(option);
                    this.onChange();
                    this.onInputValueChange();
                    return true;
                }
                return false;
            }
        });
    }
    /**
     * digest the args
     *
     * @param {BaseAutocompleteLogicOptions} args
     * @memberof AutocompleteLogic
     */
    updateArgs(args) {
        this.args = args;
        const { value, query } = args;
        if (typeof query === "string" || typeof query === "number") {
            this.state.inputValue = query;
        }
        if (value !== undefined && value !== null) {
            this._updateValue(value);
        }
        if (value === undefined && this.state.value !== undefined) {
            this._updateValue(value);
        }
        this.defaultMarkedOptionIndex = args.requireMatch ? 0 : -1;
        if (this.defaultMarkedOptionIndex === 0 &&
            this.state.markedOptionIndex === -1) {
            this.state.markedOptionIndex = this.getDefaultMarker();
        }
    }
    /**
     * Notify on change in the value
     *
     * @memberof AutocompleteLogic
     */
    onChange() {
        if (typeof this.args.onChange === "function") {
            this.args.onChange(this.state.value);
        }
        else {
            this.dispatch();
        }
    }
    onMarkedOptionChange(func) {
        this._markedOptionChangeFunc = func;
    }
    onEnter(func) {
        this._onEnterFunc = func;
    }
    emitOnEnter() {
        if (this._onEnterFunc) {
            this._onEnterFunc();
        }
    }
    emitMarkedOptionChange() {
        if (typeof this._markedOptionChangeFunc == "function") {
            const index = this.state.markedOptionIndex;
            const option = this.state.options[index];
            let key;
            key = this.optionToKey(option);
            this._markedOptionChangeFunc({ index, option, key });
        }
    }
    isThereAvailableOptions() {
        const selectedCount = Array.from(this.state.valueMap.keys()).filter(key => this.state.optionsDir[key]).length;
        return this.state.options.length > selectedCount;
    }
}
exports.BaseAutocompleteLogic = BaseAutocompleteLogic;
//# sourceMappingURL=common.js.map