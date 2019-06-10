import React, { Component } from "react";

export default class Modal extends Component {
  listenKeyboard(event) {
    if (event.key === "Escape" || event.keyCode === 27) {
      this.props.onClose();
    }
  }

  componentDidMount() {
    if (this.props.onClose) {
      window.addEventListener("keydown", this.listenKeyboard.bind(this), true);
    }
  }

  componentWillUnmount() {
    if (this.props.onClose) {
      window.removeEventListener(
        "keydown",
        this.listenKeyboard.bind(this),
        true
      );
    }
  }

  onOverlayClick() {
    this.props.onClose();
  }

  onDialogClick(event) {
    event.stopPropagation();
  }
  render() {
    return (
      <div className="modal">
        <div className="overlay" />
        <div className="content" onClick={this.onOverlayClick.bind(this)}>
          <div className="dialog" onClick={this.onDialogClick}>
            <div className="modal-header">
              <h2>{this.props.title}</h2>
            </div>
            <div className="modal-body">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}
