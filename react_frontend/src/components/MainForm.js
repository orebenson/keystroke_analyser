import { useEffect, useState } from 'react';
import '../styles.css';

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

    const handleInputChange = (event) => {
        const { name, value } = event.target
        resetInput()
        setCount(0)
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    useEffect(() => {
        if (formData.password !== '' && formData.username !== '' && formData.type !== '') {
            setReadOnly(false)
        } else {
            setReadOnly(true)
        }
    }, [formData])

    const resetInput = () => {
        setKeylog([])
        setInput('')
        setInputStatus('')
    }

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


    const handleKeystrokes = (event) => {
        const { key, timeStamp } = event

        if (!keysAllowed.has(key)) return
        if (key !== prompt[input.length]) {
            setInputStatus('incorrect')
            return
        } else {
            setInputStatus('correct')
        }
        setKeylog((prevKeylog) => [...prevKeylog, timeStamp])
        setInput((prevInput) => prevInput + key)
    }

    const sendRequest = async (data, keytimes) => {

        try {
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

            const json = await response.json()
            resetInput()
            setFeedback(json.message)
            if (json.status === 'good') {
                setFeedbackStatus('correct')
            } else if (json.status === 'bad') {
                setFeedbackStatus('error')
            }
        } catch (error) {
            setFeedback('error, check console')
            setFeedbackStatus('error')
            console.error('Error:', error);
        }

        setLoading(false)
    }

    const handleSubmit = () => {
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
                    onBlur={resetInput}
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
                            value="MLPclf"
                            onChange={handleInputChange}
                        />
                        Multi-layer Perceptron
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="testSVC"
                            name="type"
                            value="SVMclf"
                            onChange={handleInputChange}
                        />
                        Support Vector
                    </label>

                    <label>
                        <input
                            type="radio"
                            id="testKNN"
                            name="type"
                            value="KNNclf"
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
                    placeholder='results...'
                    disabled
                />

            </form>
        </div>
    );
}

export default MainForm;
