/*global Vue*/

var app;

(function () {
    
    'use strict';
    
    app = new Vue({
        
        el: "#app",
        data: {
            UTILS: {
                DAYS: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                getDayTotal: function (day) {
                    if (day.start && day.finish && day.lunch) {
                        var date1 = new Date(2000, 0, 1, day.start.substr(0, 2), day.start.substr(3, 2)),
                            date2 = new Date(2000, 0, 1, day.finish.substr(0, 2), day.finish.substr(3, 2)),
                            diff = date2 - date1 - (day.lunch * 60 * 60 * 1000); // milliseconds
                        return (diff / 1000 / 60 / 60).toFixed(2); // hours
                    }
                },
                getWeekTotal: function (week) {
                    var self = this,
                        total = 0;
                    this.DAYS.forEach(function (day) {
                        var dayTotal = parseFloat(self.getDayTotal(week[day]));
                        if (dayTotal) {
                            total = total + dayTotal;
                        }
                    });       
                    return total;
                },
                getCumulativeTotal: function (weekIndex, data) {
                    var total = data.startHours,
                        i;
                    for (i = 0; i <= weekIndex; i = i + 1) {
                        total = total + (this.getWeekTotal(data.weeks[i]) - 37);
                    }
                    return total;
                }
            },
            data: {
                weeks: [], 
                startHours: 0
            }
        },
        methods: {
            addWeek: function () {
                var weekObj = {};
                this.UTILS.DAYS.forEach(function (day) {
                    weekObj[day] = {
                        start: "",
                        end: "",
                        lunch: null
                    };
                });
                this.data.weeks.push(weekObj);
            },
            save: function () {
                if (this.data.weeks.length) {
                    window.localStorage.setItem("timesheet", JSON.stringify(this.data));
                }
            },
            editNote: function (weekIndex, day) {
                var notes = window.prompt("Note", this.data.weeks[weekIndex][day].notes || "");
                if (notes) { // i.e. don't overwrite if user pressed cancel
                    this.data.weeks[weekIndex][day].notes = notes;
                    this.save();
                }
            },
            download: function () {
                var uriContent = "data:application/octet-stream," + encodeURIComponent(JSON.stringify(this.data));
                window.open(uriContent, 'timesheet.json');
            }
        },
        created: function () {
            var dataStr = window.localStorage.getItem("timesheet");
            if (dataStr) {
                this.data = JSON.parse(dataStr);
            }
        }
        
    });
    
}());