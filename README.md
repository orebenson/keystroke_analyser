# Keystroke Analysis

Welcome to my Keystroke Analysis Application. This research application is designed to collect and analyze keystroke data using various machine learning algorithms. It extends my original keystroke authentication research website to enhance user experience, including algorithm testing and data analysis feedback.

### Research summary: 
- Collected and analyzed over 30,000 keystrokes, implementing machine learning algorithms for user classification and authentication, with accuracies exceeding 85%.
- Contact me for more detailed results report.

## Setup
### Backend
#### Activate VE and start server
```
> python -m venv .venv
> .\.venv\Scripts\activate
> pip install -r requirements.txt
> uvicorn app.main:app --reload
```
#### Load existing database
Backend can be trained on existing database named 'app.db'
* Database must have 2 or more users each with 10 or more entries to be valid.
* Database must have a 'sample' table of the format:
```
    userid || sample
    0      || [0, keytime_1, keytime_2, ... keytime_n] 
    1      || [0, keytime_1, keytime_2, ... keytime_n] 
    ...    || ... 
```
* The 'prompt' variable in backend main.py and frontend MainForm.js must be the same in order for this to work

### Frontend
```
> npm start
```

![front_page](/assets/keystrokes.PNG)

## Technologies
* Python > 3.11.1
* Skikit-learn > 1.2.2
* Scipy > 1.10.1
