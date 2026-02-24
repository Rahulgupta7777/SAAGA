# This Python 3 environment comes with many helpful analytics libraries installed
# It is defined by the kaggle/python Docker image: https://github.com/kaggle/docker-python
# For example, here's several helpful packages to load

import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

# Input data files are available in the read-only "../input/" directory
# For example, running this (by clicking run or pressing Shift+Enter) will list all files under the input directory

import os
for dirname, _, filenames in os.walk('/kaggle/input'):
    for filename in filenames:
        print(os.path.join(dirname, filename))

# You can write up to 20GB to the current directory (/kaggle/working/) that gets preserved as output when you create a version using "Save & Run All" 
# You can also write temporary files to /kaggle/temp/, but they won't be saved outside of the current session

import pandas as pd
from sklearn.model_selection import train_test_split  # Fill: function to split data
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# Load data
df = pd.read_csv('/kaggle/input/swiggy-restuarant-dataset/swiggy.csv')  # Fill: method to read CSV, filename
df = df.dropna()  # Fill: method to remove missing values
print(f"Samples: {len(df)}")


# Basic stats
print("Delivery Time Stats:")
print(f"   Min: {df['Delivery time'].min()} min")  # Fill: method to get minimum
print(f"   Max: {df['Delivery time'].max()} min")  # Fill: method to get maximum
print(f"   Avg: {df['Delivery time'].mean():.1f} min")  # Fill: method to get average

print(f"\nCities: {df['City'].nunique()}")  # Fill: method to count unique values
print(f"Areas: {df['Area'].nunique()}")
# Top 5 cities by restaurant count
print("Top 5 Cities by Restaurants:")
print(df['City'].value_counts().head())  # Fill: method to count value occurrences


X = df[['Price', 'Avg ratings', 'Total ratings', 'Area', 'City']]
y = df['Delivery time']  # Fill: target column name as string

# One-Hot Encoding using pd.get_dummies
X_encoded = pd.get_dummies(X, columns=['Area', 'City'])  # Fill: encoding function, two categorical columns

print(f"Features after encoding: {X_encoded.shape[1]}")


# Split data
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)  # Fill: split function, test size ratio

print(f"Training samples: {len(X_train)}")
print(f"Testing samples: {len(X_test)}")

# Train Decision Tree
model = DecisionTreeRegressor(max_depth=5, random_state=42)  # Fill: model class, depth value
model.fit(X_train, y_train)  # Fill: method to train the model

# Predict
y_pred = model.predict(X_test)  # Fill: method to make predictions
print("Model trained!")

mae = mean_absolute_error(y_test, y_pred)  # Fill: function to calculate MAE
r2 = r2_score(y_test, y_pred)  # Fill: function to calculate R² score

print(f"MAE: {mae:.2f} min")
print(f"R²:  {r2:.4f}")



# Sample prediction
sample = pd.DataFrame({
    'Price': [400],
    'Avg ratings': [4.2],
    'Total ratings': [100],
    'Area': ['Koramangala'],
    'City': ['Bangalore']
})

# Encode sample and align columns
sample_encoded = pd.get_dummies(sample, columns=['Area', 'City'])
sample_encoded = sample_encoded.reindex(columns=X_encoded.columns, fill_value=0)  # Fill: method to align columns, default fill value

prediction = model.predict(sample_encoded)[0]
print(f"Predicted delivery time: {prediction:.1f} min")


import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import torch
import torch.nn as nn  # Fill: alias for neural network module
import torch.optim as optim  # Fill: alias for optimizer module
from torch.utils.data import DataLoader, TensorDataset  # Fill: two classes for data loading

import warnings
warnings.filterwarnings('ignore')

# Load and prepare data
df = pd.read_csv('/kaggle/input/swiggy-restuarant-dataset/swiggy.csv').dropna()  # Fill: method to remove missing values
print(f"Samples: {len(df)}")

# Select features and encode
X = df[['Price', 'Avg ratings', 'Total ratings', 'Area', 'City']]
y = df['Delivery time']

X_encoded = pd.get_dummies(X, columns=['Area', 'City'])  # Fill: function for one-hot encoding

# Split data
X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)  # Fill: method to fit and transform training data
X_test_scaled = scaler.transform(X_test)  # Fill: method to transform test data (already fitted)

# Convert to PyTorch tensors
X_train_tensor = torch.FloatTensor(X_train_scaled)  # Fill: tensor type for floating point
y_train_tensor = torch.FloatTensor(y_train.values).reshape(-1, 1)  # Fill: method to reshape, dimensions
X_test_tensor = torch.FloatTensor(X_test_scaled)
y_test_tensor = torch.FloatTensor(y_test.values).reshape(-1, 1)

print(f"Train: {X_train_tensor.shape[0]} | Test: {X_test_tensor.shape[0]}")
# Simple Neural Network
class DeliveryTimeNN(nn.Module):
    def __init__(self, input_size):
        super(DeliveryTimeNN, self).__init__()
        self.fc1 = nn.Linear(input_size, 64)  # Fill: layer type for fully connected
        self.fc2 = nn.Linear(64, 32)  # Fill: number of neurons in second hidden layer
        self.fc3 = nn.Linear(32, 1)  # Fill: output size for regression
        self.activation = nn.ReLU()  # Fill: activation function (ReLU or Sigmoid)

    def forward(self, x):
        x = self.activation(self.fc1(x))  # Fill: first layer
        x = self.activation(self.fc2(x))
        x = self.fc3(x)
        return x

# Initialize model
input_size = X_train_tensor.shape[1]
model = DeliveryTimeNN(input_size)  # Fill: model class name
print(model)


#  Loss and optimizer
criterion = nn.MSELoss()  # Fill: loss function for regression (Mean Squared Error)
optimizer = optim.Adam(model.parameters(), lr=0.001)  # Fill: optimizer type

# Create DataLoader
epochs = 100
train_dataset = TensorDataset(X_train_tensor, y_train_tensor)
train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)  # Fill: True or False

# Training loop
for epoch in range(epochs):
    model.train()  # Fill: mode for training
    epoch_loss = 0
    for X_batch, y_batch in train_loader:
        optimizer.zero_grad()  # Fill: method to reset gradients
        outputs = model(X_batch)
        loss = criterion(outputs, y_batch)
        loss.backward()  # Fill: method to compute gradients
        optimizer.step()  # Fill: method to update weights
        epoch_loss += loss.item()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch {epoch+1}/{epochs} - Loss: {epoch_loss/len(train_loader):.4f}")

print("Training complete!")

# Evaluate on test set
model.eval()  # Fill: mode for evaluation
with torch.no_grad():  # Fill: context manager to disable gradients
    y_pred = model(X_test_tensor).numpy()  # Fill: method to convert to numpy

mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("PyTorch Neural Network Results:")
print(f"   MAE: {mae:.2f} min")
print(f"   R2:  {r2:.4f}")