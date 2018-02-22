(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Sports = LCC.Sports || {};
    LCC.Sports.TimetableControl = LCC.Sports.TimetableControl || {};

    LCC.Sports.TimetableControl = function (timetableSettings) {
        var self = this;

        this.view = {};

        this.view.settings = ko.observable({});

        this.view.settings.bookEventUrl = timetableSettings.onlineBookingUrl;
        this.view.settings.dateFormat = "YYYY-MM-DD";
        this.view.settings.dateTimeFormat = "YYYY-MM-DDTHH:mm:ss";
        this.view.settings.eventPixelPerMinute = 0.7;
        this.view.settings.phoneWindowWidth = 768;
        this.view.settings.timeTableName = ko.observable(timetableSettings.name);
        this.view.settings.timeTableId = timetableSettings.id;
        this.view.settings.tagFilterLabel = ko.observable(timetableSettings.tagFilterLabel);
        this.view.settings.tagFilterValues = timetableSettings.tagFilterValues;
        this.view.settings.isVenuePage = ko.observable(timetableSettings.isVenuePage);
        this.view.settings.venueId = ko.observable(timetableSettings.venueId);
        this.view.settings.numberOfDaysToBookThreshold = ko.observable(timetableSettings.numberOfDaysToBookThreshold);
        this.view.settings.apiBaseUrl = timetableSettings.apiUrl;
        this.view.settings.numberOfItemsPerDayToLoadInitially = timetableSettings.numberOfItemsPerDayToLoadInitially;
        this.view.settings.errorRedirectUrl = timetableSettings.errorRedirectUrl;
        //this.view.settings.apiBaseUrl = "http://api.events-sde-idw.leeds.gov.uk/sports";

        this.view.resultsLoaded = ko.observable(false);
        this.view.resultsCount = ko.observable(0);
        this.view.resultTableHeight = ko.observable(0);

        this.view.filters = ko.observable({});
        this.view.filters.venue = ko.observable("");
        this.view.filters.tagValue = ko.observable("");
        this.view.filters.keyword = ko.observable("");
        this.view.filters.eventSubCategory = ko.observable("");
        this.view.filters.eventCategory = ko.observable(timetableSettings.timetableCategory);
        this.view.filters.day = ko.observable();

        this.view.allEvents = new Array();
        this.view.results = ko.observable({});
        this.view.results.sessions = ko.observableArray([]);
        this.view.results.tags = ko.observableArray([]);
        this.view.results.venues = ko.observableArray([]);
        this.view.results.days = ko.observableArray([]);

        this.view.viewStartDate = ko.observable({});
        this.view.viewEndDate = ko.observable({});

        this.view.results.cache = {};

        this.view.inDayViewMode = ko.computed(function () {
            return (window.innerWidth < self.view.settings.phoneWindowWidth);
        });

        //this.tableHeight = ko.computed(self.getTableHeight,this);

        //Knockout Extension function which adds a property eventHeight to each event.
        ko.extenders.eventHeight = function (target, optional) {
            target().eventHeight = ko.observable(optional);

            var startDateTime = moment(target().start, moment.ISO_8601);
            var endDateTime = moment(target().end, moment.ISO_8601);

            var calculate = function (startDateTime, endDateTime) {
                var height = 1;
                var numberOfMinutes = endDateTime.diff(startDateTime, 'minutes');
                if (numberOfMinutes > 0) {
                    height = numberOfMinutes * self.view.settings.eventPixelPerMinute;
                }
                target().eventHeight(height + "px");
            }

            calculate(startDateTime, endDateTime);

            target.subscribe(calculate);

            return target;
        };

        this.view.results.events = ko.observableArray();

        this.view.showingTimeTableForText = ko.computed(function () {
            var displayText = "THIS WEEK";
            var dateFormatString = "DD MMM YYYY";
            var startDateMoment = moment(this.view.viewStartDate());

            if (!moment().isBetween(moment(this.view.viewStartDate(), moment.ISO_8601), moment(this.view.viewEndDate(), moment.ISO_8601))) {
                var endDateMoment = moment(this.view.viewEndDate());
                displayText = startDateMoment.format(dateFormatString) + " to " + endDateMoment.format(dateFormatString);
            }

            return displayText;
        }, this);

        this.view.getEventDateWithStartAndEndTime = function (data) {
            var startDateMoment = moment(data.start);
            var endDateMoment = moment(data.end);
            var dateLabel = startDateMoment.format('DD/MM/YYYY HH:mm') + "-" + endDateMoment.format('HH:mm');
            return dateLabel;
        };

        this.view.enablePreviousLink = function () {
            $('.previous').removeClass('inactive');
            $(".previous").attr("title", "click to show results from the previous week");
        }

        this.view.disablePreviousLink = function () {
            $('.previous').addClass('inactive');
            $(".previous").removeAttr("title");
        }

        this.view.showPreviousWeek = function () {
            if (self.view.showingTimeTableForText() !== "THIS WEEK") {
                var weekStartDate = moment(self.view.viewStartDate(), moment.ISO_8601);
                var previousWeek = weekStartDate.subtract(7, 'days').toISOString();
                self.view.viewStartDate(previousWeek);
                self.view.viewEndDate(self.calculateEndOfWeekDate(previousWeek));
                self.loadDays();
                self.view.loadEvents();
                if (self.view.showingTimeTableForText() !== "THIS WEEK") {
                    self.view.enablePreviousLink();
                } else {
                    self.view.disablePreviousLink();
                }
            }
            return false;
        };

        this.view.showNextWeek = function () {
            var weekStartDate = moment(self.view.viewStartDate(), moment.ISO_8601);
            var nextWeek = weekStartDate.add(7, 'days').toISOString();
            self.view.viewStartDate(nextWeek);
            self.view.viewEndDate(self.calculateEndOfWeekDate(nextWeek));
            self.loadDays();
            self.view.loadEvents();

            if (typeof $('.previous').attr('title') === 'undefined') {
                self.view.enablePreviousLink();
            }
            return false;
        };

        this.download = function (url, data, method) {
            if (url && data) {
                //data can be string of parameters or array/object
                data = typeof data == 'string' ? data : jQuery.param(data).replace("\+", " ");
                data = data.replace(/\+/g, " ");
                var inputs = '';
                jQuery.each(data.split('&'), function () {
                    var pair = this.split('=');
                    inputs += '<input type="hidden" name="' + pair[0] + '" value="' + pair[1] + '" />';
                });
                //send request
                jQuery('<form action="' + url + '" method="' + (method || 'post') + '">' + inputs + '</form>')
                    .appendTo('body').submit().remove();
            };
        };

        ko.bindingHandlers.postBindData = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

                var data = valueAccessor();

                var recalculate = function () {
                    setTimeout(function () {
                        var containerHeight = $("#classTimetable" + data.timeTableId).height();
                        //console.log("elementHeight:" + $(element).height());
                        //console.log("containerHeight: " + containerHeight);
                        var computedHeight = $(element).height() - containerHeight;
                        //console.log("computedHeight: " + computedHeight);
                        data.heightValue(computedHeight);

                    }, 0);
                }
                data.itemsModel.subscribe(function () {
                    recalculate();
                });
                recalculate();
            }
        };

        this.view.downloadPDF = function (data, event) {
            console.log("Downloading timetable as PDF");

            //check that timetable is expanded before getting all html.
            if (!self.view.isTimeTableExpanded()) {
                self.view.switchToShowAllEventsInTimeTable();
            }

            var apiUrl = self.view.settings.apiBaseUrl + "/pdf";
            var currentTimetable = event.currentTarget.attributes.getNamedItem("data-category").value;
            var content = $("#classTimetable" + currentTimetable).html();

            $.get("_layouts/15/LCC.Sports.SharePoint/Css/printTimetable.css", function (css) {
                var postData = {
                    HtmlContent: content + "<style>" + css + "</style>",
                    ErrorRedirectUrl: self.view.settings.errorRedirectUrl
                }

                self.download(apiUrl, postData, "POST");
            });
        };

        this.view.onEnterKeyDoSearch = function (data, event) {
            if (event.keyCode === 13) {
                self.view.loadEvents();
            }
            return true;
        };

        this.view.hideSummaryInfo = function (data, event) {
            var selector = document.getElementById(event.currentTarget.lastElementChild.id);
            $(selector).hide();
            return false;
        };

        this.view.showSummaryInfo = function (data, event) {
            var selector = document.getElementById(event.currentTarget.lastElementChild.id);
            $(selector).show();
            var controlTooltips = $('[data-toggle="tooltip"]');
            $(controlTooltips).tooltip({ delay: { "show": 300, "hide": 100 } });
            return false;
        };

        this.view.isTimeTableExpanded = function () {
            var expandResultsButtonElementId = '#' + self.view.settings.timeTableId + '-showTimetableResults';
            return $(expandResultsButtonElementId).hasClass('active');
        }

        this.view.toggleExpandTimetableView = function (data, event) {
            var timeTable = $(event.currentTarget);
            $(timeTable).toggleClass("active");
            $(event.currentTarget).toggleClass("active");

            if ($(timeTable).hasClass("active")) {
                self.view.resultsLoaded(false);

                self.view.switchToShowAllEventsInTimeTable();

                self.view.resultsLoaded(true);
            }

            return true;
        };

        this.view.switchToShowAllEventsInTimeTable = function () {
            var underlyingArrayItems = self.view.results.events();
            for (var index = 0; index < underlyingArrayItems.length; index++) {
                var currentEventsShowingForTheDay = underlyingArrayItems[index].events();
                var currentEventsForTheDay = self.view.allEvents[index].events();
                if (currentEventsForTheDay.length > self.view.settings.numberOfItemsPerDayToLoadInitially + 1) {
                    ko.utils.arrayPushAll(currentEventsShowingForTheDay, currentEventsForTheDay.splice(10, currentEventsForTheDay.length));
                }

                self.view.results.events()[index].events.valueHasMutated();
            }
        }

        this.view.compareByEventId = function (originalItem, newItem) {
            return originalItem.id === newItem.id;
        }

        this.view.compareByEventItem = function (originalItem, newItem) {
            return originalItem.id === newItem.id;
        }

        this.view.okToBook = function (data) {
            var eventStart = moment(data.start);
            var eventBookThresholdDate = moment().add(self.view.settings.numberOfDaysToBookThreshold(), 'days');
            var okToBook = (eventStart.isSameOrBefore(eventBookThresholdDate));
            
            if (self.view.settings.timeTableName().toLowerCase().indexOf("swim") >= 0)
            {
                okToBook = false;    // Don't show the 'Book now' button for entries in the Swimming timetable
            }

            console.log("okToBook " + okToBook);
            return okToBook;
        }

        this.view.onBookNow = function (data, event) {
            var bookNowUrl = self.view.settings.bookEventUrl + data.id;
            window.open(bookNowUrl, "_new");
            return false;
        }

        this.view.clearFilters = function () {
            this.filters.eventSubCategory("");
            this.filters.keyword("");
            this.filters.tagValue("");
            this.filters.venue("");
            this.filters.day("");
            self.view.loadEvents();
            return false;
        }

        this.calculateEndOfWeekDate = function (weekStartDate) {
            var weekEndDate = moment(weekStartDate).add(6, 'days');
            return weekEndDate.toISOString();
        }

        this.bindData = function (elementId) {
            var bindingScope = document.getElementById(elementId);
            ko.applyBindings(self.view, bindingScope);
            this.view.resultsLoaded(true);
            return true;
        };

        this.buildEventSearchQueryString = function () {
            var queryString = "/events?pagesize=1000&groupBy=Day&sortBy=startDate&sort=date&hideOccurrences=false";

            var startDate = "&startDate=" + moment(self.view.viewStartDate()).format(self.view.settings.dateTimeFormat);
            var endDate = "&endDate=" + moment(self.view.viewEndDate()).format(self.view.settings.dateTimeFormat);

            //if timetable in day mode and the user has set the day.
            if (self.view.inDayViewMode() && self.view.filters.day()) {
                startDate = "&startDate=" + moment(self.view.filters.day()).startOf('day').format(self.view.settings.dateTimeFormat);
                endDate = "&endDate=" + moment(self.view.filters.day()).endOf('day').format(self.view.settings.dateTimeFormat);
            }

            queryString = queryString + startDate + endDate;

            var query = "";
            if (self.view.filters.keyword() !== "") {
                query = "&q=" + self.view.filters.keyword();

                queryString = queryString + query;
            }

            var venue = "";
            if (self.view.settings.isVenuePage()) {
                venue = "&venue=" + self.view.settings.venueId();
                queryString = queryString + venue;
            } else {
                if (self.view.filters.venue() !== "" && self.view.filters.venue() !== "All") {
                    venue = "&venue=" + self.view.filters.venue();
                    queryString = queryString + venue;
                }
            }

            var category = "";
            if (self.view.filters.eventCategory() !== "" && self.view.filters.eventCategory() !== "All") {
                category = "&cat=" + self.view.filters.eventCategory();
            }

            //override the category query string if a user has selected a sub category (session) filter.
            if (self.view.filters.eventSubCategory() && self.view.filters.eventSubCategory() !== "All") {
                category = "&cat=" + self.view.filters.eventSubCategory();
            }

            queryString = queryString + category;


            var tagFilter = "";
            if (self.view.filters.tagValue() !== "" && self.view.filters.tagValue() !== "All") {
                tagFilter = "&tag=" + self.view.filters.tagValue();
                queryString = queryString + tagFilter;
            }

            return queryString;
        }

        this.view.loadEventsFromApi = function () {
            var apiUrl = self.view.settings.apiBaseUrl + self.buildEventSearchQueryString();

            self.view.resultsLoaded(false);
            console.log("Loading events from " + apiUrl);
            var promise = $.Deferred();

            $.ajax({
                type: "GET",
                url: apiUrl,
                dataType: "jsonp",
                contentType: "text/javascript"
            }).then(
                function (data) {

                    self.view.results.events.removeAll();
                    self.view.allEvents = new Array();

                    var numberOfEventsLoaded = 0;

                    for (var index = 0; index < data.length; index++) {

                        var eventResultArray = data[index].events;

                        for (var eventIndex = 0; eventIndex < eventResultArray.length; eventIndex++) {
                            var event = eventResultArray[eventIndex];
                            event = ko.observable(event).extend({ eventHeight: 1 });

                            //process tags array - removing 
                            event().tags.forEach(function (tagEntry, index, array) {
                                var tagEntryResultIndex = self.view.settings.tagFilterValues.indexOf(tagEntry);
                                if (tagEntryResultIndex < 0) {
                                    array.splice(index, 1);
                                }
                            });

                            eventResultArray[eventIndex] = event;
                            numberOfEventsLoaded++;
                        }

                        var resultGroup = data[index];

                        var allResultsGroup = Object.create(data[index]);

                        var numberOfItemsToTakeConstant = self.view.settings.numberOfItemsPerDayToLoadInitially;
                        var numberOfEventsToTake = data[index].events.length > numberOfItemsToTakeConstant ? numberOfItemsToTakeConstant : data[index].events.length;
                        var subSetOfEventResults = eventResultArray.splice(0, numberOfEventsToTake);

                        resultGroup.events = ko.observableArray(subSetOfEventResults);
                        self.view.results.events.push(resultGroup);

                        allResultsGroup.events = ko.observableArray(eventResultArray);

                        self.view.allEvents.push(allResultsGroup);
                    }

                    console.log("loading " + numberOfEventsLoaded + " events");
                    self.view.resultsCount(numberOfEventsLoaded);
                    self.view.resultsLoaded(true);

                    promise.resolve();
                },
                function (xhr, status, errorthrown) {
                    console.log(xhr, status, errorthrown);
                    promise.reject(errorthrown);

                }
                ).catch(function(e){
                    console.log(e.message);
                    console.log(e.stack);
                });
            return promise.promise();
        }

        this.view.loadEvents = function (data, event) {

            var expandResultsButtonElementId = '#' + self.view.settings.timeTableId + '-showTimetableResults';
            var expandResultsDivElementd = '#classTimetable' + self.view.settings.timeTableId;
            $(expandResultsButtonElementId).removeClass('active');
            $(expandResultsDivElementd).removeClass('active');

            if (event === undefined) {
                return self.view.loadEventsFromApi();
            }
            if (event !== undefined && event.target.name !== "days" && event.originalEvent) {
                return self.view.loadEventsFromApi();
            }

            return true;
        };

        this.loadVenues = function () {
            var apiUrl = self.view.settings.apiBaseUrl + "/venues?cat=Leisure%20Centre&pagesize=1000&sort=Name";
            var promise = $.ajax({
                type: "GET",
                url: apiUrl,
                dataType: "jsonp",
                contentType: "text/javascript"
            }).then(
                function (data) {
                    self.view.results.venues.removeAll();
                    self.view.results.venues.push({ id: "", name: "All venues" });

                    console.log("loading " + data.results.length + " venues");
                    for (var index = 0; index < data.results.length; index++) {
                        self.view.results.venues.push(data.results[index]);
                    }
                },
                function (xhr, status, errorthrown) {
                    console.log(xhr, status, errorthrown);

                }
                );

            return promise;
        };

        this.loadSessions = function () {

            var promise = $.Deferred();
            if (self.view.filters.eventCategory().indexOf('\\') > -1) {
                return promise.resolve();
            }

            var apiUrl = self.view.settings.apiBaseUrl + "/events/categories/" + self.view.filters.eventCategory() + "/subcategories?pagesize=1000";
            $.ajax({
                type: "GET",
                url: apiUrl,
                dataType: "jsonp",
                contentType: "text/javascript"
            }).then(
                function (data) {
                    self.view.results.sessions.removeAll();
                    var allSession = { id: "", name: "All sessions" };
                    self.view.results.sessions.push(allSession);
                    console.log("loading " + data.results.length + " sessions");

                    var mainCategory = self.view.filters.eventCategory();
                    var replacementString = mainCategory + "\\";

                    for (var index = 0; index < data.results.length; index++) {
                        var subCategory = data.results[index];
                        subCategory.id = subCategory.name;
                        subCategory.name = subCategory.name.replace(replacementString, "");
                        self.view.results.sessions.push(subCategory);
                    }
                    promise.resolve();
                },
                function (xhr, status, errorthrown) {
                    console.log(xhr, status, errorthrown);
                    promise.reject(errorthrown);
                }
                );
            return promise.promise();
        };

        this.loadTagFilters = function () {
            self.view.results.tags.removeAll();

            var allTagLabel = "All " + self.view.settings.tagFilterLabel();
            var tagOption = { id: "", name: allTagLabel };
            self.view.results.tags.push(tagOption);

            self.view.settings.tagFilterValues.forEach(function (entry) {
                tagOption = { id: entry, name: entry };
                self.view.results.tags.push(tagOption);
            });

        }

        var startOfWeek = moment().startOf('isoWeek').toISOString();
        this.view.viewStartDate(startOfWeek);
        this.view.viewEndDate(this.calculateEndOfWeekDate(startOfWeek));

        this.loadDays = function () {
            var checkDay = moment(this.view.viewStartDate());
            var endDay = moment(this.view.viewEndDate());

            this.view.results.days.removeAll();
            this.view.results.days.push({ id: "", name: "All days" });

            while (checkDay < endDay) {
                var dayInfo = {};
                dayInfo.id = checkDay.format(this.view.settings.dateFormat);
                if (checkDay.isSame(moment(), 'day')) {
                    dayInfo.name = "Today";
                } else {
                    dayInfo.name = checkDay.format("dddd");
                }
                this.view.results.days.push(dayInfo);
                checkDay.add(1, 'days');
            }

        };

        this.refreshHeight = function() {
            //setTimeout(function () {
                

                 var containerName = "#classTimetable" + this.view.settings.timeTableId;
                 console.log(containerName);
                 var containerHeight = $(containerName).height();
                 var timetableDataTable = $("#" + this.view.settings.timeTableId + "-dataTable");
                 console.log("timetableDataTable:" + timetableDataTable.height());
                 console.log("containerHeight: " + containerHeight);
                 var computedHeight = timetableDataTable.height() - 280;
                 console.log("computedHeight: " + computedHeight);
                 this.view.resultTableHeight(computedHeight);
                 //data.heightValue(computedHeight);
                 console.log("resultTableHeight: " + this.view.resultTableHeight());

                var showMoreContainer = $("#" + this.view.settings.timeTableId + "-showTimetableResults");
                if(computedHeight > 0) {
                    $("#" + this.view.settings.timeTableId + "-showTimetableResults").toggle(true);
                }
                console.log("Show more visibility: " + showMoreContainer.is(':visible'));
                
                $(showMoreContainer).removeClass("active");
                $(containerName).removeClass("active");

                self.view.resultsLoaded(true);

            //}, 0);
        }

        return {
            bindData: function (elementId) {
                var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value
                if (!inDesignMode) {
                    self.loadDays();
                    self.loadTagFilters();
                    self.loadVenues().then(self.loadSessions().done(function () {
                        self.view.loadEvents().done(function () {
                            self.bindData(elementId);
                            console.log("binding data for element: " + elementId);
                        }
                        );
                    }));
                }


            },
            refreshHeight: function () {
                self.refreshHeight();
            }, 
            loadEvents: function () {
                return self.view.loadEvents();
            },
            setFilters: function () {

            },
            logerror: function (message) {
                console.log(message);
            },
            loadEventsForWeekCommence: function (weekStartDate) {
                self.view.viewStartDate(weekStartDate);
                self.view.viewEndDate(calculateEndOfWeekDate(weekStartDate));
                this.loadEvents();
            }
        }

    }

    // ko.utils.extend(LCC.Sports.TimetableControl.prototype, {
    //     getTableHeight: function () {
    //         return this.view.resultTableHeight();
    //     },
    // });
    

    global.LCC = LCC;
})(window, jQuery);