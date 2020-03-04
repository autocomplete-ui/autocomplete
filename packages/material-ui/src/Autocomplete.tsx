import * as React from "react";

import {
  LinearProgress,
  MenuItem,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";

import { Popper } from "@autocomplete/react";

import { renderInput, renderOption, styles } from "./common";

import {
  AutocompleteWrapper,
  AutocompleteWrapperProps
} from "@autocomplete/react";


export interface IAtutocompleteProps extends AutocompleteWrapperProps {
  classes?;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  // downshiftProps?: DownshiftProps<any>;
  // todo
  getOptions: any;
  error?: boolean;
  style?;
  helperText?: string;
  required?: boolean;
  displayOption?;
  customDisplayOption?;
  noResultsContent?;
  inputRef?;
  customDisplayOptions?: (args: { options; valueMap; inputValue }) => any;
  label?;
  displaySelectedOptions?;
  placeholder?: string;
  disable?: boolean;
  role?
}

const w: any = withStyles;
@w(styles)
export class Autocomplete extends React.Component<IAtutocompleteProps, any> {
  noResultsText = "No results found";
  containerRef;
  inputRef;
  optionsContainerRef;
  inputInFocus;
  constructor(props) {
    super(props);
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

  focus = () => {
    this.inputRef.current.focus();
  };

  render() {
    const {
      classes,
      inputProps,
      displayOption,
      customDisplayOption,
      error,
      customDisplayOptions,
      helperText,
      required,
      inputRef,
      style,
      noResultsContent,
      label,
      displaySelectedOptions,
      placeholder,
      disable,
      role,
      ...others
    } = this.props;

    const { getOptions } = this.props;

    // const { onInputValueChange, ..._downshiftOptions } =
    //   downshiftProps || emptyAny;

    return (
      <AutocompleteWrapper
        optionsContainerRef={this.optionsContainerRef.ref}
        {...others}
      >
        {({
          wrapperInputProps,
          wrapperOptionProps,
          isOptionsLoading,
          isOpen,
          options,
          inputValue,
          removeValue,
          value,
          valueToDisplay,
          valueToKey,
          valueMap,
          markedOptionIndex,
          optionToKey,
          optionToDisplay,
        }) => {
          const suggestions = customDisplayOptions
            ? customDisplayOptions({ options, valueMap, inputValue })
            : (options || []).map((option, index) => {
                const display = optionToDisplay(option);
                const key = optionToKey(option);
                if (
                  typeof display !== "string" &&
                  typeof display !== "number" &&
                  !React.isValidElement(display)
                ) {
                  throw new Error(
                    "[Autocomplete]:: The display of option is invalid please add optionToDisplay function prop to Autocomplete. ( e.g. optionToDisplay={(o)=> o.title} )"
                  );
                }
                if (typeof key !== "string" && typeof key !== "number") {
                  throw new Error(
                    "[Autocomplete]:: The key of option is invalid please add optionToKey function prop to Autocomplete. ( e.g. optionToKey={(o)=> o.key} )"
                  );
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
                  : renderOption({
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

          return (
            <div className={classes.container} ref={this.containerRef}>
              {renderInput({
                fullWidth: true,
                classes,
                label,
                style,
                disable,
                error,
                helperText,
                required,
                placeholder,
                ...inputProps,
                InputProps: wrapperInputProps(
                  {
                    value: inputValue,
                    ref: ref => {
                      this.inputRef.current = ref;
                      if (typeof inputRef === "function") {
                        inputRef(ref);
                      } else if (inputRef) {
                        inputRef.current = ref;
                      }
                    },
                    ...inputProps,
                    onFocus: () => (this.inputInFocus = true),
                    onBlur: () => (this.inputInFocus = false)
                  },
                  { ref: "inputRef" }
                ),
                value: inputValue
              })}
              {isOptionsLoading && (
                <LinearProgress
                  className={classes.linearProgress}
                  color="secondary"
                />
              )}
              {!role && isOptionsOpen ? (
                <Popper triggerOn={this.containerRef} maxHeight={256}>
                  {style => (
                    <Paper
                      {...this.optionsContainerRef}
                      className={classes.paper}
                      style={{
                        ...this.getInputWith(),
                        ...style,
                      }}
                    >
                      {suggestions.length
                        ? suggestions
                        : !isOptionsLoading &&
                          inputValue && (
                            <MenuItem>
                              <Typography>
                                {noResultsContent || this.noResultsText}
                              </Typography>
                            </MenuItem>
                          )}
                    </Paper>
                  )}
                </Popper>
              ) : null}
            </div>
          );
        }}
      </AutocompleteWrapper>
    );
  }
}
