document.onreadystatechange = (function () {
    const dateInput = document.querySelector("#date");
    const todayDateTime = new Date();
    const isoTodayDateTime = todayDateTime.toISOString();
    const todayIsoDate = isoTodayDateTime.split("T");
    dateInput.min= todayIsoDate[0];
});