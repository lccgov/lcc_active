(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};
    LCC.Sports = LCC.Sports || {};
    
    LCC.Modules.TimetableTab = function () {
        this.start = function (element) {

            LCC.Sports.TimetableTab = function (webPartZoneIndexId, webPartZoneClientId) {
                var self = this;
                self.attributeName = "data-timetablename";
                self.webPartZoneClientId = webPartZoneClientId; // This is actually the div containing the tab ul where the tab items will be written to
                self.webPartZoneIndexId = webPartZoneIndexId;
                self.webParts = $('div[' + self.attributeName + ']');



                self.renderTabs = function () {
                    var webPartZone = document.getElementById(self.webPartZoneClientId);
                    var ulElement = document.createElement("ul");

                    var attribute = document.createAttribute("class");
                    attribute.value = "nav nav-tabs timetableTabs";
                    ulElement.setAttributeNode(attribute);

                    attribute = document.createAttribute("role");
                    attribute.value = "tablist";
                    ulElement.setAttributeNode(attribute);

                    if (self.webParts) {
                        for (var webpartindex = 0; webpartindex < self.webParts.length; webpartindex++) {
                            var webPartDiv = self.webParts[webpartindex];

                            //create the <ul><li><a/></li></ul> tabs.
                            var webPartTitle = webPartDiv.getAttribute(self.attributeName);
                            var webPartTitleNoSpaces = webPartTitle.replace(" ", "");

                            var liElement = document.createElement("li");
                            var roleAttribute = document.createAttribute("role");
                            roleAttribute.value = "presentation";
                            liElement.setAttributeNode(roleAttribute);

                            var liElementLink = document.createElement("a");
                            liElementLink.value = webPartTitle;
                            roleAttribute = document.createAttribute("role");
                            roleAttribute.value = "tab";
                            var idAttribute = document.createAttribute("id");
                            idAttribute.value = webPartTitleNoSpaces + "-panel";
                            liElementLink.setAttributeNode(roleAttribute);
                            liElementLink.setAttributeNode(idAttribute);


                            var liElementLinkText = document.createTextNode(webPartTitle);
                            liElementLink.appendChild(liElementLinkText);

                            var ariaControls = document.createAttribute("aria-controls");
                            ariaControls.value = webPartTitleNoSpaces;
                            liElementLink.setAttributeNode(ariaControls);

                            var href = document.createAttribute("data-target");
                            href.value = "#" + webPartTitleNoSpaces;
                            liElementLink.setAttributeNode(href);

                            var dataToggle = document.createAttribute("data-toggle");
                            dataToggle.value = "tab";
                            liElementLink.setAttributeNode(dataToggle);

                            var hookForAccessibilityTabbing = document.createAttribute("href");
                            hookForAccessibilityTabbing.value = "#";
                            liElementLink.setAttributeNode(hookForAccessibilityTabbing);

                            liElement.appendChild(liElementLink);

                            ulElement.appendChild(liElement);
                        }

                    }

                    webPartZone.appendChild(ulElement);

                };
                self.renderTabs();

                self.enableTabs = function () {
                    if ($(".timetableTabs")) {
                        var hideTabs = function () {
                            var tabPanels = $("div.tab-pane");
                            $(tabPanels).removeClass("active");
                        }

                        $(".timetableTabs a").click(function (e) {
                            if ($(this).tab().attr('aria-expanded') !== "true") {
                                //ensure that tabs actually remove the active class when switched
                                hideTabs();
                                $(this).tab("show");
                            }
                            return false;
                        });

                        //enable tabs
                        $(".timetableTabs a").tab();

                        //hide all tabs initially
                        hideTabs();

                        //show first tab
                        var firstTabSelect = $(".timetableTabs li:first-child a");
                        $(firstTabSelect).tab("show");
                    }
                }

                self.enableTabs();

            }

            //this id is the zone index for the TimeTableZone. If web part zones are added to the page be careful as this index id may need to change.
            var timeTableZoneIndex = 1;
            var timeTableTabElementId = 'timetableWebPartZoneDiv';
            SP.SOD.executeOrDelayUntilScriptLoaded(function () {
                var timeTableTabControl = new LCC.Sports.TimetableTab(timeTableZoneIndex, timeTableTabElementId);
            }, "sp.js");
            SP.SOD.executeFunc("sp.js", null, null);

        }

    };

    global.LCC = LCC;
})(window, jQuery);