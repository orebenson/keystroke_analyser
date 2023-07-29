from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import bcrypt

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
# train on existing database
# database must contain at least 2 different users, each with at least 10 samples for this to work ¯\_(ツ)_/¯
print('INFO:	initializing classifiers on the database...')
db_upload_status = Matcher.addDataFromDB('app.db')
print(f'{db_upload_status["status"]}:	{db_upload_status["message"]}')

@app.get('/')
async def hello():
	print('GET')
	return {"status": "SUCCESS", "message": "hello World"}

@app.post('/sample/')
async def sample(request: schemas.Request, session: Session = Depends(get_db)) -> schemas.Response:
	print('POST:    user: ' + request.username + ', keytype: ' + request.keytype)

	username = request.username
	password = request.password.encode('utf-8')
	keytimes = request.keytimes
	keytype = request.keytype

	hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())

	user = session.query(models.User).filter(models.User.username == username).first()
	fresh_user_flag = False
	if user:
		pass_match = bcrypt.checkpw(password, user.password)
		if not pass_match:
			return schemas.Response(
				status='bad',
				message='username and password did not match'
			)

	if keytype == 'train':
		message = ''
		if not user:
			user = models.User(username=username, password=hashed_password)
			session.add(user)
			session.commit()
			session.refresh(user)
			message += 'new user created, '
			fresh_user_flag = True

		sample = models.Sample(user_id=user.id, timestamp=datetime.now(), keytimes=keytimes)
		session.add(sample)
		session.commit()

		# add new data to the matcher class
		global Matcher
		data_status = Matcher.addSample(user.id, keytimes)
		print(f'{data_status["status"]}:    {data_status["message"]}')
		# retrain classifiers with new data if the user already existed
		if not fresh_user_flag:
			training_status = Matcher.trainClassifiers()
			print(f'{training_status["status"]}:    {training_status["message"]}')
		message += 'training data submitted'

		return schemas.Response(
			status='good',
			message=message
		)
		
	else:
		if not user:
			user = models.User(username=username, password=hashed_password)
			session.add(user)
			session.commit()
			session.refresh(user)
			return schemas.Response(
				status='good',
				message='new user created, not enough samples'
			)
		
		# run matching algorithm. if less than 10 samples, algorhtm will return 'error: not enough samples'
		match = Matcher.getMatch(user.id, keytimes, keytype)
		print(f'{match["status"]}:    {match["message"]}')

		# if enough samples, algorithm will return 'accepted'/'not accepted' and data to be dislplayed to user
		if match["status"] == 'ERROR':
			return schemas.Response(
				status='bad',
				message=f'{match["message"]}'
			)
		if match['status'] == 'ACCEPTED':
			return schemas.Response(
				status='good',
				message=f'{match["message"]}'
			)
		if match['status'] == 'REJECTED':
			return schemas.Response(
				status='bad',
				message=f'{match["message"]}'
			)
			

	return schemas.Response(
		status='bad',
		message='you werent supposed to see this'
	)




