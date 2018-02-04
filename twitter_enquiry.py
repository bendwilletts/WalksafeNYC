from TwitterSearch import *
import re

class Tweet:
	def __init__ (self, address, reason):
		self.adr = address
		self.rsn = reason

def getAdr(twtEnq):
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
				store = Tweet(address.group(1), reason.group(1))
				fireTweets.append(store)
	return fireTweets[0:8]

try:
	tuo = TwitterUserOrder('FDNYalerts')
	#tso = TwitterUserOrder() # create a TwitterSearchOrder object
	#tso.set_keywords(['Donald', 'Trump']) # let's define all words we would like to have a look for
	#tso.set_language('en')
	#tso.set_include_entities(False) # and don't give us all those entity information

	# it's about time to create a TwitterSearch object with our secret tokens
	ts = TwitterSearch(
		consumer_key='g2E8WgnY0PeoE1Oth0qoBKCff',
		consumer_secret='zmeEFYbVEY0YCynqcD0uxBDfseBJNvnykOPZlQK9s9YXildIje',
		access_token='750755332285227008-majiilQCFYpQ7TiXZu3K6IIh8oEzOw0',
		access_token_secret='OAHBfG4FXmlOZi9wz9PpGa0E5y94fHYY8ury62efkXguI'
	)


	tweetEnquiry = ts.search_tweets_iterable(tuo)
	fireTweets = getAdr(tweetEnquiry)

	for adrTweet in fireTweets:
		print(adrTweet.adr + " -- " + adrTweet.rsn)
	#print( '@%s tweeted: %s' % ( tweet['user']['screen_name'], tweet['text'] ) )
	print(len(fireTweets))
except TwitterSearchException as e: # take care of all those ugly errors if there are some
	print(e)

#api = twitter.Api (consumer_key='g2E8WgnY0PeoE1Oth0qoBKCff',
#	consumer_secret='zmeEFYbVEY0YCynqcD0uxBDfseBJNvnykOPZlQK9s9YXildIje',
#	access_token_key='750755332285227008-majiilQCFYpQ7TiXZu3K6IIh8oEzOw0',
#	access_token_secret='OAHBfG4FXmlOZi9wz9PpGa0E5y94fHYY8ury62efkXguI')

#query = api.search.tweets(q = "lazy dog")

#-----------------------------------------------------------------------
# How long did this query take?
#-----------------------------------------------------------------------
#print "Search complete (%.3f seconds)" % (query["search_metadata"]["completed_in"])

#-----------------------------------------------------------------------
# Loop through each of the results, and print its content.
#-----------------------------------------------------------------------
#for result in query["statuses"]:
#	print "(%s) @%s %s" % (result["created_at"], result["user"]["screen_name"], result["text"])
