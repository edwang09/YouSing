import React, { Component } from 'react'
import HomeNav from '../components/homeNav'
import Footer from '../components/footer'
import {Link} from 'react-router-dom'

export default class Howtouse extends Component {

  render() {
    return (
      <div>
        <section className="howtouse-back">
        <HomeNav></HomeNav>
        <div className="howtouse">
          <h1>How to use</h1>
          <h3>Step 1: Setting up devices</h3>
          <p>There are multiple ways to set up devices. The only priciple is to have a bigger screen that can open up a browser to serves as a display/host
            (either it is a TV connected to a computer or a smartTV that have a built-in browser), and several small electronic devices (like smartphone, laptop, tablet) as 
            ordering machines/client. 
          </p>
          <p>
            In order to have the best experience possible, a mixer and microphone is recommanded in the set up. Below, I listed several example set ups that can turn 
            your home into a Karaoke Club.
          </p>
          <h5>Set up 1</h5>
          <img src={require("../assets/demo.png")} alt=""/>
          <h5>Set up 2</h5>
          <img src={require("../assets/demo2.png")} alt=""/>
          <h3>Step 2: Open up host display</h3>
          <p>After you have set up the karaoke and tested everything works. On your host screen, navigate to the host part of the application, you can find it as shown below:
          </p>
          <img src={require("../assets/demo3.jpg")} alt=""/>
          <h3>Step 3: Link to client order machine</h3>
          <p>After you set up your host part, you will find the room number on the host screen, remember that. Now, navigate to client part of the application on your portible divices
             and enter the room number to order karaokes, as shown below:
          </p>
          <h5>On host screen</h5>
          <img src={require("../assets/demo4.jpg")} alt=""/>
          <h5>On mobile device</h5>
          <img src={require("../assets/demo5.jpg")} alt=""/>
          <h3>Step 4: Enjoy</h3>

        </div>


        </section>
        <Footer/>
      </div>
    )
  }
}
