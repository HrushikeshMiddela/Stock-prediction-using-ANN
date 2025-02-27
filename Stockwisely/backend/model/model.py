import sys
import json
import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf
from datetime import datetime, timedelta, date
from ann_model import ANN
import os

def download_data(company_name, start_date, end_date):
    return yf.download(company_name, start=start_date, end=end_date)

def prepare_data(stock_data, time_step=100):
    close_prices = stock_data['Close'].values
    X, y = [], []
    for i in range(time_step, len(close_prices)):
        X.append(close_prices[i - time_step:i])
        y.append(close_prices[i])
    return np.array(X), np.array(y)

def normalize_data(data):
    min_val = np.min(data)
    max_val = np.max(data)
    return (data - min_val) / (max_val - min_val), min_val, max_val

def time_step_hidden_adjustment(days):
    if days <= 7:
        return 10, 32
    elif days <= 30:
        return 20, 64
    elif days <= 60:
        return 30, 128
    elif days <= 90:
        return 40, 256
    elif days <= 120:
        return 50, 384
    elif days <= 150:
        return 60, 512
    elif days <= 180:
        return 75, 768
    elif days <= 210:
        return 90, 1024
    else:
        return 120, 2048

def days_between(future_date):
    today = date.today()
    future_date = date(*future_date)
    delta = future_date - today
    return delta.days

def date_to_tuple(date_str):
    return days_between(tuple(map(int, date_str.split('-'))))

# Function to calculate Mean Absolute Percentage Error (MAPE)
def calculate_accuracy(y_true, y_pred):
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100  # Returns accuracy in percentage

def main():
    ticker = sys.argv[1]
    prediction_date = sys.argv[2]
    today = datetime.now()
    yesterday = today - timedelta(days=1)
    yesterdays_date = yesterday.strftime('%Y-%m-%d')
    
    stock_data = download_data(ticker, '2020-01-01', yesterdays_date)
    days = date_to_tuple(prediction_date)
    time_step, hidden_size = time_step_hidden_adjustment(days)
    
    output_size = 1 
    X, y = prepare_data(stock_data, time_step)
    X_normalized, X_min, X_max = normalize_data(X)
    y_normalized, y_min, y_max = normalize_data(y)
    X_normalized = X_normalized.reshape(X_normalized.shape[0], X_normalized.shape[1])
    input_size = X_normalized.shape[1]  
    ann = ANN(input_size, hidden_size, output_size)
    
    epochs = 1000
    for epoch in range(epochs):
        ann.forward(X_normalized)
        ann.backward(X_normalized, y_normalized)
        if epoch % 100 == 0:
            loss = np.mean(np.square(y_normalized - ann.output))  
            sys.stderr.write(f'Epoch {epoch}, Loss: {loss:.4f}\n')

    prediction_data = stock_data['Close'][-time_step:].values
    prediction_data = prediction_data.reshape(1, -1)  
    prediction_data_normalized = (prediction_data - X_min) / (X_max - X_min)
    predicted_price_normalized = ann.forward(prediction_data_normalized)
    predicted_price = predicted_price_normalized * (y_max - y_min) + y_min
    
    actual_prices = stock_data['Close'].values
    predicted_prices = ann.forward(X_normalized) * (y_max - y_min) + y_min  

    # Calculate Accuracy (MAPE)
    accuracy = calculate_accuracy(actual_prices[time_step:], predicted_prices)
    
    # Plotting the Graph
    plt.figure(figsize=(10, 6))
    plt.plot(actual_prices[time_step:], label='Actual Price', color='blue')
    plt.plot(predicted_prices, label='Predicted Price', color='red')
    plt.title(f'{ticker} Stock Analysis')
    plt.xlabel('Days')
    plt.ylabel('Price')
    graph_dir = "graphs"
    if not os.path.exists(graph_dir):
        os.makedirs(graph_dir)
    graph_path = f"{graph_dir}/{ticker}_prediction.png"
    plt.savefig(graph_path)
    
    predicted_value = round(float(predicted_price[0][0]), 2)
    response = {
        "predicted_price": predicted_value,
        "graph_path": graph_path,
        "accuracy": round(accuracy, 2)  # Send accuracy as part of response
    }
    print(json.dumps(response))

if __name__ == "__main__":
    main()
