from pydantic import BaseModel
from typing import List

class Request(BaseModel):
	username: str
	password: str
	keytimes: List[float]
	keytype: str

class Response(BaseModel):
	status: str
	message: str




