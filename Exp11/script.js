
/* --------------------------------
   IMPORT FUNCTIONS FROM MODULE
-------------------------------- */

import {
    classSchedule,
    getScheduleState,
    formatTime
} from "./schedule.js";


/* --------------------------------
   GET HTML ELEMENTS
-------------------------------- */

const clock = document.getElementById("clock");

const dateDisplay = document.getElementById("date");

const currentClass = document.getElementById("currentClass");

const currentLabel = document.getElementById("currentLabel");

const classInfo = document.getElementById("classInfo");

const countdown = document.getElementById("countdown");

const countdownLabel = document.getElementById("countdownLabel");

const scheduleList = document.getElementById("scheduleList");

const totalClasses = document.getElementById("totalClasses");

const completedClasses = document.getElementById("completedClasses");

const remainingClasses = document.getElementById("remainingClasses");

const notification = document.getElementById("notification");

const reminderButton = document.getElementById("reminderButton");


/* --------------------------------
   DISPLAY LIVE CLOCK
-------------------------------- */

function updateClock() {

    const now = new Date();

    clock.textContent = now.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hour12: true

    });


    dateDisplay.textContent = now.toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    });

}


/* --------------------------------
   FORMAT COUNTDOWN
-------------------------------- */

function formatCountdown(milliseconds) {

    let totalSeconds = Math.max(

        0,

        Math.floor(milliseconds / 1000)

    );

    const hours = Math.floor(totalSeconds / 3600);

    const minutes = Math.floor((totalSeconds % 3600) / 60);

    const seconds = totalSeconds % 60;


    return (

        String(hours).padStart(2, "0") + ":" +

        String(minutes).padStart(2, "0") + ":" +

        String(seconds).padStart(2, "0")

    );

}


/* --------------------------------
   DISPLAY CLASS SCHEDULE
-------------------------------- */

function displaySchedule(now) {

    scheduleList.innerHTML = "";


    const currentMinutes =

        now.getHours() * 60 + now.getMinutes();


    classSchedule.forEach(function(cls) {

        const [startHour, startMinute] = cls.time.split(":").map(Number);

        const [endHour, endMinute] = cls.end.split(":").map(Number);


        const startTime = startHour * 60 + startMinute;

        const endTime = endHour * 60 + endMinute;


        let status = "";

        let statusClass = "";


        if (currentMinutes >= startTime && currentMinutes < endTime) {

            status = "Ongoing";

            statusClass = "ongoing";

        }

        else if (currentMinutes >= endTime) {

            status = "Completed";

            statusClass = "completed";

        }

        else {

            status = "Upcoming";

            statusClass = "upcoming";

        }


        const row = document.createElement("div");

        row.className = "class-row";


        if (status === "Ongoing") {

            row.classList.add("active");

        }


        row.innerHTML = `

            <div class="class-time">

                <strong>${formatTime(cls.time)}</strong>

                <small>${formatTime(cls.end)}</small>

            </div>


            <div class="class-details">

                <h3>${cls.subject}</h3>

                <p>${cls.faculty} | ${cls.room}</p>

            </div>


            <span class="class-status ${statusClass}">

                ${status}

            </span>

        `;


        scheduleList.appendChild(row);

    });

}


/* --------------------------------
   UPDATE CLASS INFORMATION
-------------------------------- */

function updateClassStatus(now) {

    const state = getScheduleState(now);


    if (state.type === "ongoing") {

        currentLabel.textContent = "Currently In Progress";

        currentClass.textContent = state.current.subject;

        classInfo.textContent =

            "Faculty: " + state.current.faculty +

            " | Room: " + state.current.room +

            " | Ends at: " + formatTime(state.current.end);


        countdownLabel.textContent = "Class Ends In";

    }


    else if (state.type === "upcoming") {

        currentLabel.textContent = "Next Upcoming Class";

        currentClass.textContent = state.next.subject;

        classInfo.textContent =

            "Faculty: " + state.next.faculty +

            " | Room: " + state.next.room +

            " | Starts at: " + formatTime(state.next.time);


        countdownLabel.textContent = "Class Starts In";

    }


    else {

        currentLabel.textContent = "Today's Classes Completed";

        currentClass.textContent = state.next.subject;

        classInfo.textContent =

            "All today's classes are over. Your next class is tomorrow at " +

            formatTime(state.next.time);


        countdownLabel.textContent = "Tomorrow's Class In";

    }


    countdown.textContent = formatCountdown(

        state.target.getTime() - now.getTime()

    );

}


/* --------------------------------
   UPDATE STATISTICS
-------------------------------- */

function updateStatistics(now) {

    const currentMinutes =

        now.getHours() * 60 + now.getMinutes();


    let completed = 0;


    classSchedule.forEach(function(cls) {

        const [hours, minutes] = cls.end.split(":").map(Number);

        const endMinutes = hours * 60 + minutes;


        if (currentMinutes >= endMinutes) {

            completed++;

        }

    });


    totalClasses.textContent = classSchedule.length;

    completedClasses.textContent = completed;

    remainingClasses.textContent =

        classSchedule.length - completed;

}


/* --------------------------------
   MAIN DASHBOARD UPDATE
-------------------------------- */

function updateDashboard() {

    const now = new Date();


    updateClock();

    updateClassStatus(now);

    updateStatistics(now);

    displaySchedule(now);

}


/* --------------------------------
   SHOW NOTIFICATION
-------------------------------- */

function showNotification(message) {

    notification.textContent = message;

    notification.style.display = "block";


    setTimeout(function() {

        notification.style.display = "none";

    }, 3000);

}


/* --------------------------------
   CLASS REMINDER USING setTimeout()
-------------------------------- */

reminderButton.addEventListener("click", function() {

    showNotification(

        "Your class reminder is set! You will be notified in 5 seconds."

    );


    setTimeout(function() {

        showNotification(

            "Reminder: Check your class schedule!"

        );

    }, 5000);

});


/* --------------------------------
   INITIALIZE DASHBOARD
-------------------------------- */

updateDashboard();


/* --------------------------------
   REAL-TIME UPDATE USING setInterval()
-------------------------------- */

setInterval(function() {

    updateDashboard();

}, 1000);


/* --------------------------------
   WELCOME NOTIFICATION USING setTimeout()
-------------------------------- */

setTimeout(function() {

    showNotification(

        "Welcome! Your Smart Class Schedule is ready."

    );

}, 1500);


console.log("Smart Class Schedule loaded successfully.");

console.log("ES6 Modules and JavaScript Timers are working.");

