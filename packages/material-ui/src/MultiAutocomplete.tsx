import * as React from "react";
import { Close } from "@material-ui/icons";
import './style/style.css'
import {
  Chip,
  LinearProgress,
  MenuItem,
  Paper,
  TextField,
  Grow,
  Popover,
  Typography,
  withStyles,
  Tooltip
} from "@material-ui/core";
import {
  Popper, AutocompleteWrapper,
  AutocompleteWrapperProps
} from "@autocomplete/react";

import { renderInput, renderOption, styles } from "./common";

export interface IMultiAutocompleteProps extends AutocompleteWrapperProps {
  classes?;
  inputProps?: React.HTMLProps<HTMLInputElement>;
  placeholder?: string;
  secondPlaceholder?: string;
  label?: string;
  onChipClick?: (value) => void;
  onOperatorClick?: (value) => void;
  customDisplayChip?: { [key: string]: ({ value, key }) => any };
  chipPlaceholder?: string;
  // downshiftProps?: DownshiftProps<any>;
  //todo
  error?: boolean;
  chipPlaceholderIcon?: any;
  style?;
  inputRef?;
  disable?: boolean;
  helperText?: string;
  required?: boolean;
  displayOption?;
  displaySelectedOptions?: boolean;
  customDisplayOptions?: (args: { options; valueMap; inputValue }) => any;
  customDisplayOption?: (
    args: {
      option;
      index;
      isSelected;
      itemProps;
      markedOptionIndex;
      valueMap;
    }
  ) => any;
  noResultsContent?;
  role?
}

const w: any = withStyles;
@w(styles)
export class MultiAutocomplete extends React.Component<
IMultiAutocompleteProps,
any
> {
  containerRef;
  inputRef;
  optionsContainerRef: any;
  noResultsText = "No results found";
  constructor(props) {
    super(props);
    this.containerRef = React.createRef();
    this.inputRef = React.createRef();
    this.optionsContainerRef = { ref: React.createRef() };
  }

  inputInFocus = false;

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

  isShowChipPlaceholder = () => {
    const { chipPlaceholder } = this.props;
    return chipPlaceholder && !this.inputInFocus;
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
      onChipClick,
      onOperatorClick,
      required,
      inputRef,
      style,
      chipPlaceholderIcon,
      customDisplayChip,
      noResultsContent,
      label,
      displaySelectedOptions,
      placeholder,
      disable,
      secondPlaceholder,
      chipPlaceholder,
      role,
      ...others
    } = this.props;

    const { getOptions } = this.props;

    let _displayChip = customDisplayChip || {};

    // const { onInputValueChange, ..._downshiftOptions } =
    //   downshiftProps || emptyAny;

    return (
      <AutocompleteWrapper
        multi={true}
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
          optionToDisplay
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
                  "[MultiAutocomplete]:: The display of option is invalid please add optionToDisplay function prop to MultiAutocomplete. ( e.g. optionToDisplay={(o)=> o.title} )"
                );
              }
              if (typeof key !== "string" && typeof key !== "number") {
                throw new Error(
                  "[MultiAutocomplete]:: The key of option is invalid please add optionToKey function prop to MultiAutocomplete. ( e.g. optionToKey={(o)=> o.key} )"
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
          const moreOptions = this.isShowChipPlaceholder()
            ? [
              <Chip
                key="placeholder"
                icon={chipPlaceholderIcon}
                // onDelete={chipPlaceholderIcon ? this.focus : undefined}
                className={classes.chipPlaceholder}
                onClick={this.focus}
                tabIndex={-1}
                label={chipPlaceholder}
              />
            ]
            : [];
          return (
            <div className={classes.container} ref={this.containerRef}>
              {renderInput({
                fullWidth: true,
                classes,
                label,
                style,
                disable,
                error: error,
                helperText: helperText,
                required,
                placeholder: (value || []).length
                  ? secondPlaceholder || placeholder
                  : placeholder,
                ...inputProps,
                InputProps: wrapperInputProps(
                  {
                    ref: ref => {
                      this.inputRef.current = ref;
                      if (typeof inputRef === "function") {
                        inputRef(ref);
                      } else if (inputRef) {
                        inputRef.current = ref;
                      }
                    },
                    className: classes.inputRoot,
                    classes: { input: classes.input },
                    onFocus: () => (this.inputInFocus = true),
                    onBlur: () => (this.inputInFocus = false),
                    startAdornment: [
                      ...Array.from(valueMap.keys()).map((key: string) => {
                        const value = valueMap.get(key);
                        switch (value.type) {
                          case 'operator': {
                            return (
                              <Tooltip title="Click to change operator">
                                <div className={classes.operator} onClick={() => onOperatorClick && onOperatorClick(value)}>
                                  {value.operator && value.operator.toUpperCase()}
                                </div>
                              </Tooltip>
                            )
                          }
                          default: {
                            if (!_displayChip[key]) {
                              const display = valueToDisplay(value);
                              return (
                                <Chip
                                  variant="outlined"
                                  key={key}
                                  onClick={() => onChipClick && onChipClick(value)}
                                  tabIndex={-1}
                                  label={display}
                                  deleteIcon={<Close />}
                                  className={classes.chip}
                                  onDelete={() => removeValue(value)}
                                />
                              );
                            }
                          }
                        }
                        return _displayChip[key]({ key, value });
                      }),
                      ...moreOptions
                    ]
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
              {!role && isOptionsOpen && (
                <Popper triggerOn={this.containerRef} maxHeight={256}>
                  {style => (
                    <Paper
                      {...this.optionsContainerRef}
                      className={classes.paper}
                      style={{
                        ...this.getInputWith(),
                        ...style
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
              )}
            </div>
          );
        }}
      </AutocompleteWrapper>
    );
  }
}
