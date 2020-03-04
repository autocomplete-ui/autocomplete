import * as React from "react";
import { AutocompleteWrapperProps } from "@autocomplete/react";
export interface IAtutocompleteProps extends AutocompleteWrapperProps {
    classes?: any;
    inputProps?: React.HTMLProps<HTMLInputElement>;
    error?: boolean;
    style?: any;
    helperText?: string;
    required?: boolean;
    displayOption?: any;
    customDisplayOption?: any;
    noResultsContent?: any;
    inputRef?: any;
    customDisplayOptions?: (args: {
        options: any;
        valueMap: any;
        inputValue: any;
    }) => any;
    label?: any;
    displaySelectedOptions?: any;
    placeholder?: string;
    disable?: boolean;
    role?: any;
}
export declare class Autocomplete extends React.Component<IAtutocompleteProps, any> {
    noResultsText: string;
    containerRef: any;
    inputRef: any;
    optionsContainerRef: any;
    inputInFocus: any;
    constructor(props: any);
    getInputWith(): {
        width: any;
        display?: undefined;
    } | {
        display: string;
        width?: undefined;
    };
    focus: () => void;
    render(): JSX.Element;
}
