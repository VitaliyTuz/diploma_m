import numpy as np

def ahp(criteria, options, comparisons, alternatives):
    n_criteria = len(criteria)
    if n_criteria == 0 or len(options) == 0:
        raise ValueError("Критерії та альтернативи не можуть бути порожніми.")

    comparison_matrix = np.ones((n_criteria, n_criteria))

    for key, value in comparisons.items():
        i, j = map(int, key.split('_')[1:])
        comparison_matrix[i, j] = value
        comparison_matrix[j, i] = 1 / value

    eigvals, eigvecs = np.linalg.eig(comparison_matrix)
    max_index = np.argmax(eigvals.real)  
    criteria_weights = eigvecs[:, max_index].real
    criteria_weights /= np.sum(criteria_weights)  # Нормалізація ваг

    alternative_matrix = np.ones((len(options), n_criteria))

    for key, value in alternatives.items():
        i, j = map(int, key.split('_')[1:])
        alternative_matrix[i, j] = value
        
    print(alternative_matrix)
    final_scores = alternative_matrix.dot(criteria_weights)

    # Пошук найкращої альтернативи
    best_alternative_index = np.argmax(final_scores)
    best_alternative = options[best_alternative_index]

    return {
        "criteria": criteria,
        "criteria_weights": criteria_weights.tolist(),
        "alternatives": options,
        "alternative_scores": final_scores.tolist(),
        "best_alternative": best_alternative,
    }
