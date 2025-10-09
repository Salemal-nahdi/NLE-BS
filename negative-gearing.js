// Negative Gearing Calculator JavaScript
class NegativeGearingCalculator {
    constructor() {
        this.projectionData = []; // Store projection data for redrawing
        this.initializeInputs();
        this.setupEventListeners();
        this.setupResizeHandler();
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
            'otherExpenses', 'annualIncome', 'projectionYears', 'rentIncrease'
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

    setupResizeHandler() {
        // Redraw chart on window resize for responsive behavior
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (this.projectionData.length > 0) {
                    this.updateChart(this.projectionData);
                }
            }, 250); // Debounce resize events
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
            annualIncome: parseFloat(document.getElementById('annualIncome').value) || 0,
            projectionYears: parseInt(document.getElementById('projectionYears').value) || 1,
            rentIncrease: parseFloat(document.getElementById('rentIncrease').value) || 0
        };
    }

    calculateBuildingDepreciation(buildingCost) {
        // Standard 2.5% per year building depreciation
        return buildingCost * 0.025;
    }

    calculateTaxBracket(income) {
        // Using 2024-25/2025-26 tax rates (rates are the same for both years)
        const brackets = [
            { min: 0, max: 18200, rate: 0 },
            { min: 18201, max: 45000, rate: 0.19 },
            { min: 45001, max: 135000, rate: 0.30 },
            { min: 135001, max: 190000, rate: 0.37 },
            { min: 190001, max: Infinity, rate: 0.45 }
        ];
        
        let marginalRate = 0;
        for (const bracket of brackets) {
            if (income > bracket.min && income <= bracket.max) {
                marginalRate = bracket.rate;
                break;
            }
        }

        // Add Medicare Levy (2% for most taxpayers above $23,226)
        if (income > 23226) {
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
        
        // Calculate net rental income for tax purposes (includes depreciation, excludes principal repayment)
        const netRentalIncomeForTax = annualRentalIncome - totalExpenses - annualInterest - buildingDepreciation;
        
        // Calculate tax benefit
        const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome);
        
        // Tax benefit/cost calculation for Year 1:
        // netRentalIncomeForTax already includes all deductible expenses including depreciation
        let taxBenefitCost;
        if (netRentalIncomeForTax < 0) {
            // Property making a loss: tax benefit from loss
            taxBenefitCost = Math.abs(netRentalIncomeForTax) * marginalTaxRate;
        } else {
            // Property making a profit: tax cost on profit
            taxBenefitCost = -netRentalIncomeForTax * marginalTaxRate;
        }
        
        // Calculate net position after tax (using actual cash flow)
        const netPosition = netRentalCashFlow + taxBenefitCost;
        
        // Calculate monthly out of pocket
        const monthlyOutOfPocket = Math.abs(Math.min(0, netPosition)) / 12;

        // Prepare results object
        const results = {
            annualCashFlow: netRentalCashFlow,
            taxBenefit: taxBenefitCost,
            netPosition: netPosition,
            monthlyOutOfPocket: monthlyOutOfPocket,
            totalRentalIncome: annualRentalIncome,
            totalExpenses: totalExpenses,
            annualInterest: annualInterest,
            annualPrincipal: annualPrincipalRepayment,
            buildingDepreciation: buildingDepreciation,
            totalDeductions: totalDeductions,
            loanType: inputs.loanType
        };

        // Update display
        this.updateResults(results);

        // Generate multi-year projection
        this.generateProjection(inputs);
        
        // Return results for PDF/sharing
        return results;
    }

    updateResults(results) {
        // Update main results
        document.getElementById('annualCashFlow').querySelector('.result-value').textContent = 
            this.formatCurrency(results.annualCashFlow);
        document.getElementById('annualCashFlow').querySelector('.result-value').className = 
            `result-value ${results.annualCashFlow >= 0 ? 'positive' : 'negative'}`;

        document.getElementById('taxBenefit').querySelector('.result-value').textContent = 
            this.formatCurrency(results.taxBenefit);
        document.getElementById('taxBenefit').querySelector('.result-value').className = 
            `result-value ${results.taxBenefit >= 0 ? 'positive' : 'negative'}`;

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
            const marginalTaxRate = this.calculateTaxBracket(inputs.annualIncome);
            
            // Tax benefit/cost calculation:
            // taxableIncome already includes all deductible expenses including depreciation
            let taxBenefitCost;
            if (taxableIncome < 0) {
                // Property making a loss: tax benefit from loss
                taxBenefitCost = Math.abs(taxableIncome) * marginalTaxRate;
            } else {
                // Property making a profit: tax cost on profit
                taxBenefitCost = -taxableIncome * marginalTaxRate;
            }
            
            // Calculate net position
            const netPosition = cashFlow + taxBenefitCost;

            // Store data for chart
            projectionData.push({
                year: year,
                rentalIncome: annualRentalIncome,
                cashFlow: cashFlow,
                taxBenefit: taxBenefitCost,
                netPosition: netPosition
            });

            // Add row to table
            const row = tableBody.insertRow();
            // Calculate property tax position (difference between income and deductible expenses)
            const propertyTaxPosition = annualRentalIncome - totalTaxDeductibleExpenses;

            row.innerHTML = `
                <td>${year}</td>
                <td>${this.formatCurrency(annualRentalIncome)}</td>
                <td class="negative">${this.formatCurrency(-totalTaxDeductibleExpenses)}</td>
                <td class="${propertyTaxPosition >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(propertyTaxPosition)}</td>
                <td class="${taxBenefitCost >= 0 ? 'positive' : 'negative'}">${this.formatCurrency(taxBenefitCost)}</td>
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
        // Store data for resize events
        this.projectionData = data;
        
        const canvas = document.getElementById('projectionChart');
        const ctx = canvas.getContext('2d');
        
        // Responsive canvas sizing with higher DPI for crisp rendering
        const container = canvas.parentElement;
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        const isSmallMobile = window.innerWidth <= 400;
        const dpr = window.devicePixelRatio || 1;
        
        // Set display size - give more space on mobile
        const displayWidth = container.offsetWidth - (isMobile ? 10 : 40);
        const displayHeight = isSmallMobile ? 260 : (isMobile ? 280 : (isTablet ? 350 : 400));
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = displayHeight + 'px';
        
        // Set actual size in memory (scaled to account for extra pixel density)
        canvas.width = displayWidth * dpr;
        canvas.height = displayHeight * dpr;
        
        // Scale the context to ensure correct drawing operations
        ctx.scale(dpr, dpr);
        
        // Brand colors - enhanced palette
        const colors = {
            primary: '#459DD8',
            secondary: '#033B87', 
            improvement: '#27AE60',
            decline: '#E74C3C',
            text: '#2C3E50',
            lightText: '#95A5A6',
            grid: '#ECF0F1',
            gridLight: '#F8F9FA',
            background: '#FFFFFF',
            shadow: 'rgba(0, 0, 0, 0.1)'
        };
        
        // Responsive dimensions optimized for mobile
        const paddingLeft = isSmallMobile ? 50 : (isMobile ? 55 : 75);
        const paddingRight = isMobile ? 10 : 25;
        const paddingTop = isSmallMobile ? 40 : (isMobile ? 45 : 55);
        const paddingBottom = isSmallMobile ? 45 : (isMobile ? 50 : 60);
        const chartWidth = displayWidth - paddingLeft - paddingRight;
        const chartHeight = displayHeight - paddingTop - paddingBottom;
        
        // Calculate scales with better spacing
        const values = data.map(d => d.netPosition);
        const maxVal = Math.max(...values, 0);
        const minVal = Math.min(...values, 0);
        const range = Math.max(Math.abs(maxVal), Math.abs(minVal)) * 1.3; // More breathing room
        const zeroY = paddingTop + chartHeight / 2;
        
        // Clean background with subtle gradient
        const bgGradient = ctx.createLinearGradient(0, 0, 0, displayHeight);
        bgGradient.addColorStop(0, colors.background);
        bgGradient.addColorStop(1, colors.gridLight);
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
        
        // Chart background
        ctx.fillStyle = colors.background;
        ctx.fillRect(paddingLeft, paddingTop, chartWidth, chartHeight);
        
        // Grid lines - adaptive based on number of years
        const numGridLines = data.length <= 3 ? 5 : 3;
        ctx.strokeStyle = colors.grid;
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= numGridLines; i++) {
            const y = paddingTop + (chartHeight / numGridLines) * i;
            ctx.beginPath();
            ctx.moveTo(paddingLeft, y);
            ctx.lineTo(paddingLeft + chartWidth, y);
            ctx.stroke();
            
            // Y-axis labels with smart formatting
            const value = maxVal - (maxVal - minVal) * (i / numGridLines);
            ctx.fillStyle = colors.lightText;
            ctx.font = `${isSmallMobile ? '9' : (isMobile ? '10' : '11')}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            
            // Compact but readable formatting
            let label;
            if (Math.abs(value) < 100) {
                label = '$0';
            } else if (Math.abs(value) >= 1000) {
                const kValue = Math.round(value / 100) / 10;
                label = `$${kValue}k`;
            } else {
                label = `$${Math.round(value)}`;
            }
            
            ctx.fillText(label, paddingLeft - (isMobile ? 6 : 8), y);
        }
        
        // Zero line emphasis if in range
        const actualZeroY = paddingTop + ((maxVal) / (maxVal - minVal)) * chartHeight;
        if (actualZeroY >= paddingTop && actualZeroY <= paddingTop + chartHeight) {
            ctx.strokeStyle = colors.text;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(paddingLeft, actualZeroY);
            ctx.lineTo(paddingLeft + chartWidth, actualZeroY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Draw enhanced line chart
        if (data.length > 0) {
            const points = data.map((item, index) => {
                const x = paddingLeft + (data.length === 1 ? chartWidth / 2 : (index / (data.length - 1)) * chartWidth);
                const y = paddingTop + ((maxVal - item.netPosition) / (maxVal - minVal)) * chartHeight;
                return { x, y, value: item.netPosition };
            });
            
            if (data.length > 1) {
                // Gradient area fill
                const areaGradient = ctx.createLinearGradient(0, paddingTop, 0, paddingTop + chartHeight);
                areaGradient.addColorStop(0, 'rgba(69, 157, 216, 0.15)');
                areaGradient.addColorStop(1, 'rgba(69, 157, 216, 0.05)');
                
                ctx.fillStyle = areaGradient;
                ctx.beginPath();
                ctx.moveTo(points[0].x, paddingTop + chartHeight);
                ctx.lineTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                
                ctx.lineTo(points[points.length - 1].x, paddingTop + chartHeight);
                ctx.closePath();
                ctx.fill();
                
                // Main line with shadow
                ctx.shadowColor = colors.shadow;
                ctx.shadowBlur = isMobile ? 3 : 5;
                ctx.shadowOffsetY = 2;
                ctx.strokeStyle = colors.primary;
                ctx.lineWidth = isMobile ? 2.5 : 3;
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.moveTo(points[0].x, points[0].y);
                
                for (let i = 1; i < points.length; i++) {
                    ctx.lineTo(points[i].x, points[i].y);
                }
                ctx.stroke();
                
                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
            }
            
            // Enhanced data points with glow effect
            points.forEach((point, index) => {
                const value = data[index].netPosition;
                const isPositive = value >= 0;
                const pointColor = isPositive ? colors.improvement : colors.decline;
                const pointSize = isMobile ? 5 : 6;
                
                // Outer glow
                ctx.shadowColor = pointColor;
                ctx.shadowBlur = isMobile ? 8 : 10;
                ctx.fillStyle = pointColor;
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointSize, 0, 2 * Math.PI);
                ctx.fill();
                
                // Reset shadow
                ctx.shadowColor = 'transparent';
                ctx.shadowBlur = 0;
                
                // White center ring
                ctx.fillStyle = colors.background;
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointSize - 2, 0, 2 * Math.PI);
                ctx.fill();
                
                // Inner colored dot
                ctx.fillStyle = pointColor;
                ctx.beginPath();
                ctx.arc(point.x, point.y, pointSize - 3.5, 0, 2 * Math.PI);
                ctx.fill();
            });
        }
        
        // X-axis labels and values
        data.forEach((item, index) => {
            const x = data.length === 1 
                ? paddingLeft + chartWidth / 2 
                : paddingLeft + (index / (data.length - 1)) * chartWidth;
            
            // Year label
            ctx.fillStyle = colors.text;
            ctx.font = `600 ${isSmallMobile ? '10' : (isMobile ? '11' : '12')}px system-ui, -apple-system, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(`Year ${item.year}`, x, displayHeight - paddingBottom + (isMobile ? 12 : 15));
            
            // Value labels - position based on value with extra offset for first/last items
            const y = paddingTop + ((maxVal - item.netPosition) / (maxVal - minVal)) * chartHeight;
            const isPositive = item.netPosition >= 0;
            
            // Add extra offset for edge labels to prevent overlap with Y-axis or edge
            let baseOffset = isSmallMobile ? 16 : (isMobile ? 18 : 22);
            if (index === 0 && !isPositive) {
                // First negative value - move it down more to avoid Y-axis labels
                baseOffset += isSmallMobile ? 6 : (isMobile ? 8 : 10);
            } else if (index === data.length - 1 && isPositive) {
                // Last positive value - move it up more to avoid edge
                baseOffset += 4;
            }
            
            const labelY = isPositive ? y - baseOffset : y + baseOffset;
            
            // Value label with background for better readability on mobile
            if (isMobile && data.length <= 3) {
                const valueText = this.formatCurrency(item.netPosition);
                const metrics = ctx.measureText(valueText);
                const textWidth = metrics.width;
                const textHeight = isSmallMobile ? 14 : 16;
                
                // Background pill
                ctx.fillStyle = isPositive ? colors.improvement : colors.decline;
                ctx.globalAlpha = 0.1;
                ctx.beginPath();
                ctx.roundRect(x - textWidth/2 - 6, labelY - textHeight/2 - 2, textWidth + 12, textHeight + 4, 8);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
            
            // Value text
            ctx.fillStyle = isPositive ? colors.improvement : colors.decline;
            ctx.font = `700 ${isSmallMobile ? '10' : (isMobile ? '11' : '12')}px system-ui, -apple-system, sans-serif`;
            ctx.textBaseline = 'middle';
            ctx.fillText(this.formatCurrency(item.netPosition), x, labelY);
        });
        
        // Title with subtitle
        ctx.fillStyle = colors.secondary;
        ctx.font = `700 ${isSmallMobile ? '13' : (isMobile ? '14' : '16')}px system-ui, -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('Net Cash Flow Projection', displayWidth / 2, isSmallMobile ? 10 : (isMobile ? 12 : 15));
        
        // Subtitle
        ctx.fillStyle = colors.lightText;
        ctx.font = `400 ${isSmallMobile ? '9' : (isMobile ? '10' : '11')}px system-ui, -apple-system, sans-serif`;
        ctx.fillText('After tax benefit & expenses', displayWidth / 2, isSmallMobile ? 25 : (isMobile ? 28 : 32));
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

function shareResults() {
    const calculator = new NegativeGearingCalculator();
    const inputs = calculator.getInputValues();
    
    if (!inputs.buildingCost || !inputs.weeklyRent || !inputs.loanAmount) {
        alert('Please complete the calculator first before sharing results.');
        return;
    }
    
    // Calculate key metrics for sharing
    const results = calculator.calculate();
    const shareText = `Negative Gearing Analysis Results:
📊 Annual Cash Flow: ${calculator.formatCurrency(results.netPosition)}
💰 Tax Benefit: ${calculator.formatCurrency(results.taxBenefit)}
🏠 Property Investment Analysis completed on NLE Business Services Calculator`;
    
    if (navigator.share && navigator.canShare) {
        navigator.share({
            title: 'Property Investment Analysis - NLE Business Services',
            text: shareText,
            url: window.location.href
        }).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(shareText);
        });
    } else {
        fallbackShare(shareText);
    }
}

function fallbackShare(shareText) {
    // Create a temporary textarea to copy text
    const textArea = document.createElement('textarea');
    textArea.value = shareText + '\n\nCalculate your own: ' + window.location.href;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        alert('Results copied to clipboard! You can now paste and share.');
    } catch (err) {
        alert('Unable to copy to clipboard. Please manually copy the URL to share.');
    }
    
    document.body.removeChild(textArea);
}



// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new NegativeGearingCalculator();
});
