(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
    LCC.Modules = LCC.Modules || {};

    LCC.Modules.InitMap = function () {
        this.start = function (element) {

            function initMap() {
                var googleMapElem = document.getElementById('googleMap');
                var latitude = googleMapElem.getAttribute('data-lat');
                var longitude = googleMapElem.getAttribute('data-long');
                var venueLatLng = new google.maps.LatLng(latitude, longitude);

                var leedsCityCenterLatLng = { lat: 53.800755, lng: -1.549077 };
                var map = new google.maps.Map(googleMapElem, {
                    zoom: 12,
                    center: latitude && longitude ? venueLatLng : leedsCityCenterLatLng
                });

                if (latitude && longitude) {
                    var marker = new google.maps.Marker({
                        position: venueLatLng,
                        map: map
                    });
                }
            }
            jQuery(document).ready(function () {
                initMap();
                if ($(".sectionThree")) {
                    if (!$(".sectionThree")[0]) {
                        $("[href='#sectionThree']").parent().hide();
                    }
                }
                if ($('.timetableHeader').length === 0) {
                    $("[href='#sectionTwo']").parent().hide();
                    if ($('#MSOSPWebPartManager_DisplayModeName').attr('value') === "Browse") {
                        $(".sectionTwo").hide();
                    }
                }
            });

        }

    };

    global.LCC = LCC;
})(window, jQuery);