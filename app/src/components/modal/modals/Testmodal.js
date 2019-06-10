import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import { hideModal } from "../../../actions/modalActions";

class Testmodal extends Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }

  onClose() {
    this.props.hideModal();
  }

  render() {
    return (
      <Modal onClose={this.onClose} title="TEST">
        <div className="login">
          <h1>TEST</h1>
          <p>
            this is just a simple modal to test the functionality of the app
          </p>
        </div>
        <hr />
        <div className="clear-fix" />
        <div className="float-right">
          <button className="btn btn-primary" onClick={this.onClose}>
            Close
          </button>
        </div>
      </Modal>
    );
  }
}
export default connect(
  null,
  { hideModal }
)(Testmodal);
