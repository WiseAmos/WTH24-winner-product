from flask import Flask, request, jsonify
import xgboost as xgb
import pandas as pd
import numpy as np
import pickle

# Load the saved encoder
with open("encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Load the trained XGBoost model
model = xgb.Booster()
model.load_model("xgboost_model.json")

# Initialize Flask app
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Extract JSON data sent from the client
    data = request.json
    
    # Extract features
    features = [
        data["latitude"],
        data["longitude"],
        data["closing_time"],
        data["holiday_flag"],
        data["leftovers_yesterday"],
        data["leftovers_2_days_ago"]
    ]
    
    # Add one-hot encoded categorical features (if needed)
    # You'll need to transform these exactly as they were during training
    categorical_features = pd.DataFrame([[data["type_of_shop"], data["day_of_week"], data["weather"]]], 
                                         columns=["type_of_shop", "day_of_week", "weather"])
    # One-hot encode using your saved encoder
    encoded_features = encoder.transform(categorical_features)
    
    # Combine numerical and categorical features
    all_features = np.hstack([features, encoded_features])

    # Prepare features for prediction
    dmatrix = xgb.DMatrix(all_features)
    prediction = model.predict(dmatrix)

    # Return the prediction
    return jsonify({"prediction": prediction[0]})

if __name__ == '__main__':
    app.run(port=5001)  # Run the Flask app on port 5001
