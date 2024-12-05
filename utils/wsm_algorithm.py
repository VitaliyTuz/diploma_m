import numpy as np

def wsm(criteria, weights, options, evaluations):

    if len(criteria) == 0 or len(options) == 0:
        raise ValueError("Критерії та альтернативи не можуть бути порожніми.")

    if len(criteria) != len(weights):
        raise ValueError("Кількість критеріїв повинна збігатися з кількістю ваг.")

    if len(evaluations) != len(options) or any(len(ev) != len(criteria) for ev in evaluations):
        raise ValueError("Кількість альтернатив або оцінок не відповідає кількості критеріїв.")

    weight_sum = sum(weights)
    normalized_weights = [w / weight_sum for w in weights]

    final_scores = []
    for option_evaluations in evaluations:
        score = 0
        for i, (crit_evaluation, crit_weight) in enumerate(zip(option_evaluations, normalized_weights)):
            score += crit_evaluation * crit_weight
        final_scores.append(score)

    best_alternative_index = np.argmax(final_scores)
    best_alternative = options[best_alternative_index]

    return {
        "criteria": criteria,
        "weights": weights,
        "alternatives": options,
        "final_scores": final_scores,
        "best_alternative": best_alternative,
    }
