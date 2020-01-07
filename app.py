from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS, cross_origin
import os


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
@app.context_processor
def override_url_for():
    return dict(url_for=dated_url_for)

def dated_url_for(endpoint, **values):
    if endpoint == 'static':
        filename = values.get('filename', None)
        if filename:
            file_path = os.path.join(app.root_path, endpoint, filename)
            values['q'] = int(os.stat(file_path).st_mtime)
    return url_for(endpoint, **values)


@app.route("/")
@cross_origin()
def hello():
    return render_template('index.html')

if __name__ == "__main__":
    # app.run(host="localhost",port=5005, ssl_context=('/etc/letsencrypt/live/gais.ccu.edu.tw/fullchain.pem','/etc/letsencrypt/live/gais.ccu.edu.tw/privkey.pem'))
    app.run(host="localhost",port=5005)
