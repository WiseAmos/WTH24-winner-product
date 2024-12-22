# Reading the synthetic dataset from a CSV file and building the XGBoost model
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
import xgboost as xgb
import pickle
import os
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score

# Load the synthetic dataset
df = pd.read_csv("synthetic_data.csv")

# Preprocessing: One-hot encode categorical variables
categorical_features = ["type_of_shop", "day_of_week", "weather"]
encoder = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
encoded_categorical = encoder.fit_transform(df[categorical_features])
encoded_categorical_df = pd.DataFrame(encoded_categorical, columns=encoder.get_feature_names_out(categorical_features))

# Save the encoder to a file
with open("encoder.pkl", "wb") as f:
    pickle.dump(encoder, f)

# Combine numerical and categorical features
numerical_features = ["latitude", "longitude", "closing_time", "holiday_flag"]
X = pd.concat([df[numerical_features], encoded_categorical_df], axis=1)
y = df["leftovers_servings"]

# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train an XGBoost model
xg_reg = xgb.XGBRegressor(objective='reg:squarederror', n_estimators=100, learning_rate=0.1, max_depth=4)
xg_reg.fit(X_train, y_train)

# Make predictions
y_pred = xg_reg.predict(X_test)

# Evaluate the model and calculate metrics
mse = mean_squared_error(y_test, y_pred)  # Mean Squared Error
mae = mean_absolute_error(y_test, y_pred)  # Mean Absolute Error
r2 = r2_score(y_test, y_pred)  # R-squared Score

# Display metrics
print(f"Mean Squared Error (MSE): {mse}")
print(f"Mean Absolute Error (MAE): {mae}")
print(f"R-squared Score: {r2}")

# Save the trained XGBoost model to a file
xg_reg.save_model("xgboost_model.json")

# Verify if the file exists
if os.path.exists("xgboost_model.json"):
    print("Model saved successfully!")
else:
    print("Failed to save the model.")
