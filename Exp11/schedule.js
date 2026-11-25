
/* --------------------------------
   CLASS SCHEDULE DATA
-------------------------------- */

export const classSchedule = [

    {
        subject: "Compiler Construction",
        time: "09:00",
        end: "10:00",
        faculty: "Prof. Sharma",
        room: "Lab 01"
    },

    {
        subject: "Computer Networks",
        time: "10:15",
        end: "11:15",
        faculty: "Prof. Mehta",
        room: "Room 204"
    },

    {
        subject: "JavaScript Programming",
        time: "11:30",
        end: "12:30",
        faculty: "Prof. Verma",
        room: "Lab 03"
    },

    {
        subject: "Database Management",
        time: "13:30",
        end: "14:30",
        faculty: "Prof. Patil",
        room: "Room 105"
    },

    {
        subject: "Artificial Intelligence",
        time: "14:45",
        end: "15:45",
        faculty: "Prof. Joshi",
        room: "Lab 02"
    }

];


/* --------------------------------
   CONVERT TIME INTO DATE
-------------------------------- */

function createDate(time, dayOffset = 0) {

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setDate(date.getDate() + dayOffset);

    date.setHours(hours, minutes, 0, 0);

    return date;

}


/* --------------------------------
   GET CURRENT SCHEDULE STATUS
-------------------------------- */

export function getScheduleState(now = new Date()) {

    const todayClasses = classSchedule.map(function(cls) {

        return {
            ...cls,
            startDate: createDate(cls.time),
            endDate: createDate(cls.end)
        };

    });


    // Find ongoing class

    const current = todayClasses.find(function(cls) {

        return now >= cls.startDate && now < cls.endDate;

    });


    // Find upcoming class

    const upcoming = todayClasses.find(function(cls) {

        return cls.startDate > now;

    });


    // If a class is ongoing

    if (current) {

        return {
            type: "ongoing",
            current: current,
            next: upcoming || null,
            target: current.endDate
        };

    }


    // If an upcoming class exists

    if (upcoming) {

        return {
            type: "upcoming",
            current: null,
            next: upcoming,
            target: upcoming.startDate
        };

    }


    // If all today's classes are over

    const tomorrowFirstClass = {

        ...classSchedule[0],

        startDate: createDate(classSchedule[0].time, 1),

        endDate: createDate(classSchedule[0].end, 1)

    };


    return {

        type: "finished",

        current: null,

        next: tomorrowFirstClass,

        target: tomorrowFirstClass.startDate

    };

}


/* --------------------------------
   FORMAT TIME
-------------------------------- */

export function formatTime(time) {

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();

    date.setHours(hours, minutes, 0, 0);

    return date.toLocaleTimeString("en-IN", {

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });

}
