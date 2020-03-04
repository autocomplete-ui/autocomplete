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
const core_1 = require("@material-ui/core");
exports.styles = theme => ({
    root: {
        flexGrow: 1,
        height: 250
    },
    container: {
        position: "relative",
        flexGrow: 1
    },
    chipPlaceholder: {
        background: "transparent",
        border: "2px dotted lightgray",
        boxSizing: "border-box",
        color: "gray",
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`
    },
    paper: {
        zIndex: 2,
        maxHeight: 256,
        overflow: "auto"
        //background: "white"
    },
    linearProgress: {
        height: "2px",
        top: "-2px"
    },
    chip: {
        height: 28,
        margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`
    },
    input: {
        width: "unset",
        flexGrow: 1,
        minWidth: 200
    },
    inputRoot: {
        flexWrap: "wrap"
    }
});
function renderOption({ option, index, itemProps, markedOptionIndex, valueMap }) {
    const isHighlighted = markedOptionIndex === index;
    // const isSelected = (selectedOption.key || "").indexOf(suggestion.key) > -1;
    const isSelected = valueMap.has(option.key);
    return (React.createElement(core_1.MenuItem, Object.assign({}, itemProps, { key: option.key, selected: isHighlighted, 
        //      component="div"
        style: {
            fontWeight: isSelected ? 500 : 400
        } }), option.display));
}
exports.renderOption = renderOption;
function renderInput(inputProps) {
    const { InputProps, classes } = inputProps, other = __rest(inputProps, ["InputProps", "classes"]);
    return (React.createElement(core_1.TextField, Object.assign({ InputProps: Object.assign({}, InputProps) }, other)));
}
exports.renderInput = renderInput;
//# sourceMappingURL=common.js.map