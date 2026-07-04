/*=========================================================
        PERSONAL EXPENSE TRACKER
                PART 3A-1
=========================================================*/


/*=========================================================
                    DOM ELEMENTS
=========================================================*/

const expenseForm = document.getElementById("expenseForm");

const title = document.getElementById("title");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const date = document.getElementById("date");

const income = document.getElementById("income");
const budget = document.getElementById("budget");

const saveSettings =
document.getElementById("saveSettings");

const editSettings =
document.getElementById("editSettings");

const expenseTable =
document.getElementById("expenseTable");

const searchExpense =
document.getElementById("searchExpense");

const filterCategory =
document.getElementById("filterCategory");

const sortBtn =
document.getElementById("sortBtn");

const themeBtn =
document.getElementById("themeBtn");

const refreshBtn =
document.getElementById("refreshBtn");

const floatingBtn =
document.getElementById("floatingBtn");

const toast =
document.getElementById("toast");

const incomeDisplay =
document.getElementById("incomeDisplay");

const expenseDisplay =
document.getElementById("expenseDisplay");

const balanceDisplay =
document.getElementById("balanceDisplay");

const budgetValue =
document.getElementById("budgetValue");

const spentValue =
document.getElementById("spentValue");

const budgetPercent =
document.getElementById("budgetPercent");

const progressFill =
document.getElementById("progressFill");

const totalExpenseCount =
document.getElementById("totalExpenseCount");

const monthExpense =
document.getElementById("monthExpense");

const highestExpense =
document.getElementById("highestExpense");

const deleteModal =
document.getElementById("deleteModal");

const confirmDelete =
document.getElementById("confirmDelete");

const cancelDelete =
document.getElementById("cancelDelete");

const addBtn = document.getElementById("addBtn");

const clearBtn = document.getElementById("clearBtn");

/*=========================================================
                GLOBAL VARIABLES
=========================================================*/

let expenses = [];

let deleteIndex = -1;

let editIndex = -1;

let chart = null;



/*=========================================================
                LOAD LOCAL STORAGE
=========================================================*/

const savedExpenses =
JSON.parse(localStorage.getItem("expenses"));

if(savedExpenses){

    expenses = savedExpenses;

}

const savedIncome =
localStorage.getItem("income");

if(savedIncome){

    income.value = savedIncome;

}

const savedBudget =
localStorage.getItem("budget");

if(savedBudget){

    budget.value = savedBudget;

}



/*=========================================================
                FORMAT MONEY
=========================================================*/

function formatMoney(value){

    value = Number(value);

    return "₹" + value.toLocaleString("en-IN");

}



/*=========================================================
            TOAST MESSAGE
=========================================================*/

function showToast(message,type){

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}



/*=========================================================
            SAVE TO LOCAL STORAGE
=========================================================*/

function saveData(){

    localStorage.setItem(

        "expenses",

        JSON.stringify(expenses)

    );

    localStorage.setItem(

        "income",

        income.value

    );

    localStorage.setItem(

        "budget",

        budget.value

    );

}



/*=========================================================
            UPDATE DASHBOARD
=========================================================*/

function updateDashboard(){

    const totalIncome =

        Number(income.value) || 0;

    const totalBudget =

        Number(budget.value) || 0;

    let totalExpense = 0;

    expenses.forEach(expense=>{

        totalExpense += Number(expense.amount);

    });

    const balance =

        totalIncome - totalExpense;

    incomeDisplay.textContent =

        formatMoney(totalIncome);

    expenseDisplay.textContent =

        formatMoney(totalExpense);

    balanceDisplay.textContent =

        formatMoney(balance);

    budgetValue.textContent =

        formatMoney(totalBudget);

    spentValue.textContent =

        formatMoney(totalExpense);

    let percent = 0;

    if(totalBudget>0){

        percent =

        (totalExpense/totalBudget)*100;

    }

    if(percent>100){

        percent=100;

    }

    budgetPercent.textContent =

        percent.toFixed(0)+"%";

    progressFill.style.width =

        percent+"%";



    /* Progress Color */

    if(percent<50){

        progressFill.style.background =

        "#22C55E";

    }

    else if(percent<80){

        progressFill.style.background =

        "#F59E0B";

    }

    else{

        progressFill.style.background =

        "#EF4444";

    }

}
/*=========================================================
                PART 3A-2
      SETTINGS • STATISTICS • INITIALIZATION
=========================================================*/


/*=========================================================
            UPDATE STATISTICS
=========================================================*/

function updateStatistics(){

    totalExpenseCount.textContent = expenses.length;

    let total = 0;

    let highest = 0;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    let monthlyExpense = 0;

    expenses.forEach(expense=>{

        const amount = Number(expense.amount);

        total += amount;

        if(amount > highest){

            highest = amount;

        }

        const expenseDate = new Date(expense.date);

        if(
            expenseDate.getMonth() === currentMonth &&
            expenseDate.getFullYear() === currentYear
        ){

            monthlyExpense += amount;

        }

    });

    monthExpense.textContent =
        formatMoney(monthlyExpense);

    highestExpense.textContent =
        formatMoney(highest);

}



/*=========================================================
            RENDER EXPENSE TABLE
=========================================================*/

function renderExpenses(){

    expenseTable.innerHTML = "";

    if(expenses.length === 0){

        expenseTable.innerHTML = `

        <tr>

            <td colspan="5">

                No Expenses Added Yet

            </td>

        </tr>

        `;

        return;

    }

    expenses.forEach((expense,index)=>{

        expenseTable.innerHTML += `

        <tr>

            <td>${expense.title}</td>

            <td>${expense.category}</td>

            <td>${formatMoney(expense.amount)}</td>

            <td>${expense.date}</td>

            <td>

                <button
                    class="edit-btn"
                    onclick="editExpense(${index})">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="delete-btn"
                    onclick="openDeleteModal(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}



/*=========================================================
        SAVE SETTINGS
=========================================================*/

saveSettings.addEventListener("click",()=>{

    if(
        income.value.trim()==="" ||
        budget.value.trim()===""
    ){

        showToast(
            "Enter Income & Budget",
            "error"
        );

        return;

    }

    saveData();

    updateDashboard();

    income.disabled = true;

    budget.disabled = true;

    showToast(
        "Settings Saved Successfully",
        "success"
    );

});



/*=========================================================
            EDIT SETTINGS
=========================================================*/

editSettings.addEventListener("click",()=>{

    income.disabled = false;

    budget.disabled = false;

    showToast(
        "Settings Unlocked",
        "info"
    );

});



/*=========================================================
        LOCK INPUTS AFTER RELOAD
=========================================================*/

if(income.value !== ""){

    income.disabled = true;

}

if(budget.value !== ""){

    budget.disabled = true;

}



/*=========================================================
            AUTO UPDATE
=========================================================*/

income.addEventListener("input",updateDashboard);

budget.addEventListener("input",updateDashboard);



/*=========================================================
            DEFAULT DATE
=========================================================*/

date.value = new Date()

.toISOString()

.split("T")[0];



/*=========================================================
            INITIAL LOAD
=========================================================*/

renderExpenses();

updateDashboard();

updateStatistics();

if(typeof updateChart === "function"){

    updateChart();

}



/*=========================================================
            WELCOME MESSAGE
=========================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showToast(

            "🎉 Welcome to Personal Expense Tracker",

            "success"

        );

    },700);

});
/*=========================================================
                PART 3B-1
        ADD • EDIT • DELETE EXPENSE
=========================================================*/


/*=========================================================
            ADD / UPDATE EXPENSE
=========================================================*/

expenseForm.addEventListener("submit", function(e){

    e.preventDefault();

    if(title.value.trim()===""){

        showToast(
            "Enter Expense Title",
            "error"
        );

        return;

    }

    if(amount.value==="" || Number(amount.value)<=0){

        showToast(
            "Enter Valid Amount",
            "error"
        );

        return;

    }

    if(editIndex===-1){

        expenses.push({

            title:title.value.trim(),

            amount:Number(amount.value),

            category:category.value,

            date:date.value

        });

        showToast(
            "Expense Added Successfully",
            "success"
        );

    }

    else{

        expenses[editIndex]={

            title:title.value.trim(),

            amount:Number(amount.value),

            category:category.value,

            date:date.value

        };

        showToast(
            "Expense Updated Successfully",
            "info"
        );

        editIndex=-1;

        addBtn.innerHTML=`
        <i class="fa-solid fa-plus"></i>
        Add Expense
        `;

    }

    saveData();

    renderExpenses();

    updateDashboard();

    updateStatistics();

    if(typeof updateChart==="function"){

        updateChart();

    }

    expenseForm.reset();

    date.value=new Date()
    .toISOString()
    .split("T")[0];

});



/*=========================================================
                EDIT EXPENSE
=========================================================*/

function editExpense(index){

    const expense=expenses[index];

    title.value=expense.title;

    amount.value=expense.amount;

    category.value=expense.category;

    date.value=expense.date;

    editIndex=index;

    addBtn.innerHTML=`
    <i class="fa-solid fa-pen"></i>
    Update Expense
    `;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

    showToast(

        "Editing Expense",

        "warning"

    );

}



/*=========================================================
            DELETE CONFIRMATION
=========================================================*/

function openDeleteModal(index){

    deleteIndex=index;

    deleteModal.style.display="flex";

}



/*=========================================================
            CANCEL DELETE
=========================================================*/

cancelDelete.addEventListener("click",()=>{

    deleteModal.style.display="none";

    deleteIndex=-1;

});



/*=========================================================
            CONFIRM DELETE
=========================================================*/

confirmDelete.addEventListener("click",()=>{

    if(deleteIndex!==-1){

        expenses.splice(deleteIndex,1);

        saveData();

        renderExpenses();

        updateDashboard();

        updateStatistics();

        if(typeof updateChart==="function"){

            updateChart();

        }

        showToast(

            "Expense Deleted",

            "warning"

        );

    }

    deleteModal.style.display="none";

    deleteIndex=-1;

});



/*=========================================================
            CLOSE MODAL
=========================================================*/

window.addEventListener("click",(e)=>{

    if(e.target===deleteModal){

        deleteModal.style.display="none";

        deleteIndex=-1;

    }

});



/*=========================================================
            CLEAR FORM
=========================================================*/

clearBtn.addEventListener("click",()=>{

    editIndex=-1;

    addBtn.innerHTML=`
    <i class="fa-solid fa-plus"></i>
    Add Expense
    `;

    date.value=new Date()
    .toISOString()
    .split("T")[0];

    showToast(

        "Form Cleared",

        "info"

    );

});

/*=========================================================
                PART 3B-2
      SEARCH • FILTER • SORT EXPENSES
=========================================================*/


/*=========================================================
                SORT ORDER
=========================================================*/

let ascending = true;


/*=========================================================
            SEARCH & FILTER
=========================================================*/

function filterExpenses(){

    const searchText =
    searchExpense.value
    .toLowerCase()
    .trim();

    const selectedCategory =
    filterCategory.value;

    const filtered = expenses.filter(expense=>{

        const matchTitle =

        expense.title
        .toLowerCase()
        .includes(searchText);

        const matchCategory =

        selectedCategory==="All" ||

        expense.category===selectedCategory;

        return matchTitle && matchCategory;

    });

    renderFilteredExpenses(filtered);

}



/*=========================================================
        RENDER FILTERED TABLE
=========================================================*/

function renderFilteredExpenses(list){

    expenseTable.innerHTML="";

    if(list.length===0){

        expenseTable.innerHTML=`

        <tr>

            <td colspan="5">

                🔍 No Matching Expense Found

            </td>

        </tr>

        `;

        return;

    }

    list.forEach(expense=>{

        const index =
        expenses.indexOf(expense);

        expenseTable.innerHTML+=`

        <tr>

            <td>${expense.title}</td>

            <td>${expense.category}</td>

            <td>${formatMoney(expense.amount)}</td>

            <td>${expense.date}</td>

            <td>

                <button
                class="edit-btn"
                onclick="editExpense(${index})">

                <i class="fa-solid fa-pen"></i>

                </button>

                <button
                class="delete-btn"
                onclick="openDeleteModal(${index})">

                <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}



/*=========================================================
            LIVE SEARCH
=========================================================*/

searchExpense.addEventListener("keyup",()=>{

    filterExpenses();

});



/*=========================================================
            CATEGORY FILTER
=========================================================*/

filterCategory.addEventListener("change",()=>{

    filterExpenses();

});



/*=========================================================
            SORT AMOUNT
=========================================================*/

sortBtn.addEventListener("click",()=>{

    if(ascending){

        expenses.sort((a,b)=>

            a.amount-b.amount

        );

        showToast(

            "Sorted : Lowest to Highest",

            "info"

        );

    }

    else{

        expenses.sort((a,b)=>

            b.amount-a.amount

        );

        showToast(

            "Sorted : Highest to Lowest",

            "info"

        );

    }

    ascending=!ascending;

    saveData();

    refreshTable();

});



/*=========================================================
            REFRESH TABLE
=========================================================*/

function refreshTable(){

    if(

        searchExpense.value.trim()!=="" ||

        filterCategory.value!=="All"

    ){

        filterExpenses();

    }

    else{

        renderExpenses();

    }

}



/*=========================================================
            RESET FILTERS
=========================================================*/

function resetFilters(){

    searchExpense.value="";

    filterCategory.value="All";

    renderExpenses();

}

/*=========================================================
                PART 3B-3
        CHART • DARK MODE • THEME
=========================================================*/


/*=========================================================
                CHART.JS
=========================================================*/

function updateChart(){

    const categories = {};

    expenses.forEach(expense=>{

        if(categories[expense.category]){

            categories[expense.category] +=
            Number(expense.amount);

        }

        else{

            categories[expense.category] =
            Number(expense.amount);

        }

    });

    const labels = Object.keys(categories);

    const values = Object.values(categories);

    const colors = [

        "#4F46E5",
        "#06B6D4",
        "#22C55E",
        "#EF4444",
        "#F59E0B",
        "#8B5CF6",
        "#EC4899",
        "#14B8A6",
        "#F97316"

    ];

    const ctx =
    document
    .getElementById("expenseChart")
    .getContext("2d");

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx,{

        type:"doughnut",

        data:{

            labels:labels,

            datasets:[{

                data:values,

                backgroundColor:colors,

                borderWidth:2,

                borderColor:"#ffffff"

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    position:"bottom",

                    labels:{

                        color:getComputedStyle(document.body)
                        .color,

                        font:{

                            size:14

                        }

                    }

                }

            },

            animation:{

                animateScale:true,

                animateRotate:true

            }

        }

    });

}



/*=========================================================
            LOAD SAVED THEME
=========================================================*/

const savedTheme =
localStorage.getItem("theme");

if(savedTheme==="dark"){

    document.body.classList.add("dark");

    themeBtn.innerHTML =

    `<i class="fa-solid fa-sun"></i>`;

}



/*=========================================================
            THEME TOGGLE
=========================================================*/

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem(

            "theme",

            "dark"

        );

        themeBtn.innerHTML=

        `<i class="fa-solid fa-sun"></i>`;

        showToast(

            "Dark Mode Enabled 🌙",

            "info"

        );

    }

    else{

        localStorage.setItem(

            "theme",

            "light"

        );

        themeBtn.innerHTML=

        `<i class="fa-solid fa-moon"></i>`;

        showToast(

            "Light Mode Enabled ☀",

            "success"

        );

    }

    updateChart();

});



/*=========================================================
            BUTTON ANIMATION
=========================================================*/

themeBtn.addEventListener("mouseenter",()=>{

    themeBtn.style.transform=

    "rotate(180deg) scale(1.1)";

});

themeBtn.addEventListener("mouseleave",()=>{

    themeBtn.style.transform=

    "rotate(0deg) scale(1)";

});



/*=========================================================
            SORT BUTTON EFFECT
=========================================================*/

sortBtn.addEventListener("mouseenter",()=>{

    sortBtn.style.transform=

    "translateY(-4px)";

});

sortBtn.addEventListener("mouseleave",()=>{

    sortBtn.style.transform=

    "translateY(0)";

});



/*=========================================================
        SAVE THEME BEFORE EXIT
=========================================================*/

window.addEventListener("beforeunload",()=>{

    if(document.body.classList.contains("dark")){

        localStorage.setItem(

            "theme",

            "dark"

        );

    }

    else{

        localStorage.setItem(

            "theme",

            "light"

        );

    }

});



/*=========================================================
        INITIAL CHART LOAD
=========================================================*/

updateChart();
/*=========================================================
                PART 3B-4
        FINAL FEATURES & INITIALIZATION
=========================================================*/


/*=========================================================
            RESET EXPENSES ONLY
=========================================================*/

function resetExpenses(){

    if(!confirm(
        "Are you sure you want to delete all expenses?"
    )){

        return;

    }

    expenses = [];

    saveData();

    refreshTable();

    updateDashboard();

    updateStatistics();

    updateChart();

    showToast(

        "All Expenses Cleared",

        "warning"

    );

}



/*=========================================================
            RESET EVERYTHING
=========================================================*/

function resetEverything(){

    if(!confirm(
        "Reset complete application?\n\nIncome, Budget and Expenses will be deleted."
    )){

        return;

    }

    localStorage.clear();

    expenses = [];

    income.value = "";

    budget.value = "";

    expenseForm.reset();

    income.disabled = false;

    budget.disabled = false;

    saveData();

    refreshTable();

    updateDashboard();

    updateStatistics();

    updateChart();

    showToast(

        "Application Reset Successfully",

        "success"

    );

}



/*=========================================================
            REFRESH BUTTON
=========================================================*/

refreshBtn.addEventListener("click",()=>{

    const option = prompt(

`Choose an option

1 = Reset Expenses Only

2 = Reset Everything`

    );

    if(option==="1"){

        resetExpenses();

    }

    else if(option==="2"){

        resetEverything();

    }

    else if(option!==null){

        showToast(

            "Invalid Option",

            "error"

        );

    }

});



/*=========================================================
            FLOATING BUTTON
=========================================================*/

floatingBtn.addEventListener("click",()=>{

    document

    .querySelector(".form-section")

    .scrollIntoView({

        behavior:"smooth"

    });

    title.focus();

});



/*=========================================================
            SHOW / HIDE FLOAT BUTTON
=========================================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY>250){

        floatingBtn.style.opacity="1";

        floatingBtn.style.visibility="visible";

    }

    else{

        floatingBtn.style.opacity=".8";

    }

});



/*=========================================================
            KEYBOARD SHORTCUTS
=========================================================*/

document.addEventListener("keydown",(e)=>{

    /* Ctrl + S */

    if(e.ctrlKey && e.key.toLowerCase()==="s"){

        e.preventDefault();

        title.focus();

        showToast(

            "Ready to Add Expense",

            "info"

        );

    }

    /* Ctrl + R */

    if(e.ctrlKey && e.key.toLowerCase()==="r"){

        e.preventDefault();

        refreshBtn.click();

    }

    /* Escape */

    if(e.key==="Escape"){

        deleteModal.style.display="none";

    }

});



/*=========================================================
            AUTO SAVE
=========================================================*/

setInterval(()=>{

    saveData();

},30000);



/*=========================================================
            WELCOME MESSAGE
=========================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        showToast(

            "🎉 Welcome to Personal Expense Tracker",

            "success"

        );

    },1000);

});



/*=========================================================
            FINAL INITIALIZATION
=========================================================*/

refreshTable();

updateDashboard();

updateStatistics();

updateChart();



/*=========================================================
            DEVELOPER MESSAGE
=========================================================*/

console.log(

`========================================

Personal Expense Tracker

Version : 2.0

Developed Using
HTML
CSS
JavaScript
Chart.js

========================================`

);