import warnings
import sys

# Suppress all sklearn and numpy related warnings
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)
warnings.filterwarnings("ignore", category=FutureWarning)

import pickle
import pandas as pd
import numpy as np
import os

# === Label Map ===
label_map = {
    0: "Extremely Severe",
    1: "Mild",
    2: "Moderate",
    3: "Normal",
    4: "Severe"
}

# === Depression Prediction Function ===-------------------------------------------------------------------
def predict_depression(input_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "dep_model.pkl")

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    columns = [
        "Q3A", "Q5A", "Q10A", "Q13A", "Q16A", "Q17A", "Q21A", "Q24A", "Q26A", "Q31A", "Q34A", "Q37A", "Q38A", "Q42A",
        "Extraverted-enthusiastic", "Critical-quarrelsome", "Dependable-self-disciplined", "Anxious-easily upset",
        "Open to new experiences-complex", "Reserved-quiet", "Sympathetic-warm", "Disorganized-careless",
        "Calm-emotionally stable", "Conventional-uncreative", "education", "urban", "gender",
        "age", "religion", "race", "married", "familysize", "major_cleaned"
    ]
    df = pd.DataFrame([input_data], columns=columns)
    pred = model.predict(df)
    pred_value = int(pred[0]) if isinstance(pred, (list, tuple, np.ndarray)) else int(pred)

    return label_map.get(pred_value, "Unknown")

# === Anxiety Prediction Function ===------------------------------------------------------------------
def predict_anxiety(input_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "anx_model.pkl")

    with open(model_path, "rb") as f:
        model = pickle.load(f)

    
    columns = [
        "Q2A", "Q4A", "Q7A", "Q9A", "Q15A", "Q19A", "Q20A", "Q23A", "Q25A", "Q28A", "Q30A", "Q36A", "Q40A", "Q41A",
        "Extraverted-enthusiastic", "Critical-quarrelsome", "Dependable-self-disciplined", "Anxious-easily upset",
        "Open to new experiences-complex", "Reserved-quiet", "Sympathetic-warm", "Disorganized-careless",
        "Calm-emotionally stable", "Conventional-uncreative", "education", "urban", "gender",
        "age", "religion", "race", "married", "familysize", "major_cleaned"
    ]
    df = pd.DataFrame([input_data], columns=columns)
    pred = model.predict(df)
    pred_value = int(pred[0]) if isinstance(pred, (list, tuple, np.ndarray)) else int(pred)

    return label_map.get(pred_value, "Unknown")

# === Stress Prediction Function ===-----------------------------------------------------------
def predict_stress(input_data):
    script_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(script_dir, "stress_model.pkl")

    with open(model_path, "rb") as f:
        model = pickle.load(f)
    columns = [
        "Q1A", "Q6A", "Q8A", "Q11A", "Q12A", "Q14A", "Q18A", "Q22A", "Q27A", "Q29A", "Q32A", "Q33A", "Q35A", "Q39A",
        "Extraverted-enthusiastic", "Critical-quarrelsome", "Dependable-self-disciplined", "Anxious-easily upset",
        "Open to new experiences-complex", "Reserved-quiet", "Sympathetic-warm", "Disorganized-careless",
        "Calm-emotionally stable", "Conventional-uncreative", "education", "urban", "gender",
        "age", "religion", "race", "married", "familysize", "major_cleaned"
    ]
    df = pd.DataFrame([input_data], columns=columns)
    pred = model.predict(df)
    pred_value = int(pred[0]) if isinstance(pred, (list, tuple, np.ndarray)) else int(pred)
    return label_map.get(pred_value, "Unknown")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python mental_pred.py [depression|anxiety|stress] [input_data]")
        sys.exit(1)

    model_type = sys.argv[1]
    input_data = eval(sys.argv[2])  # or use json.loads(...) for stricter parsing

    if model_type == "depression":
        print(predict_depression(input_data))
    elif model_type == "anxiety":
        print(predict_anxiety(input_data))
    elif model_type == "stress":
        print(predict_stress(input_data))
    else:
        print("Invalid model type.")
        sys.exit(1)
