import { useEffect, useState } from 'react';
import './styles.css';

function MainForm() {
    const prompt = "the quick brown fox jumps over the lazy dog"
    const keysAllowed = new Set(' abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,')
    const [keylog, setKeylog] = useState([])
    const [count, setCount] = useState(0)
    const [readOnly, setReadOnly] = useState(true)
    const [input, setInput] = useState('')
    const [feedback, setFeedback] = useState('')
    const [feedbackStatus, setFeedbackStatus] = useState('')
    const [loading, setLoading] = useState(false)
    const [inputStatus, setInputStatus] = useState('')
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        type: '',
    })

    // function to reset input and count if username/password fields changed
    const handleInputChange = (event) => {
        const { name, value } = event.target
        resetInput()
        setCount(0)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    //input should be readonly when username or password are empty
    useEffect(() => {
        if (formData.password !== '' && formData.username !== '' && formData.type !== '') {
            setReadOnly(false)
        } else {
            setReadOnly(true)
        }
    }, [formData])

    //reset input field when username/password is changed, when input is blurred, and when data is sent to server
    const resetInput = () => {
        setKeylog([])
        setInput('')
        setInputStatus('')
    }

    // function to be run on click of input field, showing alerts
    const inputAlerter = () => {
        if (formData.username === '' || formData.password === '') {
            alert('Username and password cannot be empty.')
            return
        }
        if (formData.type === '') {
            alert('Must select a submission option.')
            return
        }
    }

    // function to be run on every keypress in input field, recording keystrokes, and only allowing correct inputs
    const handleKeystrokes = (event) => {
        const { key, timeStamp } = event

        // check whether character matches prompt
        if (!keysAllowed.has(key)) return
        if (key !== prompt[input.length]) {
            setInputStatus('incorrect')
            return
        } else {
            setInputStatus('correct')
        }
        // create list of keytimes
        setKeylog((prevKeylog) => [...prevKeylog, timeStamp])
        setInput((prevInput) => prevInput + key)
    }

    // function for sending data to the server and status retrieval
    const sendRequest = async (data, keytimes) => {

        const URL = "http://localhost:8000/sample/"
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: data.username,
                password: data.password,
                keytimes: keytimes,
                keytype: data.type,
            }),
        })
            .catch((error) => {
                console.error('Error:', error);
            })

        const json = await response.json()
        .catch((error) => {
            console.error('Error:', error);
        }) // contains status and message (and analytics if test data sent)

        resetInput()
        setFeedback(json.message)
        if (json.status === 'good') {
            setFeedbackStatus('correct')
        } else if (json.status === 'bad') {
            setFeedbackStatus('error')
        }
        setLoading(false)

    }
    
    // function for submnitting data to request function
    const handleSubmit = () => {
        // calculate keytimes
        const new_keytimes = keylog.map((time, idx) => {
            if (idx === 0) {
                return 0
            }
            const diff = time - keylog[idx - 1]
            return diff
        })
        sendRequest(formData, new_keytimes)
        setCount((count) => count + 1)
        setReadOnly(false)
    }
    
    useEffect(() => {
        // submit form once sentence is complete
        if (input.length === prompt.length) {
            setLoading(true)
            setReadOnly(true)
            setInputStatus('correct')
            handleSubmit()
        }
    }, [input])



    return (
        <div className="mainForm">
            <form id="form">

                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder='Username...'
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                />

                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder='Password...'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                <input
                    type="text"
                    id="prompt"
                    name="prompt"
                    value={prompt}
                    disabled
                />

                <input
                    type="text"
                    id="input"
                    name="input"
                    className={inputStatus}
                    placeholder='Input...'
                    autoComplete="off"
                    value={input}
                    onClick={inputAlerter}
                    onKeyDown={handleKeystrokes}
                    required
                    readOnly={readOnly}
                />

                <span className='types'>

                    <label>
                        Count:
                        <div id="count">
                            {count}
                        </div>
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="train"
                            name="type"
                            value="train"
                            onChange={handleInputChange}
                        />
                        Train
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="testMLP"
                            name="type"
                            value="testMLP"
                            onChange={handleInputChange}
                        />
                        Multi-layer Perceptron
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="testSVC"
                            name="type"
                            value="testSVC"
                            onChange={handleInputChange}
                        />
                        Support Vector
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="testKNN"
                            name="type"
                            value="testKNN"
                            onChange={handleInputChange}
                        />
                        K-Nearest Neighbours
                    </label>

                </span>

                <input
                    type="text"
                    id="feedback"
                    className={feedbackStatus}
                    value={loading ? 'loading...' : feedback}
                    placeholder='results go here...'
                    disabled
                />

            </form>
        </div>
    );
}

export default MainForm;
