//= require knockout-3.4.0
//= require moment
//= require jquery-ui.min
//= require active-timetable
//= require active-behaviour
//= require active-timetabletabs
//= require active-initmaps
//= require google-analytics
//= require google-maps


(function (global, $) {
    "use strict";
    var LCC = global.LCC || {};
	    LCC.SearchResults = LCC.SearchResults || {};

    $(global).on('load', function () {
        LCC.SearchResults.resizeSearchResults();
    });

    $(global).resize(function () {
        LCC.SearchResults.resizeSearchResults();
    });        

    LCC.SearchResults.resizeSearchResults = function () {
        var browserViewport = $(window).width();
        if (browserViewport <= 992) {
            $(".relDate").prependTo(".eventsFilterType.first");
        }
        if (browserViewport > 992) {
            $('.relDate').appendTo('.eventsSearchSort .pull-right');
        }
    }

    global.LCC = LCC;

})(window, jQuery);
(function ($) {
    
    $(document).ready(function () {
        $("input[data-type='datepicker-start']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function(selected) {
                $("input[data-type='datepicker-end']").datepicker("option", "minDate", selected)
            }
        });
        $("input[data-type='datepicker-end']").datepicker({
            defaultDate: null,
            dateFormat: "dd/mm/yy",
            changeMonth: true,
            minDate: 0,
            onSelect: function (selected) {
                $("input[data-type='datepicker-start']").datepicker("option", "maxDate", selected)
            }
        });        
        $('.activitySearchHomeHeader a').click(function () {
            $('.activitySearchHomeContent').slideToggle("slow");
            $('.activitySearchHomeHeader').toggleClass("active");
            
        });
            
        $('.rbEvents').click(function () {
            $(".searchEvents").css('display', 'block');
            $(".searchVenues").css('display', 'none');
            $('.rbEvents input:radio').attr('checked', true);
            $('.rbVenues input:radio').attr('checked', false);

        });
        $('.rbVenues').click(function () {
            $(".searchEvents").css('display', 'none');
            $(".searchVenues").css('display', 'block');
            $('.rbEvents input:radio').attr('checked', false);
            $('.rbVenues input:radio').attr('checked', true);
        });


             jQuery('ul.date-list').each(function () {
      var LiN = jQuery(this).find('li').length;
      if (LiN > 3) {
      jQuery('li', this).eq(2).nextAll().hide().addClass('toggleable');
      jQuery(this).append('<a class="plusMinus">Show more...</a>');
      }
      });
      jQuery('ul.date-list').on('click', '.plusMinus', function () {
      if (jQuery(this).hasClass('active')) {
      jQuery(this).text('Show more...').removeClass('active');
      } else {
      jQuery(this).text('Show less...').addClass('active');
      }
      jQuery(this).siblings('li.toggleable').slideToggle();
      });

    });
})(jQuery);


