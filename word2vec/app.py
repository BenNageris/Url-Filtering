from flask import Flask,request
from flask_cors import CORS
import gensim
import logging
import sys
import os
import json as js
app = Flask(__name__)
CORS(app)
model=[]


@app.route('/similarity',methods =['GET'])
def similarity():
	global model
	w1 = request.args.get('word1')	# extracting data from json request
	w2 = request.args.get('word2')	# extracting data from json request
	print('word1:{},word2:{}'.format(w1,w2))
	return calc_similarity(w1,w2)
def calc_similarity(w1,w2):
	ratio=model.similarity(w1, w2)
	print(ratio)
	data = {}
	data['ratio'] = str(ratio)
	json_data = js.dumps(data)
	print(json_data)
	return json_data
@app.route('/most_similarity',methods =['GET'])
def most_similarity():
	global model
	print("most_similarity")
	logger.info('most similarity')
	w1 = request.args.get('word')	# extracting data from json request
	top_n = request.args.get('x')
	print('w1:{}'.format(w1))
	words=w1.split(",")
	ret=[]
	alreadyadded = {}
	print('w1:{},top_n:{}'.format(w1,top_n))
	for word in words:
		sim_words=top_sim(model,word,top_n)
		for word_tmp in sim_words:
			w=word_tmp[0]
			if(not isExist(w,alreadyadded)):
				alreadyadded[w]=w
				ret.append(word_tmp)
			else:
				print("{} is already added to list".format(w))
	for word in words:
		if (not isExist(word, alreadyadded)):
			alreadyadded[word] = word
			ret.append([word,1])
		else:
			print("{} is already added to list".format(w))
	return js.dumps(ret)

def top_sim(model,w1,top_n):
	most_similar = model.most_similar(positive=w1, topn=int(top_n))
	return most_similar

def isExist(key,dict):
	if key in dict:
		return True
	return False

if __name__ == '__main__':
	program = os.path.basename(sys.argv[0])
	logger = logging.getLogger(program)
	logging.basicConfig(format='%(asctime)s: %(levelname)s: %(message)s')
	logging.root.setLevel(level=logging.INFO)
	logger.info("running %s" % ' '.join(sys.argv))
	logger.info('First Time calculation')
	model=gensim.models.Word2Vec.load("wiki.en.text.model")
	model.init_sims(replace=True)	
	print(calc_similarity('woman','man'))
	print(top_sim(model,'gambling',20))
	app.run(host='127.0.0.1')