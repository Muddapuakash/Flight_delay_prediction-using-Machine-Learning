from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import warnings

app = Flask(__name__)
CORS(app)  # Enable CORS

# Load the trained model
try:
    model = joblib.load("model.pkl")
except AttributeError as e:
    if "'XGBModel' object has no attribute 'gpu_id'" in str(e):
        import pickle
        with open("model.pkl", 'rb') as f:
            model = pickle.load(f)
    else:
        raise

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features from the JSON request
        DayOfWeek = data.get('DayOfWeek', 1)
        DepHour = data.get('DepHour', 12)
        Distance = data.get('Distance')
        TaxiOut = data.get('TaxiOut')
        UniqueCarrier = data.get('UniqueCarrier', 'AA')
        Origin = data.get('Origin', 'JFK')
        Dest = data.get('Dest', 'LAX')
        TaxiIn = data.get('TaxiIn', 10)
        CRSElapsedTime = data.get('CRSElapsedTime', Distance / 8 if Distance else 0)
        
        # Create a DataFrame with the input data
        input_data = pd.DataFrame({
            'DayOfWeek': [DayOfWeek],
            'DepHour': [DepHour],
            'Distance': [Distance],
            'TaxiOut': [TaxiOut],
            'UniqueCarrier': [UniqueCarrier],
            'Origin': [Origin],
            'Dest': [Dest],
            'TaxiIn': [TaxiIn],
            'CRSElapsedTime': [CRSElapsedTime]
        })
        
        # Suppress warnings during prediction
        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            # Make a prediction using the loaded model
            raw_prediction = model.predict(input_data)[0]
            
            # If your model returns a probability between 0 and 1
            probability = raw_prediction * 100
            
            # Create a more detailed prediction
            if probability < 20:
                status = "ON_TIME"
                message = "Flight is likely to arrive on time"
                delay_minutes = 0
            elif probability < 50:
                status = "MINOR_DELAY"
                delay_minutes = int(probability / 5)  # Rough estimate, adjust based on your data
                message = f"Flight might be delayed by approximately {delay_minutes} minutes"
            elif probability < 80:
                status = "SIGNIFICANT_DELAY"
                delay_minutes = int(probability / 2)  # Rough estimate, adjust based on your data
                message = f"Flight will likely be delayed by {delay_minutes} minutes"
            else:
                status = "CANCELLED"
                delay_minutes = None
                message = "High risk of cancellation or significant operational issues"
        
        return jsonify({
            'probability_of_delay': probability,
            'status': status,
            'message': message,
            'delay_minutes': delay_minutes,
            'flight_info': {
                'carrier': UniqueCarrier,
                'origin': Origin,
                'destination': Dest,
                'scheduled_duration': CRSElapsedTime
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)