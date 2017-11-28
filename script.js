"use strict";

(function() {
    var nextURL;
    var windowHeight;
    var documentHeight;
    var scrollTop;
    var didScroll = false;
    

    if (window.location.search.indexOf("scroll=infinite") == 1) {
        $(window).scroll(function() {
            didScroll = true;
        });
        
        setInterval(function() {
            if (didScroll) {
                didScroll = false;
                scrollTop = $(window).scrollTop();
                windowHeight = $(window).height();
                documentHeight = $(document).height();
                if (windowHeight + scrollTop == documentHeight) {
                    if (nextURL) {
                        $.ajax({
                            url: nextURL,
                            method: "GET",
                            success: function(data) {
                                data = data.artists || data.albums;
                                nextURL = data.next;
                                $("#resultsDiv").append(getResults(data.items));
                            }
                        });
                        nextURL = null;
                    }
                }
            }
        }, 500);
    }

    $("#go").on("click", function() {
        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            method: "get",
            data: {
                q: $("#input").val(),
                type: $("#artalb").val(),
            },
            success: function(data) {
                data = data.artists || data.albums;
                nextURL = data.next;
                $("#resultsDiv").html(getResults(data.items));
                if (data.items.length != 0) { 
                    $("#resultsDiv").prepend("<h1>Results for: " + $("#input").val() + "</h1>");
                } else {
                    $("#resultsDiv").html("<h1>No results found</h1>");
                }
            }
        });
    });

    $("#next").on("click", function() {
        $.ajax({
            url: nextURL,
            method: "GET",
            success: function(data) {
                data = data.artists || data.albums;
                nextURL = data.next;
                $("#resultsDiv").append(getResults(data.items));
            }
        });
    });

    function getResults(items) {
        var resulthtml = '';
        for (var i = 0; i < items.length; i++) {
            resulthtml += "<a class='item' href='" + items[i].external_urls.spotify + "'>";
            if (items[i].images[0]) {
                resulthtml += "<img class='image' src='" + items[i].images[0].url + "'>";
            } else {
                resulthtml += "<img class='image' src='default.gif'>";
            }
            resulthtml += "<span class='name'>" + items[i].name + "</span></a>";
        }
        if (nextURL) { 
            nextURL = nextURL.replace('https://api.spotify.com/v1/search', 'https://elegant-croissant.glitch.me/spotify'); 
        }
        if (nextURL && window.location.search.indexOf("scroll=infinite") == -1) {
            $("#next").css("display", "inline-block");
        } else {
            $("#next").css("display", "none");
        }
        return resulthtml;
    }
})();       

