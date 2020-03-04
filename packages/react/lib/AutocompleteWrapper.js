"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const compute_scroll_into_view_1 = require("compute-scroll-into-view");
const core_1 = require("@autocomplete/core");
const lib_1 = require("@storex/react/lib");
class AutocompleteWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.refMap = new Map();
        this.blurInput = () => {
            if (this.inputRef && this.inputRef.blur && !this.props.notBlurAfterEnter) {
                this.inputRef.blur();
            }
        };
        this.markedChangeHandler = ({ key, index, option }) => {
            const ref = this.refMap.get(key);
            const { optionsContainerRef } = this.props;
            if (!ref || !optionsContainerRef) {
                return;
            }
            const child = ReactDOM.findDOMNode(ref);
            const refRoot = optionsContainerRef.current
                ? optionsContainerRef.current
                : optionsContainerRef;
            const root = ReactDOM.findDOMNode(refRoot);
            scrollIntoView(child, root);
        };
        this.wrapperInputProps = (props = {}, options) => {
            const { onChange, ref, onKeyDown, onBlur, onFocus } = props, others = __rest(props, ["onChange", "ref", "onKeyDown", "onBlur", "onFocus"]);
            return Object.assign(Object.assign({}, others), { onKeyDown: e => {
                    if (onKeyDown) {
                        onKeyDown(e);
                    }
                    this.autoLogic.onKeyDown(e);
                }, onChange: e => {
                    if (onChange) {
                        onChange(e);
                    }
                    this.autoLogic.onInputChange(e);
                }, onBlur: e => {
                    if (onBlur) {
                        onBlur(e);
                    }
                    this.autoLogic.onBlur(e);
                }, onFocus: e => {
                    if (onFocus) {
                        onFocus(e);
                    }
                    this.autoLogic.onFocus(e);
                }, [options && options.ref ? options.ref : "ref"]: _ref => {
                    if (!_ref) {
                        return;
                    }
                    this.inputRef = _ref;
                    if (typeof ref === "function") {
                        ref(_ref);
                    }
                    else if (ref) {
                        ref["current"] = _ref;
                    }
                } });
        };
        this.wrapperOptionProps = (key, props = {}) => {
            const { onClick, ref } = props, others = __rest(props, ["onClick", "ref"]);
            return Object.assign(Object.assign({}, others), { onClick: e => {
                    if (onClick) {
                        onClick(e);
                    }
                    this.autoLogic.addOptionByKey(key);
                }, ref: _ref => {
                    if (!_ref) {
                        return;
                    }
                    this.refMap.set(key, _ref);
                    if (typeof ref === "function") {
                        ref(_ref);
                    }
                    else if (ref) {
                        ref["current"] = _ref;
                    }
                } });
        };
        this.autoLogic = props.multi
            ? new core_1.MultiAutocompleteLogic()
            : new core_1.AutocompleteLogic();
        this.autoLogic.onMarkedOptionChange(this.markedChangeHandler);
        this.autoLogic.onEnter(this.blurInput);
        this.autoLogic.initArgs(props);
    }
    render() {
        this.autoLogic.updateArgs(this.props);
        const state = this.autoLogic.state;
        const isOpen = this.autoLogic.needToBeOpen;
        const { removeValue, optionToDisplay, optionToKey, valueToKey, valueToDisplay, addOption } = this.autoLogic;
        const { wrapperOptionProps, wrapperInputProps } = this;
        return (React.createElement(lib_1.Subscribe, { to: this.autoLogic }, () => {
            this.refMap.clear();
            const state = this.autoLogic.state;
            const isOpen = this.autoLogic.needToBeOpen;
            return this.props.children(Object.assign(Object.assign({}, state), { isOpen,
                wrapperInputProps,
                wrapperOptionProps,
                addOption,
                removeValue,
                optionToDisplay,
                optionToKey,
                valueToDisplay,
                valueToKey }));
        }));
    }
}
exports.AutocompleteWrapper = AutocompleteWrapper;
/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} rootNode the root element of the component
 */
function scrollIntoView(node, rootNode) {
    if (node === null) {
        return;
    }
    const actions = compute_scroll_into_view_1.default(node, {
        boundary: rootNode,
        block: "nearest",
        scrollMode: "if-needed"
    });
    actions.forEach(({ el, top, left }) => {
        el.scrollTop = top;
        el.scrollLeft = left;
    });
}
//# sourceMappingURL=AutocompleteWrapper.js.map