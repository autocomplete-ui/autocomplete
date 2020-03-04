"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const core_1 = require("@material-ui/core");
const react_1 = require("@autocomplete/react");
const common_1 = require("./common");
const react_2 = require("@autocomplete/react");
const w = core_1.withStyles;
let Autocomplete = class Autocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.noResultsText = "No results found";
        this.focus = () => {
            this.inputRef.current.focus();
        };
        this.containerRef = React.createRef();
        this.inputRef = React.createRef();
        this.optionsContainerRef = { ref: React.createRef() };
    }
    getInputWith() {
        if (this.containerRef.current) {
            const width = this.containerRef.current.offsetWidth;
            return { width };
        }
        //  this.forceUpdate();
        return { display: "none" };
    }
    render() {
        const _a = this.props, { classes, inputProps, displayOption, customDisplayOption, error, customDisplayOptions, helperText, required, inputRef, style, noResultsContent, label, displaySelectedOptions, placeholder, disable, role } = _a, others = __rest(_a, ["classes", "inputProps", "displayOption", "customDisplayOption", "error", "customDisplayOptions", "helperText", "required", "inputRef", "style", "noResultsContent", "label", "displaySelectedOptions", "placeholder", "disable", "role"]);
        const { getOptions } = this.props;
        // const { onInputValueChange, ..._downshiftOptions } =
        //   downshiftProps || emptyAny;
        return (React.createElement(react_2.AutocompleteWrapper, Object.assign({ optionsContainerRef: this.optionsContainerRef.ref }, others), ({ wrapperInputProps, wrapperOptionProps, isOptionsLoading, isOpen, options, inputValue, removeValue, value, valueToDisplay, valueToKey, valueMap, markedOptionIndex, optionToKey, optionToDisplay, }) => {
            const suggestions = customDisplayOptions
                ? customDisplayOptions({ options, valueMap, inputValue })
                : (options || []).map((option, index) => {
                    const display = optionToDisplay(option);
                    const key = optionToKey(option);
                    if (typeof display !== "string" &&
                        typeof display !== "number" &&
                        !React.isValidElement(display)) {
                        throw new Error("[Autocomplete]:: The display of option is invalid please add optionToDisplay function prop to Autocomplete. ( e.g. optionToDisplay={(o)=> o.title} )");
                    }
                    if (typeof key !== "string" && typeof key !== "number") {
                        throw new Error("[Autocomplete]:: The key of option is invalid please add optionToKey function prop to Autocomplete. ( e.g. optionToKey={(o)=> o.key} )");
                    }
                    if (valueMap.has(key) && !displaySelectedOptions) {
                        // if alrady selected ignore it
                        return null;
                    }
                    return customDisplayOption
                        ? customDisplayOption({
                            option: option,
                            index,
                            isSelected: valueMap.has(key),
                            itemProps: wrapperOptionProps(key),
                            markedOptionIndex,
                            valueMap
                        })
                        : common_1.renderOption({
                            option: { key, display },
                            index,
                            itemProps: wrapperOptionProps(key),
                            markedOptionIndex,
                            valueMap
                        });
                });
            const isOptionsOpen = !!(isOpen && getOptions && suggestions);
            // console.log("isOpen", isOpen); 
            // console.log("getOptions", getOptions); 
            // console.log("suggestions", suggestions);
            return (React.createElement("div", { className: classes.container, ref: this.containerRef },
                common_1.renderInput(Object.assign(Object.assign({ fullWidth: true, classes,
                    label,
                    style,
                    disable,
                    error,
                    helperText,
                    required,
                    placeholder }, inputProps), { InputProps: wrapperInputProps(Object.assign(Object.assign({ value: inputValue, ref: ref => {
                            this.inputRef.current = ref;
                            if (typeof inputRef === "function") {
                                inputRef(ref);
                            }
                            else if (inputRef) {
                                inputRef.current = ref;
                            }
                        } }, inputProps), { onFocus: () => (this.inputInFocus = true), onBlur: () => (this.inputInFocus = false) }), { ref: "inputRef" }), value: inputValue })),
                isOptionsLoading && (React.createElement(core_1.LinearProgress, { className: classes.linearProgress, color: "secondary" })),
                !role && isOptionsOpen ? (React.createElement(react_1.Popper, { triggerOn: this.containerRef, maxHeight: 256 }, style => (React.createElement(core_1.Paper, Object.assign({}, this.optionsContainerRef, { className: classes.paper, style: Object.assign(Object.assign({}, this.getInputWith()), style) }), suggestions.length
                    ? suggestions
                    : !isOptionsLoading &&
                        inputValue && (React.createElement(core_1.MenuItem, null,
                        React.createElement(core_1.Typography, null, noResultsContent || this.noResultsText))))))) : null));
        }));
    }
};
Autocomplete = __decorate([
    w(common_1.styles)
], Autocomplete);
exports.Autocomplete = Autocomplete;
//# sourceMappingURL=Autocomplete.js.map