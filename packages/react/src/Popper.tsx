import * as React from "react";

export interface PopperProps {
  triggerOn;
  maxHeight?: number;
  children: (style) => any;
}

export class Popper extends React.Component<PopperProps> {
  itself;
  constructor(props) {
    super(props);
    this.itself = React.createRef();
    document.addEventListener("scroll", this.changeHandler, true);
  }

  state = {
    //display: "none"
    position: "fixed",
    zIndex: 50,
    top: undefined,
    bottom: undefined
  };

  changeHandler = e => {
    const state = Popper.getDerivedStateFromProps(this.props, this.state);
    if (state != null) {
      this.setState(state);
    }
  };

  static calculatePosition = (triggerOn, elmSize) => {
    if (triggerOn.current) {
      const winSize = window.innerHeight;

      //const top =   getOffsetTop(triggerOn.current);
      const elemRect = triggerOn.current.getBoundingClientRect();
      let top, bottom;
      // there is different between chrome and edge be carful with this object (elemRect)
      top = elemRect.top + elemRect.height;

      // if the screen size smaller then popper change the position of the popper up from the target
      if (typeof elmSize == "number" && top + elmSize > winSize) {
        top = undefined;
        bottom = winSize - elemRect.y;
      }
      return { top, bottom };
    }
    return {};
  };

  componentWillUnmount() {
    document.removeEventListener("scroll", this.changeHandler, true);
  }

  static getDerivedStateFromProps(props, state) {
    const { top, bottom } = Popper.calculatePosition(
      props.triggerOn,
      props.maxHeight
    );
    if (top !== state.top || bottom !== state.bottom) {
      return { ...state, top, bottom };
    }
    return null;
  }

  render() {
    const { children } = this.props;
    const style: any = this.state;
    return (
      <div ref={this.itself} style={style}>
        {children(this.state)}
      </div>
    );
  }

  componentDidUpdate() {
    this.changeHandler(undefined);
  }
}
