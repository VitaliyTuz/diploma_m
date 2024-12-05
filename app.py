from flask import Flask, render_template, request
import numpy as np
from utils.ahp_algorithm import *
from utils.fuzzy_mcdm_algorithm import *
from utils.wsm_algorithm import *

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route("/ahp_input", methods=["GET", "POST"])
def ahp_input():
    return render_template("ahp_input_form.html")  

@app.route('/calculate', methods=['POST'])
def calculate_ahp():
    criteria = []
    for key in request.form:
        if key.startswith("criteria_"):  
            criteria.append(request.form[key])
    
    options = []
    for key in request.form:
        if key.startswith("option_"):  
            options.append(request.form[key])

    comparisons = {}
    for key in request.form:
        if key.startswith("comparison_"):  
            comparisons[key] = float(request.form[key])

    alternatives = {}
    for key in request.form:
        if key.startswith("alternative_"):  
            alternatives[key] = float(request.form[key])

    try:
        results = ahp(criteria, options, comparisons, alternatives)  
    except Exception as e:
        return f"Помилка: {e}"

    return render_template("results.html", results=results, zip=zip)


@app.route("/fuzzy_input", methods=["GET", "POST"])
def fuzzy_input():
    return render_template("fuzzy_mcdm_input_form.html") 

@app.route('/calculate_fuzzy', methods=['POST'])
def calculate_fuzzy():
    criteria = []
    for key in request.form:
        if key.startswith("fuzzy_criteria_"):
            criteria.append(request.form[key])

    weights = []
    for key in request.form:
        if key.startswith("fuzzy_lower_"):
            criterion_id = key.split("_")[2]  
            lower = float(request.form.get(f"fuzzy_lower_{criterion_id}", 0))
            mean = float(request.form.get(f"fuzzy_mean_{criterion_id}", 0))
            upper = float(request.form.get(f"fuzzy_upper_{criterion_id}", 0))
            weights.append((lower, mean, upper))

    alternatives = []
    fuzzy_scores = []  # Для зберігання оцінок (Lower, Mean, Upper) для кожної альтернативи

    for key in request.form:
        if key.startswith("fuzzy_option_"):
            alternative_name = request.form[key]
            alternatives.append(alternative_name)

            alternative_scores = [] 
            for i in range(len(criteria)):  
                for j in range(len(alternatives)):
                    lower = float(request.form.get(f"fuzzy_evaluation_min_{j}_{i}", 0))
                    mean = float(request.form.get(f"fuzzy_evaluation_avg_{j}_{i}", 0))
                    upper = float(request.form.get(f"fuzzy_evaluation_max_{j}_{i}", 0))
                
                alternative_scores.append((lower, mean, upper))
            
            fuzzy_scores.append(alternative_scores)

    try:
        results = fuzzy_mcdm(criteria, alternatives, weights, fuzzy_scores)
    except Exception as e:
        return f"Помилка: {e}"

    return render_template("fuzzy_mcdm_results.html", results=results, zip=zip)

@app.route("/wsm_input", methods=["GET", "POST"])
def wsm_input():
    return render_template("wsm_input_form.html")  

@app.route('/calculate_wsm', methods=['POST'])
def calculate_wsm():
    criteria = []
    for key in request.form:
        if key.startswith("wsm_criteria_"):
            criteria.append(request.form[key])

    weights = []
    for key in request.form:
        if key.startswith("wsm_weight_"):
            criterion_id = key.split("_")[2]  # Індекс критерію
            weight = float(request.form.get(f"wsm_weight_{criterion_id}", 0))
            weights.append(weight)

    alternatives = []
    scores = [] 

    for key in request.form:
        if key.startswith("wsm_option_"):
            alternative_name = request.form[key]
            alternatives.append(alternative_name)

            alternative_scores = []  
            for i in range(len(criteria)): 
                score = float(request.form.get(f"wsm_evaluation_{len(alternatives)-1}_{i}", 0))
                alternative_scores.append(score)

            scores.append(alternative_scores)

    try:
        results = wsm(criteria, weights, alternatives, scores)
    except Exception as e:
        return f"Помилка: {e}"

    return render_template("wsm_results.html", results=results, zip=zip)


if __name__ == '__main__':
    app.run(debug=True)
