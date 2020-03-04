import { BaseAutocompleteLogicOptions, BaseAutocompleteLogic } from "./common";
declare type Value = any[];
export declare type MultiAutocompleteLogicOptions = BaseAutocompleteLogicOptions<Value>;
export declare class MultiAutocompleteLogic extends BaseAutocompleteLogic<Value> {
    constructor();
    get needToBeOpen(): boolean;
    updateSelectedItemAndQuery(item: any): void;
    _addSelectedItem: (item: any) => Promise<boolean>;
    /**
     * listen to known keyboards like enter, arrow up and down
     *
     * @memberof AutocompleteLogic
     */
    onKeyDown: (e: any) => void;
    initArgs(args: any): void;
    onInputChange: (e: any) => void;
    onBlur: (e: any) => Promise<void>;
    onFocus: (e: any) => void;
    getDefaultMarker: () => number;
    addOption(option: any): Promise<void>;
    addMarkedOption(): boolean;
    addOptionByIndex(index: any): void;
    getValueByOptionIndex: (index: any) => any;
    _updateValue(value: any): void;
    _addValue(key: any, value: any): void;
    updateValue(value: any): void;
    clearValue(): void;
}
export {};
