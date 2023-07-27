# Keystroke Analysing
### Ore Benson

Full-stack keystroke analysis website.

This is an extension of my keystroke authentication reserach website, geared towards user experience instead of research.
It includes algorithms testing and data analysis feedback


## Technologies
* Python > 3.11.1
* Skikit-learn > 1.2.2
* Scipy > 1.10.1

## Setup
```
> pip install -r requirements.txt
```
### Activate VE
```
> python -m venv .venv
> .\.venv\Scripts\activate
> pip install -r requirements.txt
> pip freeze > requirements.txt
> deactivate
> uvicorn app.main:app --reload
```

### Start frontend
```
> npm start
```
