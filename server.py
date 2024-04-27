from flask import Flask, request, jsonify, render_template
import numpy as np
import joblib
import json

app = Flask(__name__)

__data_columns = None
__locations = None
__model = None

print('loading saved artifacts')

with open('columns.json', 'r') as f:
    __data_columns = json.load(f)['data_columns']
    __locations = __data_columns[3:]

__model = joblib.load('lagos_home_price_model')

print('loading saved artifacts....done')


def get_locations():
    return __locations


def get_estimated_price(location, bedrooms, bathrooms, toilets):
    data = np.zeros(len(__data_columns))
    try:
        loc_index = __data_columns.index((location.lower()))
    except:
        loc_index = -1
    data[0] = bedrooms
    data[1] = bathrooms
    data[2] = toilets
    if loc_index >= 0:
        data[loc_index] = 1

    return round(__model.predict([data])[0], 2)


@app.route('/')
def home():
    return render_template('app.html')


@app.route('/locations', methods=['GET'])
def locations():
    response = jsonify({
        'locations': get_locations()
    })
    return response


@app.route('/predict_home_price', methods=['GET', 'POST'])
def predict_home_price():
    data = request.get_json()
    location = data['location']
    bedrooms = data['bedrooms']
    bathrooms = data['bathrooms']
    toilets = data['bathrooms']

    response = jsonify({
        'estimated_price':  get_estimated_price(location, bedrooms, bathrooms, toilets)
    })

    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


# if __name__ == '__main__':
#     print('Starting python flask server')
#     app.run(debug=True)