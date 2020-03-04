import * as React from "react";
import './style/style.css';
import { AutocompleteWrapperProps } from "@autocomplete/react";
export interface IMultiAutocompleteProps extends AutocompleteWrapperProps {
    classes?: any;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    placeholder?: string;
    secondPlaceholder?: string;
    label?: string;
    onChipClick?: (value: any) => void;
    onOperatorClick?: (value: any) => void;
    customDisplayChip?: {
        [key: string]: ({ value, key }: {
            value: any;
            key: any;
        }) => any;
    };
    chipPlaceholder?: string;
    error?: boolean;
    chipPlaceholderIcon?: any;
    style?: any;
    inputRef?: any;
    disable?: boolean;
    helperText?: string;
    required?: boolean;
    displayOption?: any;
    displaySelectedOptions?: boolean;
    customDisplayOptions?: (args: {
        options: any;
        valueMap: any;
        inputValue: any;
    }) => any;
    customDisplayOption?: (args: {
        option: any;
        index: any;
        isSelected: any;
        itemProps: any;
        markedOptionIndex: any;
        valueMap: any;
    }) => any;
    noResultsContent?: any;
    role?: any;
}
export declare class MultiAutocomplete extends React.Component<IMultiAutocompleteProps, any> {
    containerRef: any;
    inputRef: any;
    optionsContainerRef: any;
    noResultsText: string;
    constructor(props: any);
    inputInFocus: boolean;
    getInputWith(): {
        width: any;
        display?: undefined;
    } | {
        display: string;
        width?: undefined;
    };
    focus: () => void;
    isShowChipPlaceholder: () => boolean;
    render(): JSX.Element;
}
