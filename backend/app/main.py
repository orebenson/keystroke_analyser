from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime

from . import schemas, models
from .database import SessionLocal, engine
from .matcher import Matcher

models.BaseModel.metadata.create_all(bind=engine)

def get_db():
	db = SessionLocal()
	try:
		yield db
	finally:
		db.close()


app = FastAPI()

app.add_middleware(
	CORSMiddleware,
	allow_origins=['http://localhost:3000'],
	allow_methods=['POST'],
	allow_headers=['*']
)

# initialise new matcher

Matcher = Matcher()
Matcher.addDataFromDB('app.db')

@app.get('/')
async def hello():
	return {"message": "Hello World"}

@app.post('/sample/')
async def sample(request: schemas.Request, session: Session = Depends(get_db)) -> schemas.Response:
	print('user: ' + request.username + ' keytype: ' + request.keytype)

	username = request.username
	password = request.password
	keytimes = request.keytimes
	keytype = request.keytype

	user = session.query(models.User).filter(models.User.username == username).first()

	if user and password != user.password:
		return schemas.Response(
			status='bad',
			message='Username and password did not match'
		)

	if keytype == 'train':
		if not user:
			user = models.User(username=username, password=password)
			session.add(user)
			session.commit()
			session.refresh(user)

		sample = models.Sample(user_id=user.id, timestamp=datetime.now(), keytimes=keytimes)
		session.add(sample)
		session.commit()

		# add new data to the matcher class
		global Matcher
		data_status = Matcher.addSample(user.id, keytimes)
		print(data_status)
		# retrain classifiers with new data
		training_status = Matcher.trainClassifiers()
		print(training_status)

		return schemas.Response(
			status='good',
			message='Training data submitted'
		)
		
	else:
		if not user:
			return schemas.Response(
				status='bad',
				message='User does not exist'
			)
		
		return schemas.Response(
				status='good',
				message='[matching output placeholder]'
			)

		# RUN MATCHING ALGORITHM
		# user must have more than 5 samples in the database, 'if not, return not enough samples'

		# match = get_match(user.id, keytimes, keytype)

		# if match:
		# 	return schemas.Response(
		# 		status='good',
		# 		message='Input matched'
		# 	)
		# else:
		# 	return schemas.Response(
		# 		status='bad',
		# 		message='Input did not match'
		# 	)

	return schemas.Response(
		status='bad',
		message='You werent supposed to see this'
	)




