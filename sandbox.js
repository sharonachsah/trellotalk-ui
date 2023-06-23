import "./index.css";
import { Row, Col } from "antd";
import React, { useRef } from "react";


const App = () => {
    const textInputRef = useRef(null);

    const send_transcription_to_rasa = (transcription) => {
        const rasaServerUrl = "http://localhost:5005";
        // Remove dot from transcription
        transcription = transcription.replace(".", "").trim();

        const goodbyeTranscriptions = new Set([
            "Bye",
            "bye",
            "Goodbye",
            "goodbye",
            "See you later",
            "see you later",
            "Bye!",
            "bye!",
            "Goodbye!",
            "goodbye!",
            "See you later!",
            "see you later!",
        ]);

        if (goodbyeTranscriptions.has(transcription)) {
            let startRecognition = false;
            // Use appropriate exit method for your environment
            // For example, in a web browser, you could redirect to another page or display a goodbye message.
            return;
        }

        console.log("Transcription Payload:", transcription);

        const payload = { message: transcription.toLowerCase() };

        fetch(`${rasaServerUrl}/webhooks/rest/webhook`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                } else {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
            })
            .then((data) => {
                const botResponse = data[0].text;
                console.log("Bot said: ", botResponse);
                // Update the UI with the bot's response using the appropriate method for your UI framework
                // For example, in React, you would update the state or trigger a re-render to display the bot's response.

                // Replace the following code with your UI update logic
                const botResponseTextArea = document.createElement("textarea");
                botResponseTextArea.style.cssText =
                    "text-align: left;width: 100%; height: 70px; font-size: 16px; font-weight: bold; color: rgb(255, 255, 255); background-color: rgb(38, 39, 48); border: 3px solid rgb(14, 17, 23); border-radius: 10px; padding: 10px; resize: none;";
                botResponseTextArea.readOnly = true;
                botResponseTextArea.value = `Bot said: ${botResponse}`;
                document.body.appendChild(botResponseTextArea);
                // speak(botResponse);
                setTimeout(() => {
                    document.body.removeChild(botResponseTextArea);
                }, 200);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }

    const handleSendTranscription = () => {
        const transcription = textInputRef.current.value;
        send_transcription_to_rasa(transcription);
        // console.log(transcription);
    };

    // const [date, setDate] = useState(null);
    // const [messageApi, contextHolder] = message.useMessage();
    // const handleChange = (value) => {
    //   messageApi.info(`Selected Date: ${value ? value.format('YYYY-MM-DD') : 'None'}`);
    //   setDate(value);
    // };
    return (
        <div style={{ margin: "auto auto auto auto" }}>
            <script src="script.js"></script>
            <div className="header">TrelloTalk: A Voice-Powered TaskMaster!</div>
            <div className="chatbox">
                <Row className="chatrow">
                    <Col span={3}>
                        <div>
                            <svg
                                className="displayprofile senddata secondary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 640 512"
                            >
                                <path d="M320 0c17.7 0 32 14.3 32 32V96H472c39.8 0 72 32.2 72 72V440c0 39.8-32.2 72-72 72H168c-39.8 0-72-32.2-72-72V168c0-39.8 32.2-72 72-72H288V32c0-17.7 14.3-32 32-32zM208 384c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H208zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H304zm96 0c-8.8 0-16 7.2-16 16s7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H400zM264 256a40 40 0 1 0 -80 0 40 40 0 1 0 80 0zm152 40a40 40 0 1 0 0-80 40 40 0 1 0 0 80zM48 224H64V416H48c-26.5 0-48-21.5-48-48V272c0-26.5 21.5-48 48-48zm544 0c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H576V224h16z" />
                            </svg>
                        </div>
                    </Col>
                    <Col span={20}>
                        <div className="botinputdiv">bot</div>
                    </Col>
                </Row>

                <Row className="chatrow">
                    <Col span={1}></Col>
                    <Col span={20}>
                        <div className="userinputdiv">user</div>
                    </Col>
                    <Col span={3}>
                        <div>
                            <svg
                                className="displayprofile senddata secondary"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 448 512"
                            >
                                <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
                            </svg>
                        </div>
                    </Col>
                </Row>

                <div className="sendinput">
                    <input id="textinputarea" placeholder="Type your message" ref={textInputRef} />
                    <button className="secondary" onClick={() => handleSendTranscription()}>
                        <svg
                            className="senddata"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
                        </svg>
                    </button>
                    <button className="secondary">
                        <svg
                            className="senddata"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 384 512"
                        >
                            <path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z" />
                        </svg>
                    </button>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default App;