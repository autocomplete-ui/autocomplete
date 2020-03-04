/// <reference types="react" />
export declare const styles: (theme: any) => {
    root: {
        flexGrow: number;
        height: number;
    };
    container: {
        position: string;
        flexGrow: number;
    };
    chipPlaceholder: {
        background: string;
        border: string;
        boxSizing: string;
        color: string;
        margin: string;
    };
    paper: {
        zIndex: number;
        maxHeight: number;
        overflow: string;
    };
    linearProgress: {
        height: string;
        top: string;
    };
    chip: {
        height: number;
        margin: string;
    };
    input: {
        width: string;
        flexGrow: number;
        minWidth: number;
    };
    inputRoot: {
        flexWrap: string;
    };
};
export declare function renderOption({ option, index, itemProps, markedOptionIndex, valueMap }: {
    option: any;
    index: any;
    itemProps: any;
    markedOptionIndex: any;
    valueMap: any;
}): JSX.Element;
export declare function renderInput(inputProps: any): JSX.Element;
