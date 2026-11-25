
/* -----------------------------------
   GLOBAL VARIABLES
----------------------------------- */

let events = [];

let registeredEvents = JSON.parse(

    localStorage.getItem("registeredEvents")

) || [];



/* -----------------------------------
   LOAD EVENTS USING AJAX
----------------------------------- */

$(document).ready(function() {

    loadEvents();

    updateClock();

    updateStatistics();


    // Real-time clock update

    setInterval(function() {

        updateClock();

    }, 1000);


    // Search event using input event

    $("#searchInput").on("input", function() {

        displayEvents();

    });


    // Filter events using change event

    $("#categoryFilter").on("change", function() {

        displayEvents();

    });


    // Register event using delegated click event

    $("#eventContainer").on("click", ".register-btn", function() {

        let eventId = Number($(this).attr("data-id"));

        registerEvent(eventId);

    });

});



/* -----------------------------------
   AJAX REQUEST USING $.getJSON()
----------------------------------- */

function loadEvents() {

    $("#loadStatus").text("Loading Events...");


    $.getJSON("events.json")


    .done(function(data) {

        events = data;

        displayEvents();

        updateStatistics();

        $("#loadStatus").text("Events Loaded Successfully");

        console.log("Events loaded successfully:", events);

    })


    .fail(function() {

        $("#loadStatus").text("Loading Failed");

        $("#eventContainer").html(

            '<div class="empty">Unable to load events. Please check your connection or JSON file.</div>'

        );

        console.error("Error loading JSON data.");

    });

}



/* -----------------------------------
   DISPLAY EVENTS USING DOM
----------------------------------- */

function displayEvents() {

    let searchText = $("#searchInput").val().toLowerCase();

    let selectedCategory = $("#categoryFilter").val();


    // Filter events

    let filteredEvents = events.filter(function(event) {

        let matchesSearch =

            event.name.toLowerCase().includes(searchText);


        let matchesCategory =

            selectedCategory === "All" ||

            event.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    // Clear previous event cards

    $("#eventContainer").empty();


    // Display message if no events found

    if (filteredEvents.length === 0) {

        $("#eventContainer").html(

            '<div class="empty">No events found. Try another search!</div>'

        );

        return;

    }


    // Create event cards dynamically

    filteredEvents.forEach(function(event) {

        let isRegistered = registeredEvents.includes(event.id);


        let buttonText = isRegistered

            ? "✓ Registered"

            : "Register Now";


        let buttonClass = isRegistered

            ? "register-btn registered"

            : "register-btn";


        let eventCard = `

            <div class="event-card">

                <div class="event-icon">

                    ${event.icon}

                </div>


                <span class="event-category">

                    ${event.category}

                </span>


                <h3>${event.name}</h3>


                <p>${event.description}</p>


                <div class="event-info">

                    📅 ${event.date}<br>

                    🕒 ${event.time}<br>

                    📍 ${event.venue}

                </div>


                <button

                    class="${buttonClass}"

                    data-id="${event.id}"

                    ${isRegistered ? "disabled" : ""}

                >

                    ${buttonText}

                </button>


            </div>

        `;


        // Append card to webpage

        $("#eventContainer").append(eventCard);

    });

}



/* -----------------------------------
   REGISTER FOR AN EVENT
----------------------------------- */

function registerEvent(eventId) {


    // Check if already registered

    if (registeredEvents.includes(eventId)) {

        showMessage("You are already registered!");

        return;

    }


    // Add event ID to array

    registeredEvents.push(eventId);


    // Save registrations in localStorage

    localStorage.setItem(

        "registeredEvents",

        JSON.stringify(registeredEvents)

    );


    // Update webpage

    displayEvents();

    updateStatistics();


    // Find event name

    let selectedEvent = events.find(function(event) {

        return event.id === eventId;

    });


    showMessage(

        "Successfully registered for " + selectedEvent.name + "!"

    );


    console.log("Registration saved:", registeredEvents);

}



/* -----------------------------------
   UPDATE STATISTICS
----------------------------------- */

function updateStatistics() {


    // Total events

    $("#totalEvents").text(events.length);


    // Registered events

    $("#myRegistrations").text(registeredEvents.length);


    // Count unique categories

    let categories = [...new Set(

        events.map(function(event) {

            return event.category;

        })

    )];


    $("#totalCategories").text(categories.length);

}



/* -----------------------------------
   DISPLAY LIVE CLOCK
----------------------------------- */

function updateClock() {

    let now = new Date();


    let time = now.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        second: "2-digit",

        hour12: true

    });


    let date = now.toLocaleDateString("en-IN", {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    });


    $("#clock").text(time);

    $("#date").text(date);

}



/* -----------------------------------
   SHOW NOTIFICATION
----------------------------------- */

function showMessage(text) {

    $("#message")

        .stop(true, true)

        .text(text)

        .fadeIn(300);


    // Hide notification after 3 seconds

    setTimeout(function() {

        $("#message").fadeOut(500);

    }, 3000);

}


