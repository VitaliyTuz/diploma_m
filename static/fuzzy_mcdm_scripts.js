let fuzzyCriteriaCount = 0; 
let fuzzyOptionsCount = 0; 

function addFuzzyCriterion() {
    const criteriaContainer = document.getElementById('criteria-container');

    const newCriterionDiv = document.createElement('div');
    newCriterionDiv.classList.add('criterion', 'mb-3');

    const criterionId = `fuzzy_criteria_${fuzzyCriteriaCount}`;
    newCriterionDiv.innerHTML = `
        <div class="mb-2">
            <label for="${criterionId}">Критерій ${fuzzyCriteriaCount + 1}:</label>
            <input type="text" id="${criterionId}" name="fuzzy_criteria_${fuzzyCriteriaCount}" class="form-control" placeholder="Введіть назву критерію" required>
        </div>
        <div class="fuzzy-weights mb-2">
            <label>Введіть ваги критерію у вигляді трикутних чисел:</label>
            <div class="input-group mb-1">
                <span class="input-group-text">Нижня межа (lower)</span>
                <input type="number" name="fuzzy_lower_${fuzzyCriteriaCount}" step="0.01" min="0" class="form-control" placeholder="0.0" required>
            </div>
            <div class="input-group mb-1">
                <span class="input-group-text">Середнє значення (mean)</span>
                <input type="number" name="fuzzy_mean_${fuzzyCriteriaCount}" step="0.01" min="0" class="form-control" placeholder="0.0" required>
            </div>
            <div class="input-group">
                <span class="input-group-text">Верхня межа (upper)</span>
                <input type="number" name="fuzzy_upper_${fuzzyCriteriaCount}" step="0.01" min="0" class="form-control" placeholder="0.0" required>
            </div>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeFuzzyCriterion(this)">Видалити</button>
    `;

    criteriaContainer.appendChild(newCriterionDiv);

    fuzzyCriteriaCount++;

    updateFuzzyAlternativeFields();
}

function removeFuzzyCriterion(button) {
    const criterionDiv = button.parentElement;
    criterionDiv.remove();

    fuzzyCriteriaCount--;

    updateFuzzyAlternativeFields();
}

function addFuzzyOption() {
    const optionsContainer = document.getElementById('options-container');

    const newOptionDiv = document.createElement('div');
    newOptionDiv.classList.add('option');

    const optionId = `fuzzy_option_${fuzzyOptionsCount}`;
    newOptionDiv.innerHTML = `
        <label for="${optionId}">Альтернатива ${fuzzyOptionsCount + 1}:</label>
        <input type="text" id="${optionId}" name="fuzzy_option_${fuzzyOptionsCount}" placeholder="Введіть назву альтернативи" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeFuzzyOption(this)">Видалити</button>
    `;

    optionsContainer.appendChild(newOptionDiv);

    fuzzyOptionsCount++;

    updateFuzzyAlternativeFields();
}

function removeFuzzyOption(button) {
    const optionDiv = button.parentElement;
    optionDiv.remove();

    fuzzyOptionsCount--;

    updateFuzzyAlternativeFields();
}

function updateFuzzyAlternativeFields() {
    const evaluationsContainer = document.getElementById('evaluations-container');
    evaluationsContainer.innerHTML = '';

    for (let i = 0; i < fuzzyOptionsCount; i++) {
        const alternativeDiv = document.createElement('div');
        alternativeDiv.classList.add('alternative');
        alternativeDiv.innerHTML = `<h4>Оцінки для альтернативи ${i + 1}:</h4>`;

        for (let j = 0; j < fuzzyCriteriaCount; j++) {
            const minInputId = `fuzzy_evaluation_min_${i}_${j}`;
            const avgInputId = `fuzzy_evaluation_avg_${i}_${j}`;
            const maxInputId = `fuzzy_evaluation_max_${i}_${j}`;
            
            alternativeDiv.innerHTML += `
                <div>
                    <label for="${minInputId}">Мінімум за критерієм ${j + 1}:</label>
                    <input type="number" id="${minInputId}" name="fuzzy_evaluation_min_${i}_${j}" min="0" max="10" step="0.1" placeholder="Мінімум" required>
                </div>
                <div>
                    <label for="${avgInputId}">Середнє за критерієм ${j + 1}:</label>
                    <input type="number" id="${avgInputId}" name="fuzzy_evaluation_avg_${i}_${j}" min="0" max="10" step="0.1" placeholder="Середнє" required>
                </div>
                <div>
                    <label for="${maxInputId}">Максимум за критерієм ${j + 1}:</label>
                    <input type="number" id="${maxInputId}" name="fuzzy_evaluation_max_${i}_${j}" min="0" max="10" step="0.1" placeholder="Максимум" required>
                </div>
            `;
        }

        evaluationsContainer.appendChild(alternativeDiv);
    }
}

function drawCriteriaChart(criteriaLabels, criteriaWeights) {
    const criteriaLower = criteriaWeights.map(weight => weight[0]);
    const criteriaMean = criteriaWeights.map(weight => weight[1]);
    const criteriaUpper = criteriaWeights.map(weight => weight[2]);

    console.log(criteriaWeights)


    const ctx = document.getElementById('criteriaChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: criteriaLabels,
            datasets: [
                {
                    label: 'Lower',
                    data: criteriaLower,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Mean',
                    data: criteriaMean,
                    backgroundColor: 'rgba(255, 205, 86, 0.2)',
                    borderColor: 'rgba(255, 205, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Upper',
                    data: criteriaUpper,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


function drawAlternativesChart(alternativesLabels, alternativesScores) {
    const ctx = document.getElementById('alternativesChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: alternativesLabels,
            datasets: [
                {
                    label: 'Оцінки альтернатив',
                    data: alternativesScores,
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(255, 205, 86, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(153, 102, 255, 1)',
                    ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
          
            }
        }
    });
}



function generatePDF(results) {
    html2canvas(document.getElementById('criteriaChart')).then(function(canvas) {
        const criteriaChartImage = canvas.toDataURL(); 

        html2canvas(document.getElementById('alternativesChart')).then(function(canvas) {
            const alternativesChartImage = canvas.toDataURL(); 

            const docDefinition = {
                content: [
                    { text: 'Результати методу Fuzzy MCDM', style: 'header' },

                    { text: 'Ваги критеріїв', style: 'subheader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto'],
                            body: [
                                ['Критерій', 'Lower', 'Mean', 'Upper'],
                                ...results.criteria.map((criterion, index) => [
                                    criterion,
                                    results.weights[index][0].toFixed(3),
                                    results.weights[index][1].toFixed(3),
                                    results.weights[index][2].toFixed(3)
                                ])
                            ]
                        }
                    },

                    { text: 'Оцінки альтернатив', style: 'subheader' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['*', 'auto', 'auto', 'auto', 'auto'],
                            body: [
                                ['Альтернатива', 'Lower', 'Mean', 'Upper', 'Defuzzified'],
                                ...results.alternatives.map((alternative, index) => [
                                    alternative,
                                    results.fuzzy_scores[index][0].toFixed(3),
                                    results.fuzzy_scores[index][1].toFixed(3),
                                    results.fuzzy_scores[index][2].toFixed(3),
                                    results.scalar_scores[index].toFixed(3)
                                ])
                            ]
                        }
                    },

                    { text: `Найкраща альтернатива: ${results.best_alternative}`, style: 'highlight' },

                    { text: 'Розподіл ваг критеріїв', style: 'subheader' },
                    {
                        image: criteriaChartImage,
                        width: 500
                    },

                    { text: 'Оцінки альтернатив', style: 'subheader' },
                    {
                        image: alternativesChartImage,
                        width: 500
                    }
                ],
                styles: {
                    header: { fontSize: 18, bold: true, alignment: 'center' },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
                    highlight: { fontSize: 12, italics: true, margin: [0, 10, 0, 10] }
                }
            };

            pdfMake.createPdf(docDefinition).download('fuzzy_mcdm_results.pdf');
        });
    });
}

