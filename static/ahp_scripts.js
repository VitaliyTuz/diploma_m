let criteriaCount = 0;
let optionsCount = 0;

function addCriterion() {
    const criteriaContainer = document.getElementById('criteria-container');

    const newCriterionDiv = document.createElement('div');
    newCriterionDiv.classList.add('criterion');
    
    const criterionId = `criteria_${criteriaCount}`;
    newCriterionDiv.innerHTML = `
        <label for="${criterionId}">Критерій ${criteriaCount + 1}:</label>
        <input type="text" id="${criterionId}" name="criteria_${criteriaCount}" placeholder="Введіть критерій" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeCriterion(this)">Видалити</button>
    `;

    criteriaContainer.appendChild(newCriterionDiv);

    criteriaCount++;

    updateComparisonFields();
    updateAlternativeFields();
}

function updateComparisonFields() {
    const comparisonContainer = document.getElementById('comparison-container');
    comparisonContainer.innerHTML = '';

    for (let i = 0; i < criteriaCount; i++) {
        for (let j = i + 1; j < criteriaCount; j++) {
            const comparisonDiv = document.createElement('div');
            comparisonDiv.classList.add('comparison');
            comparisonDiv.innerHTML = `
                <label for="compare_${i}_${j}">Порівняти критерій ${i + 1} з критерієм ${j + 1}:</label>
                <input type="number" name="comparison_${i}_${j}" min="1" max="9" placeholder="Вага" required>
            `;
            comparisonContainer.appendChild(comparisonDiv);
        }
    }
}

function removeCriterion(button) {
    const criterionDiv = button.parentElement;
    criterionDiv.remove();

    criteriaCount--;

    updateComparisonFields();
    updateAlternativeFields();
}

function addOption() {
    const optionsContainer = document.getElementById('options-container');

    const newOptionDiv = document.createElement('div');
    newOptionDiv.classList.add('option');
    
    const optionId = `option_${optionsCount}`;
    newOptionDiv.innerHTML = `
        <label for="${optionId}">Варіант ${optionsCount + 1}:</label>
        <input type="text" id="${optionId}" name="option_${optionsCount}" placeholder="Введіть варіант" required>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeOption(this)">Видалити</button>
    `;

    optionsContainer.appendChild(newOptionDiv);
    optionsCount++;
    
    updateAlternativeFields();
}

function updateAlternativeFields() {
    const alternativesContainer = document.getElementById('alternatives-container');
    alternativesContainer.innerHTML = '';

    const n_criteria = criteriaCount;
    const n_options = optionsCount;

    for (let i = 0; i < n_options; i++) {
        const alternativeDiv = document.createElement('div');
        alternativeDiv.classList.add('alternative');
        alternativeDiv.innerHTML = `<h4>Оцінки для варіанту ${i + 1}:</h4>`;
        for (let j = 0; j < n_criteria; j++) {
            const inputId = `alternative_${i}_${j}`;
            alternativeDiv.innerHTML += `
                <label for="${inputId}">Оцінка за критерієм ${j + 1}:</label>
                <input type="number" id="${inputId}" name="alternative_${i}_${j}" min="1" max="9" placeholder="Оцінка" required>
            `;
        }
        alternativesContainer.appendChild(alternativeDiv);
    }
}

function removeOption(button) {
    const optionDiv = button.parentElement;
    optionDiv.remove();

    optionsCount--;

    updateAlternativeFields();
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
            maintainAspectRatio: false,
            scales: {
              
            }
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
            maintainAspectRatio: false,
            scales: {
              
            }
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
                    { text: 'Результати методу AHP', style: 'header' },
                    { text: 'Ваги критеріїв', style: 'subheader' },
                    {
                        table: {
                            body: [
                                ['Критерій', 'Вага'],
                                ...results.criteria.map((criterion, index) => [
                                    criterion,
                                    results.criteria_weights[index].toFixed(3)
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
                                    results.alternative_scores[index].toFixed(3)
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
