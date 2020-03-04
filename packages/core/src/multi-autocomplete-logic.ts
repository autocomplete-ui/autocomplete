import { BaseAutocompleteLogicOptions, BaseAutocompleteLogic } from "./common";

type Value = any[];

export type MultiAutocompleteLogicOptions = BaseAutocompleteLogicOptions<Value>;

export class MultiAutocompleteLogic extends BaseAutocompleteLogic<Value> {
  constructor() {
    super();
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

  _addSelectedItem = async item => {
    if (!item) {
      // if not item do nothing
      return;
    }
    let value = this.optionToValue(item);
    if (value instanceof Promise) {
      try {
        value = await value;
      } catch (e) {
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
  };

  /**
   * listen to known keyboards like enter, arrow up and down
   *
   * @memberof AutocompleteLogic
   */
  onKeyDown = e => {
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
          } else if (this.state.markedOptionIndex < 0) {
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
          } else {
            this.state.markedOptionIndex =
              addingOne % this.state.options.length;
            if (
              this.state.markedOptionIndex === 0 &&
              this.defaultMarkedOptionIndex === -1
            ) {
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
        } else {
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

  initArgs(args) {
    this.updateArgs(args);
  }

  // todo
  onInputChange = e => {
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

  onBlur = async e => {
    if (this.args.selectOnBlur && this.state.inputValue) {
      if (!(await this.addValueByInputText()) && this.args.requireMatch) {
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
  };

  onFocus = e => {
    this.state.isFocus = true;
    if (!this.state.inDisplayMode) {
      this.updateSuggestions();
    }
  };

  getDefaultMarker = () => {
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

  async addOption(option) {
    if (this.args.reduceValueByOption) {
      this._updateValue(
        await this.args.reduceValueByOption({ option, value: this.state.value })
      );
      this.state.markedOptionIndex = this.getDefaultMarker();
      this.onChange();
      this.updateInputValue("");
    } else {
      await this.updateSelectedItemAndQuery(option);
      this.state.markedOptionIndex = this.getDefaultMarker();
      this.dispatch();
    }
  }

  addMarkedOption() {
    if (
      this.needToBeOpen &&
      this.state.options.length &&
      this.state.markedOptionIndex !== -1
    ) {
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

  getValueByOptionIndex = index => {
    const option = this.state.options[index];
    if (!option) {
      return;
    }
    const markedKey = this.optionToKey(option);
    return this.state.valueMap.get(markedKey);
  };


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

  updateValue(value) { return this._updateValue(value) };

  clearValue() {
    this.state.valueMap.clear();
    this.state.inDisplayMode = false;
    this.state.value = [];
  }
}
