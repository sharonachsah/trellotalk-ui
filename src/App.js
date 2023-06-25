import React, { useState, useEffect } from 'react';
import { Col, Row } from 'antd';
import './index.css';
import vmsg from 'vmsg';

const recorder = new vmsg.Recorder({
  wasmURL: 'https://unpkg.com/vmsg@0.4.0/vmsg.wasm'
});
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      chat: [],
      inputMessage: '',
      botTyping: false,
      isLoading: false,
      isRecording: false,
      recordings: []
    };
  }

  componentDidMount() {
    // Call any necessary initializations or side effects here
  }

  record = async () => {
    this.setState({ isLoading: true });
    if (this.state.isRecording) {
      const blob = await recorder.stopRecording();
      // this.saveRecording(blob);
      this.sendRecording(blob);

      this.setState({
        isLoading: false, isRecording: false, recordings: this.state.recordings.concat([URL.createObjectURL(blob)])
      });
    }
    else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        this.setState({ isRecording: true, isLoading: false });
      }
      catch (err) {
        console.log(err);
        this.setState({ isLoading: false });
      }
    }
  };

  saveRecording = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const anchorElement = document.createElement('a');
    anchorElement.href = url;
    anchorElement.download = filename;
    anchorElement.click();
    URL.revokeObjectURL(url);

    // Delete the recorded audio file
    URL.revokeObjectURL(this.state.recordings[this.state.recordings.length - 1]);
    const recordings = this.state.recordings.slice(0, -1);
    this.setState({ recordings });
  };

  sendRecording = async (blob) => {
    var formData = new FormData();
    formData.append('file', blob);
    console.log(formData);

    var requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow'
    };

    try {
      fetch("http://localhost:80/audio", requestOptions).then(response => response.text()).then(result => { console.log(result) }).catch(error => console.log('error', error));
    }
    catch (err) {
      console.log(err);
    }
  };

  handleVoiceSubmit = async (evt) => {
    evt.preventDefault();
    const { isRecording } = this.state;

    if (isRecording) {
      const blob = await recorder.stopRecording();
      this.sendRecording(blob);
      this.setState({
        isRecording: false,

      });
    }
  }

  handleTextSubmit = (evt) => {
    evt.preventDefault();
    const { inputMessage, chat } = this.state;

    const request_temp = { sender: "user", msg: inputMessage };

    if (inputMessage !== "") {
      this.setState(prevState => ({
        chat: [...prevState.chat, request_temp],
        botTyping: true,
        inputMessage: ''
      }));

      this.rasaSendTextAPI(inputMessage);
    } else {
      window.alert("Please enter a valid message");
    }
  }

  rasaSendTextAPI = async (msg) => {
    await fetch('http://localhost:5005/webhooks/rest/webhook', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'charset': 'UTF-8',
      },
      credentials: "same-origin",
      body: JSON.stringify({ "message": msg }),
    })
      .then(response => response.json())
      .then((response) => {
        if (response) {
          const temp = response[0];
          const recipient_msg = temp["text"];
          const response_temp = { sender: "bot", msg: recipient_msg };

          this.setState(prevState => ({
            botTyping: false,
            chat: [...prevState.chat, response_temp]
          }));
        }
      });
  }

  render() {
    const { chat, inputMessage, botTyping } = this.state;
    const { isLoading, isRecording, recordings } = this.state;

    return (
      <div className="App">
        <div className="Pagetitle">
          <Row>
            <Col span={24}>
              <h1 align='center'>TrelloTalk: A Voice-Powered TaskMaster</h1>
            </Col>
          </Row>
        </div>

        <div align='center' className="chatbox">
          <div className="innerchatdiv">
            {chat.map((user, key) => (
              <div key={key}>
                {user.sender === 'bot' ? (
                  <div className='botkeydiv' align='center'>
                    <Row className='chatrow'>
                      <Col span={3}>
                        <div>
                          <svg className='displayprofile' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                            <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
                          </svg>
                        </div>
                      </Col>
                      <Col span={20}>
                        <div className='botinputdiv'>
                          {chat[key].msg}
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div className='userkeydiv' align='center'>
                    <Row className='chatrow'>
                      <Col span={1}></Col>
                      <Col span={20}>
                        <div className='userinputdiv'>
                          {chat[key].msg}
                        </div>
                      </Col>
                      <Col span={3}>
                        <div>
                          <svg className='displayprofile' xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                            <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                          </svg>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='sendinputdiv'>
          <input onChange={e => this.setState({ inputMessage: e.target.value })} value={this.state.inputMessage} type="text" id="textinputarea" placeholder="Type a message" />
          <button onClick={this.handleTextSubmit} className="secondary" type="submit">
            <svg className='arrowbutton' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
            </svg>
          </button>
          <button className="secondary" onClick={this.record} disabled={isLoading} onAbort={this.sendRecording}>
            {isRecording ?
              <svg id='senddata' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
              </svg> :
              <svg className='senddata' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
              </svg>
            }
            {/* <svg id='senddata' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
            </svg> */}
          </button>
        </div>
      </div>
    );
  }
}

export default App;
