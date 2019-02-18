(function ($) {

    //header
    $('.header-right').append('<div class="col-xs-12 nav-btns"><a target="_blank" rel="external" href="https://www.fastdd.co.uk/platinum/start.php?c=Active-Leeds" class="btn btn-lg pull-right btn-secondary nav-btn"><span class="sr-only">External link opens in new window </span>Join Today</a><a target="_blank" rel="external" href="https://sport.leeds.gov.uk/onlinebookings" class="btn btn-lg pull-right btn-main nav-btn"><span class="sr-only">External link opens in new window </span>Book Online</a></div>');
    
    //image gallery
    $("#gallery li img").hover(function () {
        $('#main-img').attr('src', $(this).attr('src'));
    });

    $(document).ready(function () {
        // bind a click event to the 'skip' link
        $(".scroll").click(function (event) {
            var that = this;
            var scrollTo = '#' + that.href.split('#')[1]
            $("body, html").animate({ scrollTop: $(scrollTo).offset().top }, 600, function () {
                $(scrollTo).attr('tabindex', '-1').on('blur focusout', function () {
                    // when focus leaves this element, 
                    // remove the tabindex attribute
                    $(this).removeAttr('tabindex');
                }).focus(); // focus on the content container           
            });

        });
    });


    //external links
    $('a[rel="external"]').attr('target', '_blank');

    //external links
    $('a[rel="pdf"]').attr('target', '_blank');

    //external links
    $('a[rel="doc"]').attr('target', '_blank');

    //equal heights
    ; (function ($, window, document, undefined) {
        'use strict';

        var $list = $('.equalWrapper'),
            $items = $list.find('.equalItem'),
            setHeights = function () {
                $items.css('height', 'auto');

                var perRow = Math.floor($list.width() / $items.width());
                if (perRow == null || perRow < 2) return true;

                for (var i = 0, j = $items.length; i < j; i += perRow) {
                    var maxHeight = 0,
                        $row = $items.slice(i, i + perRow);

                    $row.each(function () {
                        var itemHeight = parseInt($(this).outerHeight());
                        if (itemHeight > maxHeight) maxHeight = itemHeight;
                    });
                    $row.css('height', maxHeight);
                }
            };

        setHeights();
        $(window).on('resize', setHeights);

    })(jQuery, window, document);

    //timetbale hover
    $(function () {
        $(".session").hover(function () {
            $(this).find(".sessionInfo").show();
        }
                        , function () {
                            $(this).find(".sessionInfo").hide();
                        }
                       );
    });


    //stop popover from jumping to top
    $('a.popoverInfo').on('click', function (e) { e.preventDefault(); return true; });

    //stop popover from jumping to top
    $('a.noLink').on('click', function (e) { e.preventDefault(); return true; });

    //stop popover from jumping to top
    $('.sessionInfo h4 a').on('click', function (e) { e.preventDefault(); return true; });

    //timetable filter toggle
    $('a.showClassFilters').click(function () {
        $('.classFilters').toggleClass("active");
        $(this).toggleClass("active");
    });

    //timetable results
    $('a.showTimetableResults').click(function () {
        $('.timetableView').toggleClass("active");
        $(this).toggleClass("active");
    });

    //carousel play + pause
    $('#playButton').click(function () {
        $('#myCarousel').carousel('cycle');
    });
    $('#pauseButton').click(function () {
        $('#myCarousel').carousel('pause');
    });

    /*//expand menu focus
    $('a.utilities').click(function () {
        $(".utilitiesSection").slideToggle("active");
        $(this).toggleClass("active");
        $('.utilitiesSection ul li:nth-child(1) a').addClass("firstItem");
        $('.utilitiesSection ul li a.firstItem').focus();
    });

    $('a.main-menu').click(function () {
        $('#main-menu').toggleClass("active");
        $(this).toggleClass("active");
        $('#main-menu ul.root li:nth-child(1) a').addClass("firstItem");
        $('#main-menu ul.root li ul li a').removeClass("firstItem");
        $('#main-menu ul.root li a.firstItem').focus();
    });*/


    //membership table reveal
    $(function () {
        $("#showmemberships a").click(function () {
            $(".memberships").toggleClass("hidememberships");
            $("#showmemberships a").toggleClass("active");
        });
    });



    //search toggle
    $('.navbar a.search').click(function () {
        $('#nav-search').slideToggle("fast");
        $(this).toggleClass("active");
        $('#searchWebsite').focus();
    });

    $('#myTab a').click(function (e) {
        e.preventDefault()
        $(this).tab('show')
    })

}(jQuery));