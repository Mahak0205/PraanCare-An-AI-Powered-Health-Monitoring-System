import joblib
import pandas as pd
import numpy as np
import os
import warnings
import sys
import json

print("cardiac.py started")


# Suppress warnings for cleaner output
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

MODEL_EXPECTED_FEATURE_NAMES = [
    'age',
    'sex',
    'chest pain type',
    'resting bp s',
    'cholesterol',
    'fasting blood sugar',
    'resting ecg',
    'max heart rate',
    'exercise angina',
    'oldpeak',
    'ST slope'
]

lgbm_heart_disease_model = None
scaler_heart_disease = None

def load_assets():
    global lgbm_heart_disease_model, scaler_heart_disease
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, 'lgbm_heart_disease_model.pkl')
    scaler_path = os.path.join(script_dir, 'scaler_heart_disease.pkl')

    print(f"Loading model from: {model_path}")
    print(f"Loading scaler from: {scaler_path}")

    try:
        lgbm_heart_disease_model = joblib.load(model_path)
        print("Model loaded successfully.")
        scaler_heart_disease = joblib.load(scaler_path)
        print("Scaler loaded successfully.")
    except FileNotFoundError as e:
        print(json.dumps({'error': f'Model or scaler file not found: {str(e)}'}))
        lgbm_heart_disease_model = None
        scaler_heart_disease = None
    except Exception as e:
        print(json.dumps({'error': f'Unexpected error while loading assets: {str(e)}'}))
        lgbm_heart_disease_model = None
        scaler_heart_disease = None


load_assets()

def predict_heart_disease(input_data: dict):
    if lgbm_heart_disease_model is None or scaler_heart_disease is None:
        print(json.dumps({'error': 'Model or scaler not loaded.'}))
        return None, None

    try:
        print(f"Raw input data received: {input_data}")

        input_df = pd.DataFrame([input_data], columns=MODEL_EXPECTED_FEATURE_NAMES)
        print(f"DataFrame before scaling:\n{input_df}")

        scaled_input_df = scaler_heart_disease.transform(input_df)
        scaled_input_df = pd.DataFrame(scaled_input_df, columns=MODEL_EXPECTED_FEATURE_NAMES)
        print(f"DataFrame after scaling:\n{scaled_input_df}")

        prediction_proba = lgbm_heart_disease_model.predict_proba(scaled_input_df)[0]
        predicted_class = int(lgbm_heart_disease_model.predict(scaled_input_df)[0])

        print(f"Predicted class: {predicted_class}")
        print(f"Probability of disease: {prediction_proba[1]}")

        return predicted_class, prediction_proba[1]

    except Exception as e:
        print(json.dumps({'error': f'Error during prediction: {str(e)}'}))
        return None, None

def main():
    print("cardiac.py entered main()")
    try:
        if len(sys.argv) > 1:
            arg = sys.argv[1]
            if os.path.isfile(arg):
                print(f"Reading input from file: {arg}")
                with open(arg, 'r') as f:
                    input_json = f.read()
            else:
                print(f"Reading input from direct argument.")
                input_json = arg

            print(f"Raw input string: {input_json}")

            try:
                input_data = json.loads(input_json)
                prediction, probability = predict_heart_disease(input_data)
                if prediction is None or probability is None:
                    print(json.dumps({'error': 'Prediction failed.'}))
                else:
                    print(json.dumps({
                        'prediction': prediction,
                        'probability': probability
                    }))
            except Exception as e:
                print(json.dumps({'error': f'JSON decode or prediction error: {str(e)}'}))
        else:
            print(json.dumps({'error': 'No input data provided'}))
    except Exception as e:
        print(json.dumps({'error': f'Fatal error in main(): {str(e)}'}))

if __name__ == "__main__":
    main()
