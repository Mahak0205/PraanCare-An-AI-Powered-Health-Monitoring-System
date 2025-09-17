# dry-eye-app/server/python_codes/eye/eye.py

import sys
import json
import os
import pandas as pd
import numpy as np
import joblib
import pickle
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import LabelEncoder, StandardScaler

EXPECTED_BASE_FEATURES_ORDER = [
    'Age', 'Sleep_duration', 'Sleep_quality', 'Stress_level', 'Heart_rate', 'Daily_steps',
    'Physical_activity', 'Height', 'Weight', 'Average_screen_time',
    'Systolic_BP', 'Diastolic_BP',
    'Gender',
    'Sleep_disorder', 'Wake_up_during_night', 'Feel_sleepy_during_day',
    'Caffeine_consumption', 'Alcohol_consumption', 'Smoking', 'Medical_issue',
    'Ongoing_medication', 'Smart_device_before_bed',
    'Blue-light_filter',
    'Discomfort_Eye-strain',
    'Redness_in_eye',
    'Itchiness/Irritation_in_eye'
]

MODELS_DIR = os.path.join(os.path.dirname(__file__), 'trained_models')

def load_all_assets():
    assets = {}
    try:
        threshold_path = os.path.join(MODELS_DIR, "best_threshold.txt")
        assets['best_threshold'] = np.loadtxt(threshold_path).item()

        scaler_num_pkl_path = os.path.join(MODELS_DIR, "numerical_scaler.pkl")
        scaler_num_joblib_path = os.path.join(MODELS_DIR, "numerical_scaler.joblib")
        if os.path.exists(scaler_num_pkl_path):
            with open(scaler_num_pkl_path, 'rb') as f:
                assets['numerical_scaler'] = pickle.load(f)
        else:
            assets['numerical_scaler'] = joblib.load(scaler_num_joblib_path)

        stacked_scaler_pkl_path = os.path.join(MODELS_DIR, "stacked_features_scaler.pkl")
        stacked_scaler_joblib_path = os.path.join(MODELS_DIR, "stacked_features_scaler.joblib")
        if os.path.exists(stacked_scaler_pkl_path):
            with open(stacked_scaler_pkl_path, 'rb') as f:
                assets['stacked_features_scaler'] = pickle.load(f)
        else:
            assets['stacked_features_scaler'] = joblib.load(stacked_scaler_joblib_path)

        label_encoders_path = os.path.join(MODELS_DIR, "label_encoders.joblib")
        assets['label_encoders'] = joblib.load(label_encoders_path)

        assets['base_models'] = {}
        model_names = ['xgb', 'lgbm', 'catboost', 'gbm', 'hist']
        for name in model_names:
            model_path = os.path.join(MODELS_DIR, f"{name}_model.joblib")
            assets['base_models'][name] = joblib.load(model_path)

        nn_model_path = os.path.join(MODELS_DIR, "dry_eye_nn_model.keras")
        assets['nn_model'] = keras.models.load_model(nn_model_path)

        return assets
    except Exception as e:
        print(f"ERROR: Failed to load one or more assets: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)

def preprocess_input_for_prediction(raw_data_dict, assets):
    label_encoders = assets['label_encoders']
    numerical_scaler = assets['numerical_scaler']
    base_models = assets['base_models']
    stacked_features_scaler = assets['stacked_features_scaler']

    input_df = pd.DataFrame([raw_data_dict])
    input_df.rename(columns={
        'Blue_light_filter': 'Blue-light_filter',
        'Discomfort_Eye_strain': 'Discomfort_Eye-strain',
        'Itchiness_Irritation_in_eye': 'Itchiness/Irritation_in_eye'
    }, inplace=True)

    categorical_string_cols = [
        'Sleep_disorder', 'Wake_up_during_night', 'Feel_sleepy_during_day',
        'Caffeine_consumption', 'Alcohol_consumption', 'Smoking', 'Medical_issue',
        'Ongoing_medication', 'Smart_device_before_bed',
        'Blue-light_filter', 'Discomfort_Eye-strain', 'Redness_in_eye', 'Itchiness/Irritation_in_eye'
    ]
    for col in categorical_string_cols:
        if col in input_df.columns:
            value = str(input_df[col].iloc[0]).strip().lower()
            if value == 'yes':
                input_df[col] = 1
            elif value == 'no':
                input_df[col] = 0
            else:
                input_df[col] = 0
        else:
            input_df[col] = 0

    if 'Gender' in input_df.columns:
        value = str(input_df['Gender'].iloc[0]).strip().lower()
        if value == 'male':
            input_df['Gender'] = 1
        elif value == 'female':
            input_df['Gender'] = 0
        else:
            input_df['Gender'] = 0
    else:
        input_df['Gender'] = 0

    numerical_features = [col for col in [
        'Age', 'Sleep_duration', 'Sleep_quality', 'Stress_level', 'Heart_rate', 'Daily_steps',
        'Physical_activity', 'Height', 'Weight', 'Average_screen_time',
        'Systolic_BP', 'Diastolic_BP'
    ] if col in input_df.columns]
    for col in numerical_features:
        input_df[col] = pd.to_numeric(input_df[col], errors='coerce')
        input_df[col] = input_df[col].fillna(input_df[col].median() if not input_df[col].isnull().all() else 0.0)

    final_base_features_df = input_df.reindex(columns=EXPECTED_BASE_FEATURES_ORDER, fill_value=0.0)
    try:
        scaled_numerical_data = numerical_scaler.transform(final_base_features_df[numerical_features])
        final_base_features_df[numerical_features] = scaled_numerical_data
    except Exception as e:
        print(f"ERROR: Failed to apply numerical_scaler.transform: {e}", file=sys.stderr)
        final_base_features_df[numerical_features] = final_base_features_df[numerical_features]

    X_base = final_base_features_df.values
    oof_features_pred = []
    for name in ['xgb', 'lgbm', 'catboost', 'gbm', 'hist']:
        model = base_models[name]
        try:
            proba = model.predict_proba(X_base)[:, 1]
            oof_features_pred.append(proba)
        except Exception as e:
            oof_features_pred.append(np.array([0.5]))
    oof_features_pred = np.column_stack(oof_features_pred)
    X_stack_final = np.hstack((X_base, oof_features_pred))
    try:
        X_stack_scaled = stacked_features_scaler.transform(X_stack_final)
    except Exception as e:
        X_stack_scaled = X_stack_final
    return X_stack_scaled

if __name__ == "__main__":
    assets = load_all_assets()
    nn_model = assets['nn_model']
    best_threshold = assets['best_threshold']
    try:
        raw_input_data_json = sys.stdin.read()
        raw_health_data = json.loads(raw_input_data_json)

        # send debug info to stderr
        print(raw_input_data_json, file=sys.stderr)

        try:
            processed_input_for_nn = preprocess_input_for_prediction(raw_health_data, assets)

            # send debug info to stderr
            print("Preprocessed data is: ", processed_input_for_nn, file=sys.stderr)

        except Exception as e:
            sys.exit(1)

        y_proba = nn_model.predict(processed_input_for_nn, verbose=0).flatten()[0]
        prediction = 1 if y_proba >= best_threshold else 0
        output_result = {
            'prediction': int(prediction),
            'probability': float(y_proba)
        }

        # ✅ THIS IS THE ONLY STDOUT
        print(json.dumps(output_result))

    except json.JSONDecodeError as e:
        sys.exit(1)
    except Exception as e:
        import traceback
        traceback.print_exc(file=sys.stderr)
        sys.exit(1)
