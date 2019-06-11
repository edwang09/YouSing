import React, { Component } from 'react'
import HomeNav from '../components/homeNav'
import Footer from '../components/footer'
import {Link} from 'react-router-dom'

export default class Landing extends Component {

  render() {
    return (
      <div>
        <section className="intro">
          <HomeNav></HomeNav>
          <div className="catch">
            <div className="catch-container">
            <p>Make Home Karaoke Up-to-date with <span className="brand">YouSing</span></p>
            <button>Start Karaoke</button>
            </div>
          </div>
        </section>
        <section className="about">
          <div className="catch">
            <div>
              <h2>About</h2>
              <p>
              YouSing is an incredible app that allows you to Sing newly released songs with your families or friends at home. As long as the song is available on YouTube, Our processor can simply transform original song into Accompany using OOPS. No more extra expense, no more paying for the subscriptions.
              </p>
            </div>
            <button>FAQ</button>
          </div>
          <div className="picture">
            <img src={require("../assets/sound.jpg")} alt="sound"/>
            <img src={require("../assets/sound2.jpg")} alt="sound2"/>
          </div>
        </section>
        
        <section className="playonanyscreen">
          <div className="picture">
          </div>
          <div className="catch">
            <div>
              <h3>Play on any device</h3>
              <p>
              We know how frustrating to make a home karaoke work properly. We created a much easier way to let you simply start to sing. With YouSing, you can use any device as a hosting screen, it could be your TV, computer, or even on your tablet.              
              </p>
            </div>
            <Link to="/host"><button>Host a Karaoke</button></Link>
          </div>
        </section>
        
        <section className="yourphoneisremote">
          
          <div className="catch">
            <div>
              <h3>Your phone is remote</h3>
              <p>
              Use your phone as a remoter to add to the queue or other actions like add/remove vocal of original music, skip to next, restart from beginning and much more.
              </p>
            </div>
            <Link to="/client"><button>Join a Karaoke Room</button></Link>
          </div>
          <div className="picture">
          </div>
        </section>
        <Footer/>
      </div>
    )
  }
}
