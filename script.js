document.addEventListener('DOMContentLoaded', function() {
    // تبديل الأقسام
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            // إزالة النشاط من جميع الروابط
            navLinks.forEach(item => item.classList.remove('active'));
            // إضافة النشاط إلى الرابط المختار
            this.classList.add('active');
            
            // إخفاء جميع الأقسام
            sections.forEach(section => section.classList.remove('active'));
            // عرض القسم المطلوب
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
            
            // تحديث البيانات في لوحة التحكم عند الانتقال إليها
            if (sectionId === 'dashboard') {
                updateDashboardData();
            }
        });
    });
    
    // تبديل الشريط الجانبي في الشاشات الصغيرة
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
    
    // إضافة معاملة استثمارية
    document.getElementById('add-trading-transaction').addEventListener('click', function() {
        document.getElementById('trading-modal').style.display = 'flex';
    });
    
    // إضافة معاملة ذهب
    document.getElementById('add-gold-transaction').addEventListener('click', function() {
        document.getElementById('gold-modal').style.display = 'flex';
    });
    
    // إضافة مصروف
    document.getElementById('add-expense').addEventListener('click', function() {
        document.getElementById('expense-form').style.display = 'block';
    });
    
    // إضافة دخل
    document.getElementById('add-income').addEventListener('click', function() {
        document.getElementById('income-form').style.display = 'block';
    });
    
    // إغلاق النماذج المنبثقة
    document.querySelectorAll('.close, .close-modal').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('trading-modal').style.display = 'none';
            document.getElementById('gold-modal').style.display = 'none';
        });
    });
    
    // حساب الإجماليات في نموذج التداول
    document.getElementById('trading-quantity').addEventListener('input', calculateTradingTotals);
    document.getElementById('trading-price').addEventListener('input', calculateTradingTotals);
    document.getElementById('trading-fee').addEventListener('input', calculateTradingTotals);
    
    // حساب الإجماليات في نموذج الذهب
    document.getElementById('gold-grams').addEventListener('input', calculateGoldTotals);
    document.getElementById('gold-price').addEventListener('input', calculateGoldTotals);
    document.getElementById('gold-fee').addEventListener('input', calculateGoldTotals);
    
    // تحميل البيانات من التخزين المحلي
    loadAllData();
    
    // تعيين تاريخ اليوم في الحقول
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('expense-date').value = today;
    document.getElementById('income-date').value = today;
    document.getElementById('trading-date').value = today;
    document.getElementById('gold-date').value = today;
    
    // إعداد عرض التقرير
    document.getElementById('report-type').addEventListener('change', function() {
        if (this.value === 'custom') {
            document.getElementById('custom-date-range').style.display = 'flex';
        } else {
            document.getElementById('custom-date-range').style.display = 'none';
        }
    });
    
    // تحميل البيانات المبدئية
    initializeData();
    
    // تحديث البيانات عند الضغط على زر التحديث
    document.getElementById('refresh-data').addEventListener('click', updateDashboardData);
    
    // إضافة معاملة استثمارية
    document.getElementById('trading-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveTradingTransaction();
        document.getElementById('trading-modal').style.display = 'none';
        updateDashboardData();
    });
    
    // إضافة معاملة ذهب
    document.getElementById('gold-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveGoldTransaction();
        document.getElementById('gold-modal').style.display = 'none';
        updateDashboardData();
    });
    
    // إضافة مصروف
    document.getElementById('expense-form-data').addEventListener('submit', function(e) {
        e.preventDefault();
        saveExpense();
        document.getElementById('expense-form').style.display = 'none';
        updateDashboardData();
    });
    
    // إضافة دخل
    document.getElementById('income-form-data').addEventListener('submit', function(e) {
        e.preventDefault();
        saveIncome();
        document.getElementById('income-form').style.display = 'none';
        updateDashboardData();
    });
    
    // إلغاء إضافة مصروف
    document.getElementById('cancel-expense').addEventListener('click', function() {
        document.getElementById('expense-form').style.display = 'none';
    });
    
    // إلغاء إضافة دخل
    document.getElementById('cancel-income').addEventListener('click', function() {
        document.getElementById('income-form').style.display = 'none';
    });
    
    // إنشاء تقرير
    document.getElementById('generate-report').addEventListener('click', generateReport);
    
    // تحميل البيانات المبدئية
    function initializeData() {
        const sampleData = {
            trading: [
                {
                    stock: "GOOG",
                    lastBuyDate: "2025-01-15",
                    totalQuantity: 10,
                    avgPrice: 150.50,
                    totalBuyValue: 1505.00,
                    totalBuyFee: 15.00,
                    lastSellDate: "2025-02-01",
                    soldQuantity: 5,
                    avgSellPrice: 160.00,
                    totalSellValue: 800.00,
                    totalSellFee: 8.00,
                    totalProfit: 47.00,
                    addedShares: 5,
                    profitLoss: 47.00,
                    percentage: 3.12,
                    currentHolding: 5,
                    currentPrice: 160.00,
                    currentValue: 800.00
                }
            ],
            gold: [
                {
                    goldType: "24K",
                    carat: 24,
                    grams: 50,
                    buyPrice: 1000.00,
                    totalBuyWithFee: 50500.00,
                    fee: 500.00,
                    totalBuyWithoutFee: 50000.00,
                    buyDate: "2025-01-20",
                    quantity: 50,
                    type: "شراء",
                    price: 1000.00,
                    soldQuantity: 25,
                    sellPrice: 1050.00,
                    totalSellWithFee: 26250.00,
                    totalSellWithoutFee: 26250.00,
                    sellDate: "2025-02-05",
                    difference: 250.00,
                    notes: "بيع جزء من الذهب"
                }
            ],
            expenses: [
                {
                    date: "2026-02-01",
                    category: "food",
                    amount: 200.00,
                    currency: "EGP",
                    payment: "cash",
                    notes: "شراء مشتريات من السوبر ماركت"
                },
                {
                    date: "2026-02-02",
                    category: "transportation",
                    amount: 50.00,
                    currency: "EGP",
                    payment: "instapay",
                    notes: "دفع مواصلات"
                }
            ],
            income: [
                {
                    date: "2026-02-01",
                    source: "salary",
                    amount: 5000.00,
                    currency: "EGP",
                    payment: "bank-transfer",
                    notes: "راتب شهر فبراير"
                },
                {
                    date: "2026-02-03",
                    source: "investment",
                    amount: 300.00,
                    currency: "EGP",
                    payment: "bank-transfer",
                    notes: "عائد استثمار"
                }
            ]
        };
        
        // حفظ البيانات في التخزين المحلي
        localStorage.setItem('portfolioData', JSON.stringify(sampleData));
        
        // تحديث العرض
        updateAllViews();
    }
    
    // حساب الإجماليات في نموذج التداول
    function calculateTradingTotals() {
        const quantity = parseFloat(document.getElementById('trading-quantity').value) || 0;
        const price = parseFloat(document.getElementById('trading-price').value) || 0;
        const fee = parseFloat(document.getElementById('trading-fee').value) || 0;
        
        const totalExcludeFee = quantity * price;
        const totalIncludeFee = totalExcludeFee + fee;
        
        document.getElementById('trading-total-exclude').value = totalExcludeFee.toFixed(2);
        document.getElementById('trading-total-include').value = totalIncludeFee.toFixed(2);
    }
    
    // حساب الإجماليات في نموذج الذهب
    function calculateGoldTotals() {
        const grams = parseFloat(document.getElementById('gold-grams').value) || 0;
        const price = parseFloat(document.getElementById('gold-price').value) || 0;
        const fee = parseFloat(document.getElementById('gold-fee').value) || 0;
        
        const totalExclude = grams * price;
        const totalInclude = totalExclude + fee;
        
        document.getElementById('gold-total-exclude').value = totalExclude.toFixed(2);
        document.getElementById('gold-total-include').value = totalInclude.toFixed(2);
    }
    
    // حفظ معاملة استثمارية
    function saveTradingTransaction() {
        const type = document.getElementById('trading-type').value;
        const stock = document.getElementById('trading-stock').value;
        const date = document.getElementById('trading-date').value;
        const quantity = parseFloat(document.getElementById('trading-quantity').value);
        const price = parseFloat(document.getElementById('trading-price').value);
        const fee = parseFloat(document.getElementById('trading-fee').value);
        const notes = document.getElementById('trading-notes').value;
        
        const transaction = {
            type,
            stock,
            date,
            quantity,
            price,
            fee,
            notes,
            totalExclude: quantity * price,
            totalInclude: quantity * price + fee
        };
        
        // حفظ في التخزين المحلي
        let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
        portfolioData.trading.push(transaction);
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // تحديث العرض
        updateAllViews();
    }
    
    // حفظ معاملة ذهب
    function saveGoldTransaction() {
        const type = document.getElementById('gold-type').value;
        const carat = document.getElementById('gold-carat').value;
        const grams = parseFloat(document.getElementById('gold-grams').value);
        const price = parseFloat(document.getElementById('gold-price').value);
        const fee = parseFloat(document.getElementById('gold-fee').value);
        const date = document.getElementById('gold-date').value;
        const notes = document.getElementById('gold-notes').value;
        
        const transaction = {
            type,
            carat,
            grams,
            price,
            fee,
            date,
            notes,
            totalExclude: grams * price,
            totalInclude: grams * price + fee
        };
        
        // حفظ في التخزين المحلي
        let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
        portfolioData.gold.push(transaction);
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // تحديث العرض
        updateAllViews();
    }
    
    // حفظ مصروف
    function saveExpense() {
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const currency = document.getElementById('expense-currency').value;
        const date = document.getElementById('expense-date').value;
        const category = document.getElementById('expense-category').value;
        const payment = document.getElementById('expense-payment').value;
        const notes = document.getElementById('expense-notes').value;
        
        const expense = {
            amount,
            currency,
            date,
            category,
            payment,
            notes
        };
        
        // حفظ في التخزين المحلي
        let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
        portfolioData.expenses.push(expense);
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // تحديث العرض
        updateAllViews();
    }
    
    // حفظ دخل
    function saveIncome() {
        const amount = parseFloat(document.getElementById('income-amount').value);
        const currency = document.getElementById('income-currency').value;
        const date = document.getElementById('income-date').value;
        const source = document.getElementById('income-source').value;
        const payment = document.getElementById('income-payment').value;
        const notes = document.getElementById('income-notes').value;
        
        const income = {
            amount,
            currency,
            date,
            source,
            payment,
            notes
        };
        
        // حفظ في التخزين المحلي
        let portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
        portfolioData.income.push(income);
        localStorage.setItem('portfolioData', JSON.stringify(portfolioData));
        
        // تحديث العرض
        updateAllViews();
    }
});// تحديث لوحة التحكم
function updateDashboardData() {
    // تحديث إحصائيات الاستثمارات
    let totalInvestments = 0;
    let totalValue = 0;
    let totalProfit = 0;
    let profitPercentage = 0;
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    
    // حساب مجموع الاستثمارات
    portfolioData.trading.forEach(stock => {
        totalInvestments += stock.quantity;
        totalValue += stock.totalInclude;
        totalProfit += (stock.totalInclude - (stock.quantity * stock.price));
    });
    
    // حساب النسبة المئوية
    if (totalValue > 0) {
        profitPercentage = (totalProfit / totalValue) * 100;
    }
    
    // تحديث العرض
    document.querySelector('.dashboard-card:nth-child(1) .stat-value:nth-child(2)').textContent = totalValue.toFixed(2) + ' EGP';
    document.querySelector('.dashboard-card:nth-child(1) .stat-value:nth-child(3)').textContent = totalProfit.toFixed(2) + ' EGP';
    document.querySelector('.dashboard-card:nth-child(1) .stat-value:nth-child(4)').textContent = profitPercentage.toFixed(2) + '%';
    
    // تحديث ملخص الذهب
    let totalGoldWeight = 0;
    let totalGoldValue = 0;
    let totalGoldProfit = 0;
    
    portfolioData.gold.forEach(gold => {
        totalGoldWeight += gold.grams;
        totalGoldValue += gold.totalInclude;
    });
    
    document.querySelector('.dashboard-card:nth-child(2) .stat-value:nth-child(1)').textContent = totalGoldWeight.toFixed(2) + ' جرام';
    document.querySelector('.dashboard-card:nth-child(2) .stat-value:nth-child(2)').textContent = totalGoldValue.toFixed(2) + ' EGP';
    
    // تحديث ملخص المحفظة
    let totalIncome = 0;
    let totalExpenses = 0;
    
    portfolioData.income.forEach(income => {
        totalIncome += income.amount;
    });
    
    portfolioData.expenses.forEach(expense => {
        totalExpenses += expense.amount;
    });
    
    const netBalance = totalIncome - totalExpenses;
    
    document.querySelector('.dashboard-card:nth-child(3) .stat-value:nth-child(1)').textContent = netBalance.toFixed(2) + ' EGP';
    document.querySelector('.dashboard-card:nth-child(3) .stat-value:nth-child(2)').textContent = totalIncome.toFixed(2) + ' EGP';
    document.querySelector('.dashboard-card:nth-child(3) .stat-value:nth-child(3)').textContent = totalExpenses.toFixed(2) + ' EGP';
    document.querySelector('.dashboard-card:nth-child(3) .stat-value:nth-child(4)').textContent = netBalance.toFixed(2) + ' EGP';
}

// تحديث جميع العروض
function updateAllViews() {
    updateDashboardData();
    updateStockDataTable();
    updateTradingRequestsTable();
    updateGoldDataTable();
    updateGoldRequestsTable();
    updateExpensesTable();
    updateIncomeTable();
}

// تحديث جدول بيانات الأسهم
function updateStockDataTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('#stock-data-table tbody');
    
    if (portfolioData.trading.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="18" class="empty-message">لا توجد بيانات لعرضها</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.trading.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stock.stock}</td>
            <td>${stock.date}</td>
            <td>${stock.quantity}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>${stock.totalExclude.toFixed(2)}</td>
            <td>${stock.fee.toFixed(2)}</td>
            <td>-</td>
            <td>0</td>
            <td>-</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>${stock.quantity}</td>
            <td>${(stock.totalInclude - stock.totalExclude).toFixed(2)}</td>
            <td>${((stock.totalInclude - stock.totalExclude) / stock.totalExclude * 100).toFixed(2)}%</td>
            <td>${stock.quantity}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>${stock.totalInclude.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول طلبات التداول
function updateTradingRequestsTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('#trading-requests-table tbody');
    
    if (portfolioData.trading.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="empty-message">لا توجد طلبات تداول</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.trading.forEach(stock => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${stock.stock}</td>
            <td>${stock.type === 'buy' ? 'شراء' : 'بيع'}</td>
            <td>${stock.quantity}</td>
            <td>${stock.price.toFixed(2)}</td>
            <td>${stock.fee.toFixed(2)}</td>
            <td>${stock.date}</td>
            <td>${stock.totalExclude.toFixed(2)}</td>
            <td>${stock.totalInclude.toFixed(2)}</td>
            <td>مكتملة</td>
            <td>${stock.notes}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول بيانات الذهب
function updateGoldDataTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('#gold-data-table tbody');
    
    if (portfolioData.gold.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="19" class="empty-message">لا توجد بيانات لعرضها</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.gold.forEach(gold => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gold.type}</td>
            <td>${gold.carat}</td>
            <td>${gold.grams.toFixed(2)}</td>
            <td>${gold.price.toFixed(2)}</td>
            <td>${gold.totalInclude.toFixed(2)}</td>
            <td>${gold.fee.toFixed(2)}</td>
            <td>${gold.totalExclude.toFixed(2)}</td>
            <td>${gold.date}</td>
            <td>${gold.grams.toFixed(2)}</td>
            <td>شراء</td>
            <td>${gold.price.toFixed(2)}</td>
            <td>0</td>
            <td>-</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>-</td>
            <td>0</td>
            <td>${gold.notes}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول طلبات الذهب
function updateGoldRequestsTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('#gold-requests-table tbody');
    
    if (portfolioData.gold.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="10" class="empty-message">لا توجد طلبات ذهب</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.gold.forEach(gold => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${gold.type}</td>
            <td>${gold.carat}</td>
            <td>${gold.grams.toFixed(2)}</td>
            <td>${gold.price.toFixed(2)}</td>
            <td>${gold.fee.toFixed(2)}</td>
            <td>${gold.date}</td>
            <td>${gold.totalExclude.toFixed(2)}</td>
            <td>${gold.totalInclude.toFixed(2)}</td>
            <td>مكتملة</td>
            <td>${gold.notes}</td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول المصروفات
function updateExpensesTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('.section#expenses .data-table tbody');
    
    if (portfolioData.expenses.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-message">لا توجد مصروفات لعرضها</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.expenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(expense.date)}</td>
            <td>${getCategoryName(expense.category)}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>${expense.currency}</td>
            <td>${getPaymentMethod(expense.payment)}</td>
            <td>
                <button class="btn btn-secondary btn-sm edit-btn">تعديل</button>
                <button class="btn btn-danger btn-sm delete-btn">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// تحديث جدول الدخل
function updateIncomeTable() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { trading: [], gold: [], expenses: [], income: [] };
    const tableBody = document.querySelector('.section#income .data-table tbody');
    
    if (portfolioData.income.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-message">لا يوجد دخل لعرضه</td></tr>';
        return;
    }
    
    tableBody.innerHTML = '';
    
    portfolioData.income.forEach(income => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(income.date)}</td>
            <td>${getSourceName(income.source)}</td>
            <td>${income.amount.toFixed(2)}</td>
            <td>${income.currency}</td>
            <td>${getPaymentMethod(income.payment)}</td>
            <td>
                <button class="btn btn-secondary btn-sm edit-btn">تعديل</button>
                <button class="btn btn-danger btn-sm delete-btn">حذف</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// إنشاء تقرير
function generateReport() {
    const reportType = document.getElementById('report-type').value;
    const reportPeriod = document.getElementById('report-period').value;
    
    // تنفيذ إنشاء التقرير بناءً على الاختيارات
    alert(`جاري إنشاء تقرير من نوع: ${reportType} للفترة: ${reportPeriod}`);
    
    // في التطبيق الفعلي، سيتم إنشاء تقرير مفصل هنا
}

// دوال مساعدة
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

function getCategoryName(category) {
    const categories = {
        'food': '🍔 طعام ومشروبات',
        'transportation': '🚕 مواصلات',
        'shopping': '🛒 تسوق',
        'bills': '🏠 فواتير',
        'health': '💊 صحة',
        'education': '📚 تعليم',
        'entertainment': '🎉 ترفيه',
        'communication': '📱 اتصالات',
        'investment': '📈 استثمار',
        'other': '🧾 أخرى'
    };
    return categories[category] || category;
}

function getSourceName(source) {
    const sources = {
        'salary': '💼 راتب',
        'bonus': '🎁 مكافأة',
        'investment': '📈 عائد استثمار',
        'other': '🧾 أخرى'
    };
    return sources[source] || source;
}

function getPaymentMethod(payment) {
    const methods = {
        'cash': '💵 كاش',
        'instapay': '📱 Instapay',
        'bank-transfer': '🏦 تحويل بنكي',
        'credit-card': '💳 بطاقة ائتمان',
        'e-wallet': '📲 محفظة إلكترونية'
    };
    return methods[payment] || payment;
}

// تحميل البيانات من التخزين المحلي
function loadAllData() {
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { 
        trading: [], 
        gold: [], 
        expenses: [], 
        income: [] 
    };
    
    // إذا كانت البيانات فارغة، تحميل البيانات الافتراضية
    if (portfolioData.trading.length === 0 && 
        portfolioData.gold.length === 0 && 
        portfolioData.expenses.length === 0 && 
        portfolioData.income.length === 0) {
        initializeData();
    }
    
    updateAllViews();
}// هذا الجزء إضافي ويمكن دمجه مع الجزء الرابع إذا أردت

// دالة لتحديث أحدث المعاملات في لوحة التحكم
function updateRecentTransactions() {
    const transactionsContainer = document.querySelector('.transactions-list');
    
    // تنظيف القائمة
    transactionsContainer.innerHTML = '';
    
    const portfolioData = JSON.parse(localStorage.getItem('portfolioData')) || { 
        trading: [], 
        gold: [], 
        expenses: [], 
        income: [] 
    };
    
    // إضافة أحدث 3 معاملات
    const recentTransactions = [
        ...portfolioData.trading.slice(-1).map(t => ({
            type: t.type,
            title: t.type === 'buy' ? 'شراء أسهم' : 'بيع أسهم',
            amount: t.type === 'buy' ? -t.totalInclude : t.totalInclude,
            date: t.date,
            currency: 'EGP'
        })),
        ...portfolioData.gold.slice(-1).map(g => ({
            type: 'buy',
            title: 'شراء ذهب',
            amount: -g.totalInclude,
            date: g.date,
            currency: 'EGP'
        })),
        ...portfolioData.income.slice(-1).map(i => ({
            type: 'income',
            title: 'إيداع',
            amount: i.amount,
            date: i.date,
            currency: i.currency
        })),
        ...portfolioData.expenses.slice(-1).map(e => ({
            type: 'expense',
            title: 'مصروف',
            amount: -e.amount,
            date: e.date,
            currency: e.currency
        }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
    
    recentTransactions.forEach(transaction => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        
        const icon = document.createElement('div');
        icon.className = 'transaction-icon';
        
        if (transaction.type === 'buy' || transaction.type === 'expense') {
            icon.innerHTML = '<i class="fas fa-arrow-down"></i>';
        } else {
            icon.innerHTML = '<i class="fas fa-arrow-up"></i>';
        }
        
        const details = document.createElement('div');
        details.className = 'transaction-details';
        details.innerHTML = `
            <div class="transaction-title">${transaction.title}</div>
            <div class="transaction-date">${formatDate(transaction.date)}</div>
            <div class="transaction-amount">${formatCurrency(transaction.amount, transaction.currency)}</div>
        `;
        
        item.appendChild(icon);
        item.appendChild(details);
        transactionsContainer.appendChild(item);
    });
}

// تنسيق العملة
function formatCurrency(amount, currency) {
    if (amount >= 0) {
        return `+${amount.toFixed(2)} ${currency}`;
    }
    return `${amount.toFixed(2)} ${currency}`;
}

// دالة إضافية لتحديث أحدث المعاملات
document.getElementById('refresh-data').addEventListener('click', function() {
    updateDashboardData();
    updateRecentTransactions();
});
