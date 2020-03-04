import { Dispatcher } from "@storex/core";

export interface BaseAutocompleteLogicOptions<T> {
  getOptions: Function;
  openOn?: number;
  selectOnBlur?: boolean;
  requireMatch?: boolean;
  optionToDisplay?: (o) => any;
  optionToValue?: (o) => any;
  valueToKey?: (o) => any;
  valueToDisplay?: (o) => any;
  optionToKey?: (o) => any;
  queryToValue?: (inputValue: string) => any;
  reduceValueByOption?: ({ option, value }) => any;
  query?: string;
  onChange?: Function;
  onQueryChange?: Function;
  value?: T;
}

export interface BaseAutocompleteLogicStatus {
  isFocus: boolean;
  isOptionsLoading: boolean;
  value: any;
  valueMap: Map<any, any>;
  markedOptionIndex: number;
  inDisplayMode: boolean;
  optionsDir: {};
  options: any[];
  inputValue: string;
}

export abstract class BaseAutocompleteLogic<T> extends Dispatcher {
  args: BaseAutocompleteLogicOptions<T>;
  notShowSuggestionsInThisFocus = false; 
  needToLoadSuggestion: boolean;
  defaultMarkedOptionIndex: number = -1;
  state: BaseAutocompleteLogicStatus = {
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

  lastedSelectedKeys = [];
  _markedOptionChangeFunc = undefined;
  _onEnterFunc = undefined;


  abstract initArgs(args);
  abstract _updateValue(value: T);
  abstract needToBeOpen: boolean;
  abstract onInputChange = e => undefined;
  abstract onKeyDown = e => undefined;
  abstract onBlur = e => undefined;
  abstract onFocus = e => undefined;
  abstract _addValue(key, value);
  abstract _addSelectedItem = async item => undefined;
  abstract addOption(option);
  abstract getDefaultMarker: () => number;

  constructor(args?: BaseAutocompleteLogicOptions<T>) {
    super();
    if (args) {
      this.updateArgs(args);
    }
  }

  async addSelectedItem(item) {
    if (await this._addSelectedItem(item)) {
      this.onChange();
      this.onInputValueChange();
    }
  }

  async addValueByInputText(test?) {
    let text = test || this.state.inputValue;
    // if (!text) {
    //   return false;
    // }
    //let
    let option;
    if (!this.args.requireMatch) {
      let value = await this.queryToValue(text);
      if (value === null) {
        return;
      } else if (option === undefined) {
        value = text;
      }
      const key = this.valueToKey(value);
      this._addValue(key, value);
      this.onChange();
      this.onInputValueChange();
      return true;
    } else {
      option = await this.getFirstMatchOption(text); // if there is
      if (option) {
        this.addOption(option);
        this.onChange();
        this.onInputValueChange();
        return true;
      }
      return false;
    }
  }

  onInputValueChange = () => {
    if (typeof this.args.onQueryChange === "function") {
      this.args.onQueryChange(this.state.inputValue);
    } else {
      this.dispatch();
    }
  };

  addOptionByKey = key => {
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

  removeValue = value => {
    const key = this.valueToKey(value);
    this._removeValueByKey(key);
    this.onChange();
  };

  _removeValueByKey = key => {
    this.state.valueMap.delete(key);
    this._updateValue(Array.from(this.state.valueMap.values()) as any);
    this.state.markedOptionIndex = this.getDefaultMarker();
  };

  _changeInputValue = value => {
    this.state.inputValue = value;
  };

  updateInputValue = value => {
    if (this.state.inputValue !== value) {
      this._changeInputValue(value);
      this.onInputValueChange();
    }
  };

  /**
   * digest the args
   *
   * @param {BaseAutocompleteLogicOptions} args
   * @memberof AutocompleteLogic
   */
  updateArgs(args: BaseAutocompleteLogicOptions<T>) {
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
    if (
      this.defaultMarkedOptionIndex === 0 &&
      this.state.markedOptionIndex === -1
    ) {
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
    } else {
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

  getOptions = (query: string) => {
    if (typeof this.args.getOptions === "function") {
      return this.args.getOptions(query);
    }
    return [];
  };

  isThereAvailableOptions() {
    const selectedCount = Array.from(this.state.valueMap.keys()).filter(
      key => this.state.optionsDir[key]
    ).length;
    return this.state.options.length > selectedCount;
  }

  getFirstMatchOption = async text => {
    const options = (await this.getOptions(text)) || [];
    return options[0];
  };

  updateSuggestions = async () => {
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
      result = await result;
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
    } else {
      throw new Error("");
    }
    if (this.needToLoadSuggestion) {
      this.updateSuggestions();
    }
  };

  ////////////////// translate wrapper functions ///////////////////////

  optionToValue = option => {
    if (typeof this.args.optionToValue === "function") {
      return this.args.optionToValue(option);
    }
    return option;
  };

  valueToKey = value => {
    if (typeof this.args.valueToKey === "function") {
      return this.args.valueToKey(value);
    }
    return value;
  };

  valueToDisplay = value => {
    if (typeof this.args.valueToDisplay === "function") {
      return this.args.valueToDisplay(value);
    }
    return value;
  };

  optionToKey = item => {
    if (typeof this.args.optionToKey === "function" && item) {
      return this.args.optionToKey(item);
    }
    return item;
  };

  queryToValue = query => {
    if (typeof this.args.queryToValue === "function") {
      return this.args.queryToValue(query);
    }
    return query;
  };

  optionToDisplay = item => {
    if (typeof this.args.optionToDisplay === "function") {
      return this.args.optionToDisplay(item);
    }
    return item;
  };
}
