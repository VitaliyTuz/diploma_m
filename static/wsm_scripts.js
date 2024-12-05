let wsmCriteriaCount = 0;
let wsmOptionsCount = 0;

function addWSMCriterion() {
    const criteriaContainer = document.getElementById('criteria-container');

    const newCriterionDiv = document.createElement('div');
    newCriterionDiv.classList.add('criterion', 'mb-3');

    const criterionId = `wsm_criteria_${wsmCriteriaCount}`;
    newCriterionDiv.innerHTML = `
        <div class="mb-2">
            <label for="${criterionId}">Критерій ${wsmCriteriaCount + 1}:</label>
            <input type="text" id="${criterionId}" name="wsm_criteria_${wsmCriteriaCount}" class="form-control" placeholder="Введіть назву критерію" required>
        </div>
        <div class="mb-2">
            <label for="wsm_weight_${wsmCriteriaCount}">Вага критерію ${wsmCriteriaCount + 1}:</label>
            <input type="number" id="wsm_weight_${wsmCriteriaCount}" name="wsm_weight_${wsmCriteriaCount}" class="form-control" step="0.01" min="0" placeholder="Вага" required>
        </div>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeWSMCriterion(this)">Видалити</button>
    `;

    criteriaContainer.appendChild(newCriterionDiv);

    wsmCriteriaCount++;

    updateWSMAlternativeFields();
}

function removeWSMCriterion(button) {
    const criterionDiv = button.parentElement;
    criterionDiv.remove();

    wsmCriteriaCount--;

    updateWSMAlternativeFields();
}

function addWSMOption() {
    const optionsContainer = document.getElementById('options-container');

    const newOptionDiv = document.createElement('div');
    newOptionDiv.classList.add('option');

    const optionId = `wsm_option_${wsmOptionsCount}`;
    newOptionDiv.innerHTML = `
        <label for="${optionId}">Альтернатива ${wsmOptionsCount + 1}:</label>
        <input type="text" id="${optionId}" name="wsm_option_${wsmOptionsCount}" placeholder="Введіть назву альтернативи" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeWSMOption(this)">Видалити</button>
    `;

    optionsContainer.appendChild(newOptionDiv);

    wsmOptionsCount++;

    updateWSMAlternativeFields();
}

function removeWSMOption(button) {
    const optionDiv = button.parentElement;
    optionDiv.remove();

    wsmOptionsCount--;

    updateWSMAlternativeFields();
}

function updateWSMAlternativeFields() {
    const evaluationsContainer = document.getElementById('evaluations-container');
    evaluationsContainer.innerHTML = '';

    for (let i = 0; i < wsmOptionsCount; i++) {
        const alternativeDiv = document.createElement('div');
        alternativeDiv.classList.add('alternative');
        alternativeDiv.innerHTML = `<h4>Оцінки для альтернативи ${i + 1}:</h4>`;

        for (let j = 0; j < wsmCriteriaCount; j++) {
            const evaluationInputId = `wsm_evaluation_${i}_${j}`;
            
            alternativeDiv.innerHTML += `
                <div>
                    <label for="${evaluationInputId}">Оцінка альтернативи ${i + 1} за критерієм ${j + 1}:</label>
                    <input type="number" id="${evaluationInputId}" name="wsm_evaluation_${i}_${j}" min="0" max="10" step="0.1" placeholder="Оцінка" required>
                </div>
            `;
        }

        evaluationsContainer.appendChild(alternativeDiv);
    }
}

function drawCriteriaChart(criteriaLabels, criteriaWeights) {
    const ctx = document.getElementById('criteriaChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie', 
        data: {
            labels: criteriaLabels,
            datasets: [{
                label: 'Ваги критеріїв',
                data: criteriaWeights,
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
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function drawAlternativesChart(alternatives, scores) {
    const ctx = document.getElementById('alternativesChart').getContext('2d');

    new Chart(ctx, {
        type: 'pie', 
        data: {
            labels: alternatives,
            datasets: [{
                label: 'Оцінки альтернатив',
                data: scores,
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
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function generatePDF(results) {
    html2canvas(document.getElementById('criteriaChart')).then(function(canvas) {
        const chart1Image = canvas.toDataURL(); 

        html2canvas(document.getElementById('alternativesChart')).then(function(canvas) {
            const chart2Image = canvas.toDataURL(); 

            const docDefinition = {
                content: [
                    { text: 'Результати методу WSM', style: 'header' },
                    { text: 'Ваги критеріїв', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Критерій', 'Вага'],
                                ...results.criteria.map((criterion, index) => [
                                    criterion,
                                    results.weights[index].toFixed(3)
                                ])
                            ]
                        }
                    },
                    { text: 'Оцінки альтернатив', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Альтернатива', 'Оцінка'],
                                ...results.alternatives.map((option, index) => [
                                    option,
                                    results.final_scores[index].toFixed(3)
                                ])
                            ]
                        }
                    },
                    { text: `Найкраща альтернатива: ${results.best_alternative}`, style: 'subheader' },
                    { text: 'Розподіл ваг критеріїв', style: 'subheader' },
                    {
                        image: chart1Image, 
                        width: 500
                    },
                    { text: 'Альтернативи', style: 'subheader' },
                    {
                        image: chart2Image, 
                        width: 500
                    }
                ],
                styles: {
                    header: { fontSize: 18, bold: true, alignment: 'center' },
                    subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] }
                }
            };

            pdfMake.createPdf(docDefinition).download('results.pdf');
        });
    });
}
