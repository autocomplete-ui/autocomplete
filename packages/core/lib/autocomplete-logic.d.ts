import { BaseAutocompleteLogicOptions, BaseAutocompleteLogic } from "./common";
declare type Value = string | number;
export declare type AutocompleteLogicOptions = BaseAutocompleteLogicOptions<Value>;
export declare class AutocompleteLogic extends BaseAutocompleteLogic<Value> {
    constructor();
    get needToBeOpen(): boolean;
    getDefaultMarker: () => number;
    _addSelectedItem: (item: any) => Promise<boolean>;
    initArgs(args: any): void;
    /**
     * listen to known keyboards like enter, arrow up and down
     *
     * @memberof AutocompleteLogic
     */
    onKeyDown: (e: any) => void;
    onInputChange: (e: any) => void;
    onBlur: (e: any) => Promise<void>;
    onFocus: (e: any) => void;
    addOption(option: any): Promise<void>;
    addMarkedOption(): boolean;
    addOptionByKey: (key: any) => void;
    addOptionByIndex(index: any): void;
    getValueByOptionIndex: (index: any) => any;
    updateValue(value: any): void;
    _updateValue(value: any): void;
    _removeValueByKey: (key: any) => void;
    _addValue(key: any, value: any): Promise<void>;
    clearValue(): void;
}
export {};
