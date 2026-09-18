"""
Train and Save ML Model
Run this once to create the saved model file
"""

import pandas as pd
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Load data
data = pd.read_csv('crop_data.csv')

# Prepare features and target
X = data.drop('crop', axis=1)
y = data['crop']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
print("Training model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Test accuracy
accuracy = model.score(X_test, y_test)
print(f"Model Accuracy: {accuracy * 100:.2f}%")

# Save model
with open('models/crop_model.pkl', 'wb') as f:
    pickle.dump(model, f)

print("✓ Model saved to models/crop_model.pkl")
print("\nYou can now load this model in app.py instead of training every time!")
