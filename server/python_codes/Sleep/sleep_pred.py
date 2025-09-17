import warnings
import sys
import pickle
import pandas as pd
import numpy as np
import os

# Suppress warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

# === Label Map for Sleep Disorder ===
sleep_label_map = {
    0: "None",
    1: "Sleep Apnea",
    2: "Insomnia"
}

# === Prediction Function ===
def predict_sleep(input_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "sleep_model.pkl")  # Ensure this model supports 3 classes

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    columns = [
        "gender", "age", "occupation", "sleep_duration", "quality_of_sleep",
        "physical_activity", "stress_level", "bmi_category", "heart_rate",
        "daily_steps", "systolic_bp", "diastolic_bp"
    ]

    df = pd.DataFrame([input_data], columns=columns)
    pred = model.predict(df)
    pred_value = int(pred[0]) if isinstance(pred, (list, tuple, np.ndarray)) else int(pred)

    return sleep_label_map.get(pred_value, "Unknown")


# === Main Script Entry ===
if __name__ == "__main__":
    if len(sys.argv) != 13:
        print("Usage: python predict_sleep.py [12 input values in order: gender, age, occupation, ..., diastolic_bp]")
        sys.exit(1)

    input_data = list(map(float, sys.argv[1:]))
    print(predict_sleep(input_data))
