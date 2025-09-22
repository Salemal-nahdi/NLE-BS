// Negative Gearing Calculator JavaScript
class NegativeGearingCalculator {
    constructor() {
        this.initializeInputs();
        this.setupEventListeners();
        this.calculate(); // Initial calculation
    }

    initializeInputs() {
        // Set default values
        const defaults = {
            buildingCost: 450000,
            weeklyRent: 650,
            loanAmount: 500000,
            interestRate: 6.5,
            managementFees: 8,
            councilRates: 2500,
            waterRates: 800,
            insurance: 1200,
            maintenance: 3000,
            otherExpenses: 0,
            annualIncome: 120000,
            projectionYears: 5,
            rentIncrease: 3
        };

        // Set default values for inputs
        Object.keys(defaults).forEach(key => {
            const input = document.getElementById(key);
            if (input && !input.value) {
                input.value = defaults[key];
            }
        });
    }

    setupEventListeners() {
        // Get all input elements
        const inputs = [
            'buildingCost', 'weeklyRent', 'loanAmount', 'interestRate',
            'managementFees', 'councilRates', 'waterRates', 'insurance', 'maintenance',
            'otherExpenses', 'incomeYear', 'annualIncome', 'helpDebt', 'projectionYears', 'rentIncrease'
        ];

        // Add event listeners to all inputs
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('input', () => this.calculate());
                input.addEventListener('change', () => this.calculate());
            }
        });
    }

    getInputValues() {
        return {
            buildingCost: parseFloat(document.getElementById('buildingCost').value) || 0,
            weeklyRent: parseFloat(document.getElementById('weeklyRent').value) || 0,
            loanAmount: parseFloat(document.getElementById('loanAmount').value) || 0,
            interestRate: parseFloat(document.getElementById('interestRate').value) || 0,
            managementFees: parseFloat(document.getElementById('managementFees').value) || 0,
            councilRates: parseFloat(document.getElementById('councilRates').value) || 0,
            waterRates: parseFloat(document.getElementById('waterRates').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
            otherExpenses: parseFloat(document.getElementById('otherExpenses').value) || 0,
            incomeYear: document.getElementById('incomeYear').value,
            annualIncome: parseFloat(document.getElementById('annualIncome').value) || 0,
            helpDebt: document.getElementById('helpDebt').value === 'yes',
            projectionYears: parseInt(document.getElementById('projectionYears').value) || 1,
            rentIncrease: parseFloat(document.getElementById('rentIncrease').value) || 0
        };
    }

    calculateBuildingDepreciation(buildingCost) {
        // Standard 2.5% per year building depreciation
        return buildingCost * 0.025;
    }

    calculateTaxBracket(income, helpDebt = false, incomeYear = '2024-25') {
        // Australian Tax Brackets by year
        const taxBracketsByYear = {
            '2024-25': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 120000, rate: 0.325 },
                    { min: 120001, max: 180000, rate: 0.37 },
                    { min: 180001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226,
                helpThreshold: 51550
            },
            '2023-24': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 120000, rate: 0.325 },
                    { min: 120001, max: 180000, rate: 0.37 },
                    { min: 180001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226,
                helpThreshold: 51550
            },
            '2022-23': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 120000, rate: 0.325 },
                    { min: 120001, max: 180000, rate: 0.37 },
                    { min: 180001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226,
                helpThreshold: 48361
            }
        };

        const yearData = taxBracketsByYear[incomeYear] || taxBracketsByYear['2024-25'];
        
        let marginalRate = 0;
        for (const bracket of yearData.brackets) {
            if (income > bracket.min && income <= bracket.max) {
                marginalRate = bracket.rate;
                break;
            }
        }

        // Add Medicare Levy (2%)
        if (income > yearData.medicareThreshold) {
            marginalRate += 0.02;
        }

        // Add HELP debt repayment if applicable
        if (helpDebt && income > yearData.helpThreshold) {
            // Simplified HELP rate - actual rates vary by income
            marginalRate += 0.01; // 1% additional for HELP debt
        }

        return marginalRate;
    }

    calculate() {
        const inputs = this.getInputValues();
        
        // Calculate annual rental income
        const annualRentalIncome = inputs.weeklyRent * 52;
        
        // Calculate annual interest
        const annualInterest = inputs.loanAmount * (inputs.interestRate / 100);
        
        // Calculate property management fees
        const annualManagementFees = annualRentalIncome * (inputs.managementFees / 100);
        
        // Calculate total expenses (excluding interest and depreciation)
        const totalExpenses = annualManagementFees + inputs.councilRates + 
                             inputs.waterRates + inputs.insurance + 
                             inputs.maintenance + inputs.otherExpenses;
        
        // Calculate building depreciation
        const buildingDepreciation = this.calculateBuildingDepreciation(inputs.buildingCost);
        
        // Calculate total tax deductions
        const totalDeductions = totalExpenses + annualInterest + buildingDepreciation;
        
        // Calculate net rental income/loss
        const netRentalIncome = annualRentalIncome - totalExpenses - annualInterest;
        
        // Calculate tax benefit
        const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome, inputs.helpDebt, inputs.incomeYear);
        const taxBenefit = Math.abs(Math.min(0, netRentalIncome)) * marginalTaxRate + 
                          buildingDepreciation * marginalTaxRate;
        
        // Calculate net position after tax
        const netPosition = netRentalIncome + taxBenefit;
        
        // Calculate monthly out of pocket
        const monthlyOutOfPocket = Math.abs(Math.min(0, netPosition)) / 12;

        // Update display
        this.updateResults({
            annualCashFlow: netRentalIncome,
            taxBenefit: taxBenefit,
            netPosition: netPosition,
            monthlyOutOfPocket: monthlyOutOfPocket,
            totalRentalIncome: annualRentalIncome,
            totalExpenses: totalExpenses,
            annualInterest: annualInterest,
            buildingDepreciation: buildingDepreciation,
            totalDeductions: totalDeductions
        });

        // Generate multi-year projection
        this.generateProjection(inputs);
    }

    updateResults(results) {
        // Update main results
        document.getElementById('annualCashFlow').querySelector('.result-value').textContent = 
            this.formatCurrency(results.annualCashFlow);
        document.getElementById('annualCashFlow').querySelector('.result-value').className = 
            `result-value ${results.annualCashFlow >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('taxBenefit').querySelector('.result-value').textContent = 
            this.formatCurrency(results.taxBenefit);

        document.getElementById('netPosition').querySelector('.result-value').textContent = 
            this.formatCurrency(results.netPosition);
        document.getElementById('netPosition').querySelector('.result-value').className = 
            `result-value ${results.netPosition >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('monthlyOutOfPocket').querySelector('.result-value').textContent = 
            this.formatCurrency(results.monthlyOutOfPocket);

        // Update breakdown
        document.getElementById('totalRentalIncome').textContent = 
            this.formatCurrency(results.totalRentalIncome);
        document.getElementById('totalExpenses').textContent = 
            this.formatCurrency(results.totalExpenses);
        document.getElementById('annualInterest').textContent = 
            this.formatCurrency(results.annualInterest);
        document.getElementById('buildingDepreciation').textContent = 
            this.formatCurrency(results.buildingDepreciation);
        document.getElementById('totalDeductions').textContent = 
            this.formatCurrency(results.totalDeductions);
    }

    generateProjection(inputs) {
        const projectionYears = inputs.projectionYears;
        const tableBody = document.getElementById('projectionTableBody');
        tableBody.innerHTML = '';

        let currentRent = inputs.weeklyRent;
        const projectionData = [];

        for (let year = 1; year <= projectionYears; year++) {
            // Calculate rental income for this year
            const annualRentalIncome = currentRent * 52;
            
            // Calculate expenses (assuming they stay the same)
            const annualManagementFees = annualRentalIncome * (inputs.managementFees / 100);
            const totalExpenses = annualManagementFees + inputs.councilRates + 
                                 inputs.waterRates + inputs.insurance + 
                                 inputs.maintenance + inputs.otherExpenses;
            
            // Calculate interest (assuming it stays the same)
            const annualInterest = inputs.loanAmount * (inputs.interestRate / 100);
            
            // Calculate depreciation
            const buildingDepreciation = this.calculateBuildingDepreciation(inputs.buildingCost);
            
            // Calculate cash flow
            const cashFlow = annualRentalIncome - totalExpenses - annualInterest;
            
            // Calculate tax benefit
            const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome, inputs.helpDebt, inputs.incomeYear);
            const taxBenefit = Math.abs(Math.min(0, cashFlow)) * marginalTaxRate + 
                              buildingDepreciation * marginalTaxRate;
            
            // Calculate net position
            const netPosition = cashFlow + taxBenefit;

            // Store data for chart
            projectionData.push({
                year: year,
                rentalIncome: annualRentalIncome,
                cashFlow: cashFlow,
                taxBenefit: taxBenefit,
                netPosition: netPosition
            });

            // Add row to table
            const row = tableBody.insertRow();
            row.innerHTML = `
                <td>${year}</td>
                <td>${this.formatCurrency(annualRentalIncome)}</td>
                <td class="${cashFlow >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(cashFlow)}</td>
                <td class="positive">${this.formatCurrency(taxBenefit)}</td>
                <td class="${netPosition >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(netPosition)}</td>
            `;

            // Increase rent for next year
            currentRent = currentRent * (1 + inputs.rentIncrease / 100);
        }

        // Update chart (simplified - would use Chart.js in production)
        this.updateChart(projectionData);
    }

    updateChart(data) {
        // Simplified chart update - in production, you'd use Chart.js or similar
        const canvas = document.getElementById('projectionChart');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Simple bar chart representation
        const barWidth = canvas.width / data.length / 2;
        const maxValue = Math.max(...data.map(d => Math.abs(d.netPosition)));
        
        data.forEach((item, index) => {
            const x = index * (canvas.width / data.length) + barWidth / 2;
            const height = Math.abs(item.netPosition) / maxValue * (canvas.height - 40);
            const y = item.netPosition >= 0 ? canvas.height - height - 20 : canvas.height - 20;
            
            ctx.fillStyle = item.netPosition >= 0 ? '#28a745' : '#dc3545';
            ctx.fillRect(x, y, barWidth, height);
            
            // Add year label
            ctx.fillStyle = '#033b87';
            ctx.font = '12px Inter';
            ctx.textAlign = 'center';
            ctx.fillText(`Y${item.year}`, x + barWidth/2, canvas.height - 5);
        });
    }

    formatCurrency(amount, showSign = false) {
        const sign = showSign && amount >= 0 ? '+' : '';
        return sign + new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
    }
}

// Global functions for buttons
function downloadResults() {
    // In production, this would generate a PDF
    alert('Download functionality would generate a detailed PDF report here.');
}

function shareResults() {
    // In production, this would share via email or social media
    if (navigator.share) {
        navigator.share({
            title: 'Negative Gearing Calculator Results',
            text: 'Check out my property investment analysis',
            url: window.location.href
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert('Link copied to clipboard!');
        });
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new NegativeGearingCalculator();
});
