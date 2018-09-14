from flask import Flask, request, send_from_directory
import pickle
from flask_cors import CORS
import json
from twilio.rest import Client
from TwitterSearch import *
import re


app = Flask(__name__, static_folder='static')
app.debug = True

CORS(app)


sexualPredators = pickle.load( open( "sexoffender.p", "rb" ) )
collisionMap = pickle.load( open( "collisionDensityCluster.p", "rb" ) )
@app.route("/index.html")
def root():
	return send_from_directory(app.static_folder, "index.html")

@app.route("/checkPredatorLocation")
def checkPredatorLocation():
	location = request.args.get('location')

	if location.lower().replace(" ","").strip() in sexualPredators:
		return "True"
	else:
		return "False"


@app.route("/getCollisions")
def getCollisions():
	return json.dumps(collisionMap)

@app.route("/sendSMS",methods=['post'])
def sendSMS():
	number  = request.form.get("number")
	location  = request.form.get("location")
	message = client.api.account.messages.create(
	    to="+1"+number,
	    from_="+14502311835",
	    body="Hello! This is Walksafe NYC, one of our users wanted to let you know that they are going to: \""+location+"\"")

	return "Sent"


def getAdr(twtEnq):
	seenTweets = {}
	fireTweets = []
	for tweet in twtEnq:
		if 'FDNYalerts MAN' in tweet['text']:
			spltStr = tweet['text'].split()
			if 'MAN ALL HANDS' in tweet['text']:
				alarmCode = 'ALL HANDS'
			else:
				alarmCode = spltStr[2]
			regexAdr = alarmCode + ' (.+?)' + ','
			regexRsn = ', ' + '(.+?)' + ','
			address = re.search(regexAdr, tweet['text'])
			reason = re.search(regexRsn, tweet['text'])
			if address and reason:
				if address.group(1) not in seenTweets:
					seenTweets[address.group(1)] = 0
					fireTweets.append([address.group(1), reason.group(1)])
	return json.dumps(fireTweets[0:8])

@app.route("/getTweets")
def getTweets():
	tuo = TwitterUserOrder('FDNYalerts')
	ts = TwitterSearch(

	)
	tweetEnquiry = ts.search_tweets_iterable(tuo)
	fireTweets = getAdr(tweetEnquiry)
	return fireTweets

if __name__ == "__main__":
	app.run()
