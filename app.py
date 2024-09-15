from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Retrieve the API key from an environment variable
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

@app.route('/get_product_info', methods=['GET'])
def get_product_info():
    product_id = request.args.get('product_id')

    if not product_id:
        return jsonify({'error': 'Product ID is required'}), 400

    google_api_url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={GOOGLE_API_KEY}'

    try:
        response = requests.post(google_api_url, json={
            'product_id': product_id
        })
        response.raise_for_status()
        data = response.json()

        if 'name' not in data or 'price' not in data:
            raise ValueError('Product data is missing required fields')

        health_score = calculate_health_score(data)
        price = calculate_price(data)

        return jsonify({
            'product_name': data['name'],
            'health_score': health_score,
            'price': price
        })
    except requests.RequestException as e:
        return jsonify({'error': f'Request error: {str(e)}'}), 500
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500

def calculate_health_score(data):
    # Example implementation; replace with actual logic
    return 80

def calculate_price(data):
    # Example implementation; replace with actual logic
    return data.get('price', 20.00)

if __name__ == '__main__':
    app.run(debug=True)
