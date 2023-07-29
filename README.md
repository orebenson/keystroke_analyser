# Keystroke Analysing
### Ore Benson

Full-stack keystroke analysis website.

This is an extension of my keystroke authentication reserach website, geared towards user experience instead of research.
It includes algorithms testing and data analysis feedback.

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


## Technologies
* Python > 3.11.1
* Skikit-learn > 1.2.2
* Scipy > 1.10.1

## Setup backend
```
> pip install -r requirements.txt
```
### Activate VE and start server
```
> python -m venv .venv
> .\.venv\Scripts\activate
> pip install -r requirements.txt
> pip freeze > requirements.txt
> deactivate
> uvicorn app.main:app --reload
```

## Start frontend
```
> npm start
```

![front_page](/assets/keystrokes.PNG)
