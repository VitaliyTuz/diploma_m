import numpy as np

def fuzzy_mcdm(criteria, options, weights, evaluations):
    if len(criteria) == 0 or len(options) == 0:
        raise ValueError("Критерії та альтернативи не можуть бути порожніми.")

    if len(criteria) != len(weights):
        raise ValueError("Кількість критеріїв повинна збігатися з кількістю ваг.")

    if len(evaluations) != len(options) or any(len(ev) != len(criteria) for ev in evaluations):
        raise ValueError("Кількість альтернатив або оцінок не відповідає кількості критеріїв.")

    weight_sums = np.sum([w[1] for w in weights])  
    normalized_weights = [
        (w[0] / weight_sums, w[1] / weight_sums, w[2] / weight_sums)
        for w in weights
    ]

    final_scores = []
    for option_evaluations in evaluations:
        score = [0, 0, 0]  # lower, mean, upper
        for i, (crit_evaluation, crit_weight) in enumerate(zip(option_evaluations, normalized_weights)):
            score = [
                score[0] + crit_evaluation[0] * crit_weight[0],
                score[1] + crit_evaluation[1] * crit_weight[1],
                score[2] + crit_evaluation[2] * crit_weight[2],
            ]
        final_scores.append(tuple(score))

    # Дефазифікація (підрахунок скалярного значення кожної альтернативи)
    def defuzzify(fuzzy_score):
        l, m, u = fuzzy_score
        return (l + 4 * m + u) / 6  

    scalar_scores = [defuzzify(score) for score in final_scores]
    best_alternative_index = np.argmax(scalar_scores)
    best_alternative = options[best_alternative_index]

    return {
        "criteria": criteria,
        "weights": weights,
        "alternatives": options,
        "fuzzy_scores": final_scores,
        "scalar_scores": scalar_scores,
        "best_alternative": best_alternative,
    }

