import { Dispatcher } from "@storex/core";
export interface BaseAutocompleteLogicOptions<T> {
    getOptions: Function;
    openOn?: number;
    selectOnBlur?: boolean;
    requireMatch?: boolean;
    optionToDisplay?: (o: any) => any;
    optionToValue?: (o: any) => any;
    valueToKey?: (o: any) => any;
    valueToDisplay?: (o: any) => any;
    optionToKey?: (o: any) => any;
    queryToValue?: (inputValue: string) => any;
    reduceValueByOption?: ({ option, value }: {
        option: any;
        value: any;
    }) => any;
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
export declare abstract class BaseAutocompleteLogic<T> extends Dispatcher {
    args: BaseAutocompleteLogicOptions<T>;
    notShowSuggestionsInThisFocus: boolean;
    needToLoadSuggestion: boolean;
    defaultMarkedOptionIndex: number;
    state: BaseAutocompleteLogicStatus;
    lastedSelectedKeys: any[];
    _markedOptionChangeFunc: any;
    _onEnterFunc: any;
    abstract initArgs(args: any): any;
    abstract _updateValue(value: T): any;
    abstract needToBeOpen: boolean;
    abstract onInputChange: (e: any) => any;
    abstract onKeyDown: (e: any) => any;
    abstract onBlur: (e: any) => any;
    abstract onFocus: (e: any) => any;
    abstract _addValue(key: any, value: any): any;
    abstract _addSelectedItem: (item: any) => Promise<any>;
    abstract addOption(option: any): any;
    abstract getDefaultMarker: () => number;
    constructor(args?: BaseAutocompleteLogicOptions<T>);
    addSelectedItem(item: any): Promise<void>;
    addValueByInputText(test?: any): Promise<boolean>;
    onInputValueChange: () => void;
    addOptionByKey: (key: any) => void;
    removeValue: (value: any) => void;
    _removeValueByKey: (key: any) => void;
    _changeInputValue: (value: any) => void;
    updateInputValue: (value: any) => void;
    /**
     * digest the args
     *
     * @param {BaseAutocompleteLogicOptions} args
     * @memberof AutocompleteLogic
     */
    updateArgs(args: BaseAutocompleteLogicOptions<T>): void;
    /**
     * Notify on change in the value
     *
     * @memberof AutocompleteLogic
     */
    onChange(): void;
    onMarkedOptionChange(func: any): void;
    onEnter(func: any): void;
    emitOnEnter(): void;
    emitMarkedOptionChange(): void;
    getOptions: (query: string) => any;
    isThereAvailableOptions(): boolean;
    getFirstMatchOption: (text: any) => Promise<any>;
    updateSuggestions: () => Promise<void>;
    optionToValue: (option: any) => any;
    valueToKey: (value: any) => any;
    valueToDisplay: (value: any) => any;
    optionToKey: (item: any) => any;
    queryToValue: (query: any) => any;
    optionToDisplay: (item: any) => any;
}
