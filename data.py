import pandas as pd
import numpy as np
import random

# Set seed for reproducibility
random.seed(42)
np.random.seed(42)

# Parameters
n_rows = 5000  # Number of synthetic data points to generate

# Stall Names and Shop Types
stall_names = [f"stall_{i}" for i in range(1, 201)]
shop_types = [
    "chicken_rice_stall", "bakery", "fishball_noodle_stall", "western_food_stall",
    "economic_rice_stall", "beverage_stall", "roti_prata_stall", "dim_sum_stall",
    "laksa_stall", "dessert_stall", "fried_hokkien_mee_stall"
]
stall_to_shop_type = {stall: random.choice(shop_types) for stall in stall_names}

# Latitude and Longitude ranges for Singapore
latitude_range = (1.2, 1.5)
longitude_range = (103.6, 104.0)

# Pre-generate fixed latitude and longitude for each stall
stall_to_location = {
    stall: (
        round(random.uniform(*latitude_range), 5),
        round(random.uniform(*longitude_range), 5)
    )
    for stall in stall_names
}

closing_times = [20, 21, 22, 23]  # Normal SG hawker closing times in 24-hour format
days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
weather_conditions = ["sunny", "rainy", "cloudy"]

# Base Servings with Variance
base_servings_mean = {
    "chicken_rice_stall": 20,
    "bakery": 15,
    "fishball_noodle_stall": 20,
    "western_food_stall": 25,
    "economic_rice_stall": 30,
    "beverage_stall": 10,
    "roti_prata_stall": 15,
    "dim_sum_stall": 20,
    "laksa_stall": 20,
    "dessert_stall": 15,
    "fried_hokkien_mee_stall": 20
}
base_servings_std = {key: 5 for key in base_servings_mean}  # Variance for base servings

# Create unique stall DataFrame
unique_stalls = []
for stall_name in stall_names:
    shop_type = stall_to_shop_type[stall_name]
    latitude, longitude = stall_to_location[stall_name]
    closing_time = random.choice(closing_times)
    unique_stalls.append([stall_name, shop_type, latitude, longitude, closing_time])

unique_stalls_df = pd.DataFrame(unique_stalls, columns=[
    "stall_name", "type_of_shop", "latitude", "longitude", "closing_time"
])

# Save unique stalls information to a CSV file
unique_stalls_df.to_csv("unique_stalls.csv", index=False)
print("Unique stalls data saved to 'unique_stalls.csv'")

# Synthetic data generation
data = []
for i in range(n_rows):
    # Assign a random stall and its type
    stall_name = random.choice(stall_names)
    shop_type = stall_to_shop_type[stall_name]
    
    # Static features
    latitude, longitude = stall_to_location[stall_name]
    closing_time = random.choice(closing_times)
    
    # Dynamic features
    day_of_week = random.choice(days_of_week)
    weather = random.choice(weather_conditions)
    holiday_flag = np.random.choice([0, 1], p=[0.9, 0.1])  # 10% chance of holiday
    
    # Improved target (Leftovers in Servings) with variance
    base_serving = max(0, round(np.random.normal(base_servings_mean[shop_type], base_servings_std[shop_type]), 1))
    weather_modifier = -3 if weather == "sunny" else (5 if weather == "rainy" else 0)
    holiday_modifier = 10 if holiday_flag == 1 else 0
    leftovers = max(0, round(base_serving + weather_modifier + holiday_modifier + np.random.normal(0, 2), 1))
    
    # Append to data
    data.append([
        stall_name, shop_type, latitude, longitude, closing_time, day_of_week, weather,
        holiday_flag, leftovers
    ])

# Create DataFrame
columns = [
    "stall_name", "type_of_shop", "latitude", "longitude", "closing_time", "day_of_week", "weather",
    "holiday_flag", "leftovers_servings"
]
df = pd.DataFrame(data, columns=columns)

# Save synthetic data to a separate CSV file
df.to_csv("synthetic_data.csv", index=False)
print("Synthetic data saved to 'synthetic_data.csv'")
