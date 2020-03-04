import * as React from "react";

import { MenuItem, TextField } from "@material-ui/core";

export const styles = theme => ({
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
    margin: `${theme.spacing(0.5) }px ${theme.spacing(0.25)}px`
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
    margin: `${theme.spacing(0.5) }px ${theme.spacing(0.25)}px`
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

export function renderOption({
  option,
  index,
  itemProps,
  markedOptionIndex,
  valueMap
}) {
  const isHighlighted = markedOptionIndex === index;
  // const isSelected = (selectedOption.key || "").indexOf(suggestion.key) > -1;
  const isSelected = valueMap.has(option.key);
  return (
    <MenuItem
      {...itemProps}
      key={option.key}
      selected={isHighlighted}
      //      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {option.display}
    </MenuItem>
  );
}

export function renderInput(inputProps) {
  const { InputProps, classes, ...other } = inputProps;

  return (
    <TextField
      InputProps={{
        // classes: {
        //   root: classes.inputRoot
        // },
        ...InputProps
      }}
      {...other}
    />
  );
}
