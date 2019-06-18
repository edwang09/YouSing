import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "../Modal";
import Axios from "axios";
import { hideModal } from "../../../actions/modalActions";

class Ordermodal extends Component {
  constructor(props) {
    super(props);
    this.onClose = this.onClose.bind(this);
  }
  componentWillMount() {
    this.setState({
        video:this.props.modal.options.video,
        roomid: this.props.modal.options.roomid
    });
  }
  onClose = () => e => {
    this.props.hideModal();
  };
  makeOrder=(type)=>e=>{
      Axios.post('/api/karaokes/order',{
        roomid: this.state.roomid,
        order:{...this.state.video,type},
        type:type
    }).then(res=>{
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
    this.props.hideModal();
  }
  render() {
    const { video } = this.props.modal.options
    return (
      <Modal onClose={this.onClose} title="Order Detail">
        <div className="login">
          <div className="itemcard">
            <div className="thumbnail">
              <img src={video.img} alt={video.title}/>
            </div>
            <div className="information">
              <h4>{video.title}</h4>
            </div>
          </div>
        </div>
        <hr />
        <div className="actions">
          <button className="button secondary" onClick={this.makeOrder("original")}>
            Order original
          </button>
          <button className="button secondary" onClick={this.makeOrder("accompany")}>
            Order accompany
          </button>
          <button  className="button" onClick={this.onClose()}>
            Close
          </button>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  modal: state.modal
});

export default connect(
  mapStateToProps,
  { hideModal }
)(Ordermodal);
