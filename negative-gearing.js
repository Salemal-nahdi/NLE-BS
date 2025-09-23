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
            'buildingCost', 'weeklyRent', 'loanAmount', 'interestRate', 'loanType', 'loanTerm',
            'managementFees', 'councilRates', 'waterRates', 'insurance', 'maintenance',
            'otherExpenses', 'incomeYear', 'annualIncome', 'projectionYears', 'rentIncrease'
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
            loanType: document.getElementById('loanType').value,
            loanTerm: parseInt(document.getElementById('loanTerm').value) || 30,
            managementFees: parseFloat(document.getElementById('managementFees').value) || 0,
            councilRates: parseFloat(document.getElementById('councilRates').value) || 0,
            waterRates: parseFloat(document.getElementById('waterRates').value) || 0,
            insurance: parseFloat(document.getElementById('insurance').value) || 0,
            maintenance: parseFloat(document.getElementById('maintenance').value) || 0,
            otherExpenses: parseFloat(document.getElementById('otherExpenses').value) || 0,
            incomeYear: document.getElementById('incomeYear').value,
            annualIncome: parseFloat(document.getElementById('annualIncome').value) || 0,
            projectionYears: parseInt(document.getElementById('projectionYears').value) || 1,
            rentIncrease: parseFloat(document.getElementById('rentIncrease').value) || 0
        };
    }

    calculateBuildingDepreciation(buildingCost) {
        // Standard 2.5% per year building depreciation
        return buildingCost * 0.025;
    }

    calculateTaxBracket(income, incomeYear = '2024-25') {
        // Australian Tax Brackets by year
        const taxBracketsByYear = {
            '2024-25': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 135000, rate: 0.30 },
                    { min: 135001, max: 190000, rate: 0.37 },
                    { min: 190001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226
            },
            '2023-24': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 120000, rate: 0.325 },
                    { min: 120001, max: 180000, rate: 0.37 },
                    { min: 180001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226
            },
            '2022-23': {
                brackets: [
                    { min: 0, max: 18200, rate: 0 },
                    { min: 18201, max: 45000, rate: 0.19 },
                    { min: 45001, max: 120000, rate: 0.325 },
                    { min: 120001, max: 180000, rate: 0.37 },
                    { min: 180001, max: Infinity, rate: 0.45 }
                ],
                medicareThreshold: 23226
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

        // Add Medicare Levy (2% for most taxpayers)
        if (income > yearData.medicareThreshold) {
            marginalRate += 0.02; // 2% Medicare Levy
        }


        return marginalRate;
    }

    calculate() {
        const inputs = this.getInputValues();
        
        // Calculate annual rental income
        const annualRentalIncome = inputs.weeklyRent * 52;
        
        // Calculate annual interest and principal repayment
        let annualInterest, annualPrincipalRepayment = 0;
        
        if (inputs.loanType === 'principal_interest') {
            const monthlyRate = inputs.interestRate / 100 / 12;
            const numPayments = inputs.loanTerm * 12; // Use selected loan term
            if (monthlyRate > 0) {
                // Calculate exact monthly payment
                const monthlyPayment = inputs.loanAmount * 
                    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
                
                // Calculate first year interest and principal (more accurate)
                let remainingBalance = inputs.loanAmount;
                let yearlyInterest = 0;
                let yearlyPrincipal = 0;
                
                for (let month = 1; month <= 12; month++) {
                    const monthlyInterest = remainingBalance * monthlyRate;
                    const monthlyPrincipal = monthlyPayment - monthlyInterest;
                    
                    yearlyInterest += monthlyInterest;
                    yearlyPrincipal += monthlyPrincipal;
                    remainingBalance -= monthlyPrincipal;
                }
                
                annualInterest = yearlyInterest;
                annualPrincipalRepayment = yearlyPrincipal;
            } else {
                annualInterest = 0;
                annualPrincipalRepayment = 0;
            }
        } else {
            // Interest-only loan
            annualInterest = inputs.loanAmount * (inputs.interestRate / 100);
            annualPrincipalRepayment = 0;
        }
        
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
        
        // Calculate net rental income/loss (cash flow)
        const netRentalCashFlow = annualRentalIncome - totalExpenses - annualInterest - annualPrincipalRepayment;
        
        // Calculate net rental income for tax purposes (excludes principal repayment)
        const netRentalIncomeForTax = annualRentalIncome - totalExpenses - annualInterest;
        
        // Calculate tax benefit
        const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome, inputs.incomeYear);
        const taxBenefit = Math.abs(Math.min(0, netRentalIncomeForTax)) * marginalTaxRate + 
                          buildingDepreciation * marginalTaxRate;
        
        // Calculate net position after tax (using actual cash flow)
        const netPosition = netRentalCashFlow + taxBenefit;
        
        // Calculate monthly out of pocket
        const monthlyOutOfPocket = Math.abs(Math.min(0, netPosition)) / 12;

        // Update display
        this.updateResults({
            annualCashFlow: netRentalCashFlow,
            taxBenefit: taxBenefit,
            netPosition: netPosition,
            monthlyOutOfPocket: monthlyOutOfPocket,
            totalRentalIncome: annualRentalIncome,
            totalExpenses: totalExpenses,
            annualInterest: annualInterest,
            annualPrincipal: annualPrincipalRepayment,
            buildingDepreciation: buildingDepreciation,
            totalDeductions: totalDeductions,
            loanType: inputs.loanType
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
            this.formatCurrencyWithParens(results.netPosition);
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
        
        // Show/hide principal repayment based on loan type
        const principalItem = document.getElementById('principalRepaymentItem');
        if (results.loanType === 'principal_interest' && results.annualPrincipal > 0) {
            principalItem.style.display = 'flex';
            document.getElementById('annualPrincipal').textContent = 
                this.formatCurrency(results.annualPrincipal);
        } else {
            principalItem.style.display = 'none';
        }
        
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
        let remainingBalance = inputs.loanAmount;
        const projectionData = [];

        // Calculate monthly payment for P&I loans
        let monthlyPayment = 0;
        if (inputs.loanType === 'principal_interest') {
            const monthlyRate = inputs.interestRate / 100 / 12;
            const numPayments = inputs.loanTerm * 12;
            if (monthlyRate > 0) {
                monthlyPayment = inputs.loanAmount * 
                    (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                    (Math.pow(1 + monthlyRate, numPayments) - 1);
            }
        }

        for (let year = 1; year <= projectionYears; year++) {
            // Calculate rental income for this year
            const annualRentalIncome = currentRent * 52;
            
            // Calculate expenses (assuming they stay the same)
            const annualManagementFees = annualRentalIncome * (inputs.managementFees / 100);
            const totalExpenses = annualManagementFees + inputs.councilRates + 
                                 inputs.waterRates + inputs.insurance + 
                                 inputs.maintenance + inputs.otherExpenses;
            
            
            // Calculate accurate interest and principal for this year
            let annualInterest, annualPrincipalRepayment = 0;
            
            if (inputs.loanType === 'principal_interest' && monthlyPayment > 0) {
                const monthlyRate = inputs.interestRate / 100 / 12;
                let yearlyInterest = 0;
                let yearlyPrincipal = 0;
                let currentBalance = remainingBalance;
                
                // Calculate month by month for this year
                for (let month = 1; month <= 12; month++) {
                    const monthlyInterest = currentBalance * monthlyRate;
                    const monthlyPrincipal = monthlyPayment - monthlyInterest;
                    
                    yearlyInterest += monthlyInterest;
                    yearlyPrincipal += monthlyPrincipal;
                    currentBalance -= monthlyPrincipal;
                }
                
                annualInterest = yearlyInterest;
                annualPrincipalRepayment = yearlyPrincipal;
                remainingBalance = currentBalance; // Update balance for next year
            } else {
                // Interest-only loan
                annualInterest = remainingBalance * (inputs.interestRate / 100);
                annualPrincipalRepayment = 0;
            }
            
            // Calculate depreciation
            const buildingDepreciation = this.calculateBuildingDepreciation(inputs.buildingCost);
            
            // Calculate cash flow (including principal repayment)
            const cashFlow = annualRentalIncome - totalExpenses - annualInterest - annualPrincipalRepayment;
            
            // Calculate taxable income (excluding principal repayment)
            // This should be: rental income - ALL deductible expenses
            const taxableIncome = annualRentalIncome - (totalExpenses + annualInterest + buildingDepreciation);
            
            
            // Calculate total tax deductible expenses (all expenses + interest + depreciation)
            const totalTaxDeductibleExpenses = totalExpenses + annualInterest + buildingDepreciation;
            
            // Calculate negative gearing offset (amount that reduces taxable income)
            const negativeGearingOffset = totalTaxDeductibleExpenses - annualRentalIncome;
            
            // Calculate tax benefit
            const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome, inputs.incomeYear);
            
            // Tax benefit calculation:
            // If there's a loss (taxableIncome < 0), the entire loss is tax deductible
            const taxBenefit = taxableIncome < 0 ? Math.abs(taxableIncome) * marginalTaxRate : 0;
            
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
            // Calculate negative gearing amount (total deductions that reduce taxable income)
            const negativeGearingAmount = totalTaxDeductibleExpenses - annualRentalIncome;
            
            row.innerHTML = `
                <td>${year}</td>
                <td>${this.formatCurrency(annualRentalIncome)}</td>
                <td class="negative">${this.formatCurrency(-totalTaxDeductibleExpenses)}</td>
                <td class="${negativeGearingAmount > 0 ? 'negative' : 'neutral'}">${this.formatCurrency(negativeGearingAmount > 0 ? -negativeGearingAmount : 0)}</td>
                <td class="positive">${this.formatCurrency(taxBenefit)}</td>
                <td class="${annualPrincipalRepayment > 0 ? 'negative' : 'neutral'}">${this.formatCurrency(-annualPrincipalRepayment)}</td>
                <td class="positive">${this.formatCurrency(buildingDepreciation)}</td>
                <td class="${netPosition >= 0 ? 'positive' : 'negative'}">${this.formatCurrencyWithParens(netPosition)}</td>
            `;

            // Increase rent for next year
            currentRent = currentRent * (1 + inputs.rentIncrease / 100);
        }

        // Update chart (simplified - would use Chart.js in production)
        this.updateChart(projectionData);
    }

    updateChart(data) {
        const canvas = document.getElementById('projectionChart');
        const ctx = canvas.getContext('2d');
        
        // Responsive canvas sizing
        const container = canvas.parentElement;
        const isMobile = window.innerWidth <= 768;
        canvas.width = Math.min(container.offsetWidth - 40, isMobile ? 350 : 800);
        canvas.height = isMobile ? 280 : 320;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Brand colors
        const colors = {
            primary: '#459DD8',
            secondary: '#033B87', 
            improvement: '#27AE60',
            decline: '#E74C3C',
            text: '#2C3E50',
            lightText: '#7F8C8D',
            grid: '#E8F4FD',
            background: '#FFFFFF'
        };
        
        // Responsive dimensions with much more space for Y-axis labels
        const paddingLeft = isMobile ? 80 : 90;
        const paddingRight = isMobile ? 20 : 30;
        const paddingTop = isMobile ? 50 : 60;
        const paddingBottom = isMobile ? 40 : 50;
        const chartWidth = canvas.width - paddingLeft - paddingRight;
        const chartHeight = canvas.height - paddingTop - paddingBottom;
        
        // Calculate scales
        const values = data.map(d => d.netPosition);
        const maxVal = Math.max(...values);
        const minVal = Math.min(...values);
        const range = Math.max(Math.abs(maxVal), Math.abs(minVal)) * 1.2;
        const zeroY = paddingTop + chartHeight / 2;
        
        // Clean background
        ctx.fillStyle = colors.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Minimal grid
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        
        // Only show zero line and max/min for cleaner spacing
        const maxAbsValue = Math.max(Math.abs(maxVal), Math.abs(minVal));
        const gridValues = maxAbsValue > 0 ? [-maxAbsValue, 0, maxAbsValue] : [0];
        
        gridValues.forEach((value, i) => {
            const y = paddingTop + (chartHeight / gridValues.length) * i + (chartHeight / (gridValues.length * 2));
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(paddingLeft + chartWidth, y);
            ctx.stroke();
            
            // Ultra-compact labels
            ctx.fillStyle = colors.lightText;
            ctx.font = `${isMobile ? '8' : '9'}px system-ui, sans-serif`;
            ctx.textAlign = 'right';
            
            // Super compact formatting
            let label;
            if (value === 0) {
                label = '$0';
            } else if (Math.abs(value) >= 1000) {
                const kValue = value / 1000;
                label = `${kValue >= 0 ? '' : '-'}$${Math.abs(kValue).toFixed(0)}k`;
            } else {
                label = `$${value.toFixed(0)}`;
            }
            
            ctx.fillText(label, paddingLeft - 8, y + 2);
        });
        
        // Zero line emphasis (always in the middle)
        ctx.strokeStyle = colors.text;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const actualZeroY = paddingTop + chartHeight / 2;
        ctx.moveTo(paddingLeft, actualZeroY);
        ctx.lineTo(paddingLeft + chartWidth, actualZeroY);
        ctx.stroke();
        
        // Draw smooth line chart
        if (data.length > 1) {
            const points = data.map((item, index) => ({
                x: paddingLeft + (index / (data.length - 1)) * chartWidth,
                y: actualZeroY - (item.netPosition / range) * (chartHeight / 2)
            }));
            
            // Line gradient
            const lineGradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
            lineGradient.addColorStop(0, colors.improvement);
            lineGradient.addColorStop(0.5, colors.primary);
            lineGradient.addColorStop(1, colors.decline);
            
            // Draw line
            ctx.strokeStyle = colors.primary;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(points[0].x, points[0].y);
            
            // Smooth curve
            for (let i = 1; i < points.length; i++) {
                const prevPoint = points[i - 1];
                const currentPoint = points[i];
                const cpX = (prevPoint.x + currentPoint.x) / 2;
                ctx.quadraticCurveTo(cpX, prevPoint.y, currentPoint.x, currentPoint.y);
            }
            ctx.stroke();
            
            // Area fill under line
            ctx.fillStyle = `${colors.primary}20`;
            ctx.lineTo(points[points.length - 1].x, actualZeroY);
            ctx.lineTo(points[0].x, actualZeroY);
            ctx.closePath();
            ctx.fill();
            
            // Data points
            points.forEach((point, index) => {
                const value = data[index].netPosition;
                const isPositive = value >= 0;
                
                // Point circle
                ctx.fillStyle = isPositive ? colors.improvement : colors.decline;
                ctx.beginPath();
                ctx.arc(point.x, point.y, isMobile ? 4 : 5, 0, 2 * Math.PI);
                ctx.fill();
                
                // White center
                ctx.fillStyle = colors.background;
                ctx.beginPath();
                ctx.arc(point.x, point.y, isMobile ? 2 : 3, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        // Year labels on X-axis
        data.forEach((item, index) => {
            const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
            ctx.fillStyle = colors.text;
            ctx.font = `600 ${isMobile ? '11' : '12'}px system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.fillText(`Y${item.year}`, x, canvas.height - paddingBottom + 25);
            
            // Value labels above/below points
            const y = actualZeroY - (item.netPosition / range) * (chartHeight / 2);
            const labelY = item.netPosition >= 0 ? y - 15 : y + 20;
            
            ctx.fillStyle = item.netPosition >= 0 ? colors.improvement : colors.decline;
            ctx.font = `600 ${isMobile ? '9' : '10'}px system-ui, sans-serif`;
            ctx.fillText(this.formatCurrency(item.netPosition), x, labelY);
        });
        
        // Modern title
        ctx.fillStyle = colors.secondary;
        ctx.font = `600 ${isMobile ? '14' : '16'}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('Cash Flow Projection', canvas.width / 2, paddingTop - 15);
        
        // Trend indicator
        const firstValue = data[0].netPosition;
        const lastValue = data[data.length - 1].netPosition;
        const trend = lastValue > firstValue ? '↗' : '↘';
        const trendText = lastValue > firstValue ? 'Improving' : 'Declining';
        const trendColor = lastValue > firstValue ? colors.improvement : colors.decline;
        
        ctx.fillStyle = trendColor;
        ctx.font = `500 ${isMobile ? '11' : '12'}px system-ui, sans-serif`;
        ctx.textAlign = 'right';
        ctx.fillText(`${trend} ${trendText}`, canvas.width - paddingRight, paddingTop - 15);
    }

    formatCurrency(amount, showSign = false) {
        const sign = showSign && amount >= 0 ? '+' : '';
        return sign + new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatCurrencyWithParens(amount) {
        const formatted = new Intl.NumberFormat('en-AU', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Math.abs(amount));
        
        return amount < 0 ? `(${formatted})` : formatted;
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
