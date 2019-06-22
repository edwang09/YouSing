import React, { Component } from 'react'
import HomeNav from '../components/homeNav'
import Footer from '../components/footer'
import {Link} from 'react-router-dom'

export default class Faq extends Component {

  render() {
    return (
      <div>
        <section className="faq-back">
        <HomeNav></HomeNav>
        <div className="faq">
          <h1>FAQ</h1>
            <div className="faq-card">
                <h2>Is this free?</h2>
                <p>It is 100% free at least for now. If you love the app, I am very happy.</p>
            </div>
            <hr/>
            <div className="faq-card">
                <h2>How to use it?</h2>
                <p>There are multiple ways you can use the app. We have listed a few here please check before using it.</p>
            </div>
            <hr/>
            <div className="faq-card">
                <h2>What device do I need?</h2>
                <p>The minimum requirement is simply anything with a screen. You can play on TV, Computer, iPad or even your cellphone, and use another device as ordering machine, it can again be your cellphone, iPad or computer. If you want to use a microphone, simply connect to the hosting device using a mixer or anything you want. You can find a example here.</p>
            </div>
            <hr/>
            <div className="faq-card">
                <h2>
How did you remove the vocal of a song? Why it sounds weird when I remove the vocal? 
Why the vocal cannot be removed completely for some songs?
</h2>
                <p>We use OOPS (Out Of Phase Stereo) to cancel the vocal of the MV from YouTube. We understand that this might not be the best and cleanest way to remove vocal, but this is the best we can. The audio will be gone completely if the original soundtrack is monophonic and the quality will not be satisfying is the sound is bad in quality. So, it is better to choose official MV to order while using the application.</p>
            </div>            <hr/>
            <div className="faq-card">
                <h2>What is the song base?</h2>
                <p>Anything you can find on YouTube you can order here even if it is never published.</p>
            </div>

        </div>


        </section>
        <Footer/>
      </div>
    )
  }
}
