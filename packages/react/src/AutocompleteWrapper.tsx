import * as React from "react";
import * as ReactDOM from "react-dom";
import computeScrollIntoView from "compute-scroll-into-view";

import {
  BaseAutocompleteLogic,
  BaseAutocompleteLogicOptions,
  BaseAutocompleteLogicStatus,
  AutocompleteLogic,
  MultiAutocompleteLogic
} from "@autocomplete/core";
import { Subscribe } from "@storex/react/lib";

interface AutocompleteWrapperArgs extends BaseAutocompleteLogicStatus {
  wrapperInputProps: (
    props?: React.HTMLProps<HTMLInputElement> | any,
    options?
  ) => React.HTMLProps<HTMLInputElement>;
  isOpen: boolean;
  removeValue: Function;
  addOption;
  optionToDisplay: Function;
  optionToKey: Function;
  valueToDisplay: Function;
  valueToKey: Function;
  wrapperOptionProps: (
    key: number | string,
    props?: React.HTMLProps<HTMLInputElement> | any
  ) => React.HTMLProps<HTMLInputElement>;
}

export interface AutocompleteWrapperProps
  extends BaseAutocompleteLogicOptions<any> {
  multi?: boolean;
  notBlurAfterEnter?: boolean;
  optionsContainerRef?;
  children?: (args: AutocompleteWrapperArgs) => any;
}
export class AutocompleteWrapper extends React.Component<
  AutocompleteWrapperProps,
  any
> {
  autoLogic: BaseAutocompleteLogic<any>;
  refMap = new Map();
  inputRef;

  constructor(props) {
    super(props);
    this.autoLogic = props.multi
      ? new MultiAutocompleteLogic()
      : new AutocompleteLogic();
    this.autoLogic.onMarkedOptionChange(this.markedChangeHandler);
    this.autoLogic.onEnter(this.blurInput);
    this.autoLogic.initArgs(props);
  }

  blurInput = () => {
    if (this.inputRef && this.inputRef.blur && !this.props.notBlurAfterEnter) {
      this.inputRef.blur();
    }
  };

  markedChangeHandler = ({ key, index, option }) => {
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

  wrapperInputProps = (
    props: React.HTMLProps<HTMLInputElement> = {},
    options?
  ) => {
    const { onChange, ref, onKeyDown, onBlur, onFocus, ...others } = props;
    return {
      ...others,
      onKeyDown: e => {
        if (onKeyDown) {
          onKeyDown(e);
        }
        this.autoLogic.onKeyDown(e);
      },
      onChange: e => {
        if (onChange) {
          onChange(e);
        }
        this.autoLogic.onInputChange(e);
      },
      onBlur: e => {
        if (onBlur) {
          onBlur(e);
        }
        this.autoLogic.onBlur(e);
      },
      onFocus: e => {
        if (onFocus) {
          onFocus(e);
        }
        this.autoLogic.onFocus(e);
      },
      [options && options.ref ? options.ref : "ref"]: _ref => {
        if (!_ref) {
          return;
        }
        this.inputRef = _ref;
        if (typeof ref === "function") {
          ref(_ref);
        } else if (ref) {
          ref["current"] = _ref;
        }
      }
    };
  };

  wrapperOptionProps = (key, props: React.HTMLProps<HTMLInputElement> = {}) => {
    const { onClick, ref, ...others } = props;
    return {
      ...others,
      onClick: e => {
        if (onClick) {
          onClick(e);
        }
        this.autoLogic.addOptionByKey(key);
      },
      ref: _ref => {
        if (!_ref) {
          return;
        }
        this.refMap.set(key, _ref);
        if (typeof ref === "function") {
          ref(_ref);
        } else if (ref) {
          ref["current"] = _ref;
        }
      }
    };
  };

  render() {
    this.autoLogic.updateArgs(this.props);
    const state = this.autoLogic.state;
    const isOpen = this.autoLogic.needToBeOpen;
    const {
      removeValue,
      optionToDisplay,
      optionToKey,
      valueToKey,
      valueToDisplay,
      addOption
    } = this.autoLogic;

    const { wrapperOptionProps, wrapperInputProps } = this;
    return (
      <Subscribe to={this.autoLogic}>
        {() => {
          this.refMap.clear();
          const state = this.autoLogic.state;
          const isOpen = this.autoLogic.needToBeOpen;

          return this.props.children({
            ...state,
            isOpen,
            wrapperInputProps,
            wrapperOptionProps,
            addOption,
            removeValue,
            optionToDisplay,
            optionToKey,
            valueToDisplay,
            valueToKey
          });
        }}
      </Subscribe>
    );
  }
}

/**
 * Scroll node into view if necessary
 * @param {HTMLElement} node the element that should scroll into view
 * @param {HTMLElement} rootNode the root element of the component
 */
function scrollIntoView(node, rootNode) {
  if (node === null) {
    return;
  }

  const actions = computeScrollIntoView(node, {
    boundary: rootNode,
    block: "nearest",
    scrollMode: "if-needed"
  });
  actions.forEach(({ el, top, left }) => {
    el.scrollTop = top;
    el.scrollLeft = left;
  });
}
