import * as React from "react";
export interface PopperProps {
    triggerOn: any;
    maxHeight?: number;
    children: (style: any) => any;
}
export declare class Popper extends React.Component<PopperProps> {
    itself: any;
    constructor(props: any);
    state: {
        position: string;
        zIndex: number;
        top: any;
        bottom: any;
    };
    changeHandler: (e: any) => void;
    static calculatePosition: (triggerOn: any, elmSize: any) => {
        top: any;
        bottom: any;
    } | {
        top?: undefined;
        bottom?: undefined;
    };
    componentWillUnmount(): void;
    static getDerivedStateFromProps(props: any, state: any): any;
    render(): JSX.Element;
    componentDidUpdate(): void;
}
