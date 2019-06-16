import React, { Component } from "react";
import { connect } from "react-redux";

import Testmodal from "./modals/Testmodal";
import Ordermodal from "./modals/Ordermodal";
import Lyricmodal from "./modals/Lyricmodal";
const MODAL_COMPONENTS = {
  TEST_MODAL: Testmodal,
  ORDER_MODAL: Ordermodal,
  LYRIC_MODAL: Lyricmodal,
};

class ModalContainer extends Component {
  render() {
    if (!this.props.modalType) {
      return null;
    }

    const SpecificModal = MODAL_COMPONENTS[this.props.modalType];

    return <SpecificModal />;
  }
}

const mapStateToProps = state => ({
  modalType: state.modal.modalType
});

export default connect(
  mapStateToProps,
  {}
)(ModalContainer);
