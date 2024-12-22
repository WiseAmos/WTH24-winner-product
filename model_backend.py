from flask import Flask, request, jsonify
import xgboost as xgb
import pandas as pd
import numpy as np
import pickle
from datetime import datetime
import holidays

# Load the saved encoder
with open("encoder.pkl", "rb") as f:
    encoder = pickle.load(f)

# Load the trained XGBoost model
model = xgb.Booster()
model.load_model("xgboost_model.json")

# Load store data from unique_stalls.csv
store_data = pd.read_csv("unique_stalls.csv")

# Initialize Flask app
app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    # Extract JSON data sent from the client
    data = request.json

    # Validate input
    if "date" not in data or "weather" not in data:
        return jsonify({"error": "Missing required fields: 'date' and 'weather'"}), 400

    # Extract day of the week from the provided date
    try:
        date = datetime.strptime(data["date"], "%Y-%m-%d")
        day_of_week = date.strftime("%A")  # Get day of the week
        # Determine if the date is a holiday using the holidays package
        sg_holidays = holidays.Singapore()  # Use Singapore holidays
        holiday_flag = 1 if date in sg_holidays else 0
    except Exception as e:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    # Extract weather
    weather = data["weather"]

    # Initialize an empty dictionary to store predictions for all stalls
    predictions = {}

    # Iterate through all stalls in the CSV
    for _, row in store_data.iterrows():
        stall_name = row["stall_name"]
        latitude = row["latitude"]
        longitude = row["longitude"]
        closing_time = row["closing_time"]
        type_of_shop = row["type_of_shop"]

        # Construct numerical features
        numerical_features = {
            "latitude": latitude,
            "longitude": longitude,
            "closing_time": closing_time,
            "holiday_flag": holiday_flag
        }

        # Add one-hot encoded categorical features
        categorical_features = pd.DataFrame([[type_of_shop, day_of_week, weather]],
                                             columns=["type_of_shop", "day_of_week", "weather"])
        # One-hot encode using the saved encoder
        encoded_features = encoder.transform(categorical_features)
        encoded_features_df = pd.DataFrame(encoded_features, columns=encoder.get_feature_names_out(["type_of_shop", "day_of_week", "weather"]))

        # Combine numerical and categorical features into a single DataFrame
        all_features = pd.concat([pd.DataFrame([numerical_features]), encoded_features_df], axis=1)

        # Prepare features for prediction
        dmatrix = xgb.DMatrix(all_features, feature_names=list(all_features.columns))

        prediction = model.predict(dmatrix)

        # Add the prediction to the dictionary
        # Add the prediction to the dictionary
        predictions[stall_name] = float(prediction[0])  # Convert numpy.float32 to Python float


    # Return predictions as a JSON response
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(port=5001)  # Run the Flask app on port 5001
