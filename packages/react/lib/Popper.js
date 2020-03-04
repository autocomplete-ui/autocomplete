"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class Popper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //display: "none"
            position: "fixed",
            zIndex: 50,
            top: undefined,
            bottom: undefined
        };
        this.changeHandler = e => {
            const state = Popper.getDerivedStateFromProps(this.props, this.state);
            if (state != null) {
                this.setState(state);
            }
        };
        this.itself = React.createRef();
        document.addEventListener("scroll", this.changeHandler, true);
    }
    componentWillUnmount() {
        document.removeEventListener("scroll", this.changeHandler, true);
    }
    static getDerivedStateFromProps(props, state) {
        const { top, bottom } = Popper.calculatePosition(props.triggerOn, props.maxHeight);
        if (top !== state.top || bottom !== state.bottom) {
            return Object.assign(Object.assign({}, state), { top, bottom });
        }
        return null;
    }
    render() {
        const { children } = this.props;
        const style = this.state;
        return (React.createElement("div", { ref: this.itself, style: style }, children(this.state)));
    }
    componentDidUpdate() {
        this.changeHandler(undefined);
    }
}
exports.Popper = Popper;
Popper.calculatePosition = (triggerOn, elmSize) => {
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
//# sourceMappingURL=Popper.js.map