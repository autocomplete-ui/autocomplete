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
const icons_1 = require("@material-ui/icons");
require("./style/style.css");
const core_1 = require("@material-ui/core");
const react_1 = require("@autocomplete/react");
const common_1 = require("./common");
const emptyAny = {};
const w = core_1.withStyles;
let MultiAutocomplete = class MultiAutocomplete extends React.Component {
    constructor(props) {
        super(props);
        this.noResultsText = "No results found";
        this.inputInFocus = false;
        this.focus = () => {
            this.inputRef.current.focus();
        };
        this.isShowChipPlaceholder = () => {
            const { chipPlaceholder } = this.props;
            return chipPlaceholder && !this.inputInFocus;
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
        const _a = this.props, { classes, inputProps, displayOption, customDisplayOption, error, customDisplayOptions, helperText, onChipClick, onOperatorClick, required, inputRef, style, chipPlaceholderIcon, customDisplayChip, noResultsContent, label, displaySelectedOptions, placeholder, disable, secondPlaceholder, chipPlaceholder, role } = _a, others = __rest(_a, ["classes", "inputProps", "displayOption", "customDisplayOption", "error", "customDisplayOptions", "helperText", "onChipClick", "onOperatorClick", "required", "inputRef", "style", "chipPlaceholderIcon", "customDisplayChip", "noResultsContent", "label", "displaySelectedOptions", "placeholder", "disable", "secondPlaceholder", "chipPlaceholder", "role"]);
        const { getOptions } = this.props;
        let _displayChip = customDisplayChip || {};
        // const { onInputValueChange, ..._downshiftOptions } =
        //   downshiftProps || emptyAny;
        return (React.createElement(react_1.AutocompleteWrapper, Object.assign({ multi: true, optionsContainerRef: this.optionsContainerRef.ref }, others), ({ wrapperInputProps, wrapperOptionProps, isOptionsLoading, isOpen, options, inputValue, removeValue, value, valueToDisplay, valueToKey, valueMap, markedOptionIndex, optionToKey, optionToDisplay }) => {
            const suggestions = customDisplayOptions
                ? customDisplayOptions({ options, valueMap, inputValue })
                : (options || []).map((option, index) => {
                    const display = optionToDisplay(option);
                    const key = optionToKey(option);
                    if (typeof display !== "string" &&
                        typeof display !== "number" &&
                        !React.isValidElement(display)) {
                        throw new Error("[MultiAutocomplete]:: The display of option is invalid please add optionToDisplay function prop to MultiAutocomplete. ( e.g. optionToDisplay={(o)=> o.title} )");
                    }
                    if (typeof key !== "string" && typeof key !== "number") {
                        throw new Error("[MultiAutocomplete]:: The key of option is invalid please add optionToKey function prop to MultiAutocomplete. ( e.g. optionToKey={(o)=> o.key} )");
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
            const moreOptions = this.isShowChipPlaceholder()
                ? [
                    React.createElement(core_1.Chip, { key: "placeholder", icon: chipPlaceholderIcon, 
                        // onDelete={chipPlaceholderIcon ? this.focus : undefined}
                        className: classes.chipPlaceholder, onClick: this.focus, tabIndex: -1, label: chipPlaceholder })
                ]
                : [];
            return (React.createElement("div", { className: classes.container, ref: this.containerRef },
                common_1.renderInput(Object.assign(Object.assign({ fullWidth: true, classes,
                    label,
                    style,
                    disable, error: error, helperText: helperText, required, placeholder: (value || []).length
                        ? secondPlaceholder || placeholder
                        : placeholder }, inputProps), { InputProps: wrapperInputProps({
                        ref: ref => {
                            this.inputRef.current = ref;
                            if (typeof inputRef === "function") {
                                inputRef(ref);
                            }
                            else if (inputRef) {
                                inputRef.current = ref;
                            }
                        },
                        className: classes.inputRoot,
                        classes: { input: classes.input },
                        onFocus: () => (this.inputInFocus = true),
                        onBlur: () => (this.inputInFocus = false),
                        startAdornment: [
                            ...Array.from(valueMap.keys()).map((key) => {
                                const value = valueMap.get(key);
                                switch (value.type) {
                                    case 'operator': {
                                        return (React.createElement(core_1.Tooltip, { title: "Click to change operator" },
                                            React.createElement("div", { className: "operator", onClick: () => onOperatorClick && onOperatorClick(value) }, value.operator && value.operator.toUpperCase())));
                                    }
                                    default: {
                                        if (!_displayChip[key]) {
                                            const display = valueToDisplay(value);
                                            return (React.createElement(core_1.Chip, { variant: "outlined", key: key, onClick: () => onChipClick && onChipClick(value), tabIndex: -1, label: display, deleteIcon: React.createElement(icons_1.Close, null), className: classes.chip, onDelete: () => removeValue(value) }));
                                        }
                                    }
                                }
                                return _displayChip[key]({ key, value });
                            }),
                            ...moreOptions
                        ]
                    }, { ref: "inputRef" }), value: inputValue })),
                isOptionsLoading && (React.createElement(core_1.LinearProgress, { className: classes.linearProgress, color: "secondary" })),
                !role && isOptionsOpen && (React.createElement(react_1.Popper, { triggerOn: this.containerRef, maxHeight: 256 }, style => (React.createElement(core_1.Paper, Object.assign({}, this.optionsContainerRef, { className: classes.paper, style: Object.assign(Object.assign({}, this.getInputWith()), style) }), suggestions.length
                    ? suggestions
                    : !isOptionsLoading &&
                        inputValue && (React.createElement(core_1.MenuItem, null,
                        React.createElement(core_1.Typography, null, noResultsContent || this.noResultsText)))))))));
        }));
    }
};
MultiAutocomplete = __decorate([
    w(common_1.styles)
], MultiAutocomplete);
exports.MultiAutocomplete = MultiAutocomplete;
//# sourceMappingURL=MultiAutocomplete.js.map