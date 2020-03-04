import { BaseAutocompleteLogicOptions, BaseAutocompleteLogic } from "./common";

type Value = string | number;

export type AutocompleteLogicOptions = BaseAutocompleteLogicOptions<Value>;

export class AutocompleteLogic extends BaseAutocompleteLogic<Value> {
  constructor() {
    super();
    this.addOption = this.addOption.bind(this);
  }

  get needToBeOpen() {
    // show option only if input in focus and if there is no value.
    return (
      this.state.isFocus &&
      !this.notShowSuggestionsInThisFocus &&
      (!this.args.requireMatch || !this.state.value) // if require match no showing option when the user select one
      // !this.state.inDisplayMode // todo
    ); // && !this.state.value;
  }

  getDefaultMarker = () => {
    return this.defaultMarkedOptionIndex;
  };

  _addSelectedItem = async item => {
    if (item === this.state.value) {
      return;
    }
    const value = this.optionToValue(item);
    if (value === null) {
      return;
    }
    const key = this.valueToKey(value);
    this._addValue(key, value);
    this.state.markedOptionIndex = this.defaultMarkedOptionIndex;

    if (item === undefined) {
      this.state.inDisplayMode = false;
      // this.state.inputValue = "";
    } else {
      this.state.inDisplayMode = true;
      return true;
    }
  };

  initArgs(args) {
    this.updateArgs(args);
    if (args.value !== undefined) {
      const option = this.getFirstMatchOption(args.value);
      this.addOption(option);
    }
  }

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
          // add value by text if there is no value
          if (!this.state.value && this.state.inputValue) {
            this.addValueByInputText();
            e.preventDefault();
          }
        } else {
          e.preventDefault();
          this.emitOnEnter();
        }
        break;
      case "Backspace":
        break;
      case "Escape":
        this.notShowSuggestionsInThisFocus = true;
        this.dispatch();
    }
  };

  // todo
  onInputChange = e => {
    // reset
    this.state.markedOptionIndex = this.defaultMarkedOptionIndex;
    this.notShowSuggestionsInThisFocus = false;
    // update the new value
    const value = e.target.value;
    this._changeInputValue(value);
    this.updateSuggestions();

    // if not require match lets add the query to value
    if (!this.args.requireMatch) {
      this.addValueByInputText();
      this.onChange();
    } else if (this.state.value !== undefined) {
      // if there is selected lets remove it
      this.clearValue();
      this.onChange();
    }
    if (typeof this.args.onQueryChange === "function") {
      this.args.onQueryChange(this.state.inputValue);
    }
  };

  onBlur = async e => {
    setTimeout(async () => {
      if (this.args.selectOnBlur && this.state.inputValue && !this.state.value) {
        if (!(await this.addValueByInputText()) && this.args.requireMatch) {
          // if required match remove the query
          this.updateInputValue("");
        }
      }
      this.notShowSuggestionsInThisFocus = false;
      this.state.isFocus = false;
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

  async addOption(option) {
    this.state.markedOptionIndex = this.defaultMarkedOptionIndex;
    if (this.args.reduceValueByOption) {
      this._updateValue(
        await this.args.reduceValueByOption({ option, value: this.state.value })
      );
      this.onChange();
      return;
    }
    await this.addSelectedItem(option);

    this.dispatch();
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

  addOptionByKey = key => {
    const { optionsDir } = this.state;
    const option = optionsDir[key];
    if (option) {
      this.addOption(option);
    }
  };

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

  updateValue(value) {
    this._updateValue(value)
    const { inputValue } = this.state;
    // update the input value
    if (!value && inputValue) {
      this.updateInputValue(undefined);
    }
  }

  _updateValue(value) {
    this.state.value = value;
    let flag;

    const key = this.valueToKey(value);
    if (!!this.state.valueMap.has(key)) {
      this._addValue(key, value);
      flag = true;
    }
  }

  _removeValueByKey = key => {
    this.state.valueMap.delete(key);
    this._updateValue(Array.from(this.state.valueMap.values()));
  };

  async _addValue(key, value) {
    this.state.value = value;
    this.state.valueMap.clear();
    this.state.valueMap.set(key, value);
    let val = value
    try {
      val = this.valueToDisplay(value)
    } catch (err) {
      console.error("[autocomplete] Failed to translate the value to display ", err)
    }
    this._changeInputValue(val);
  }

  clearValue() {
    this.state.valueMap.clear();
    this.state.inDisplayMode = false;
    this.state.value = undefined;
  }
}
