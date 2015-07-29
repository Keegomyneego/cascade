/*jslint browser: true*/
/*global $, jQuery*/

(function () {
    "use strict";

    // Makes a new tile of the given height and width and with the given id
    function newTile(id) {
        return $("<div></div>")
            .addClass("tile")
            .prop("id", id)
            .css({
                height: tileHeight + 'px',
                width: tileWidth + 'px'
            });
    }

    // Calls the given function for each tile with the current tile's id
    function forEachTile(callback) {
        var row, col;
        console.log("fET:", tileRows, tileColumns);
        for (row = 1; row <= tileRows; row += 1) {
            for (col = 1; col <= tileColumns; col += 1) {
                callback(row, col);
            }
        }
    }

    function tileDelayTime(row, col) {
        return row * 100 + col * 100;
    }

    // Updates the colors of all the tiles in the window
    function updateTiles() {
        tileColor = tileColor.hue(tileColor.hue() + 4 % 360);

        forEachTile(function update(row, col) {
            setTimeout(function () {
                tileColor = tileColor.hsla({
                    hue:        (tileColor.hue() + (Math.random() * 4)) % 360,
                    saturation: 0.2 + (Math.random() * 0.4),
                    lightness:  0.85 + (Math.random() * 0.15),
                    alpha:      1.0
                });

                var currentColor = jQuery.Color($("#" + row + "-" + col), "backgroundColor"),
                    c = currentColor;

                // when to update the Tiles
                if (c.lightness() < 0.98 || c.lightness() == 1) {
                    $("#" + row + "-" + col).animate({
                        backgroundColor: tileColor
                    }, 500);
                }
            }, tileDelayTime(row, col));
        });
    }

    // 
    function updateTilePlacement() {
        forEachTile(function (row, col) {
            $("#" + row + "-" + col).remove();
        });

        tileRows = $('#rows').val();
        tileColumns = $('#columns').val();

        forEachTile(function (row, col) {
            $("#background").append(newTile(row + "-" + col));
        });
    }

    // Creates the tiles and sets them to auto update
    function live() {
        $('#cascade').click(function (e) {
            updateLoop.stop();

            updateTilePlacement();

            updateLoop.start();

            e.preventDefault();
        });

        forEachTile(function (row, col) {
            $("#background").append(newTile(row + "-" + col));
        });

        updateLoop.start();
    }

    var margin = 10,
        height = $(window).height() - margin,
        width = $(window).width() - margin,
        timer,
        tileRows = 6,
        tileColumns = 10,
        tileHeight = Math.round(height / tileRows - margin),
        tileWidth = Math.round(width / tileColumns - margin),
        tileColor = jQuery.Color({
            hue: 0,
            saturation: 0.5,
            lightness: 0.75,
            alpha: 1.0
        });

    var updateLoop = (function () {
        var timer;

        var that = {};

        that.start = function () {
            updateTiles();
            timer = setInterval(updateTiles, 2000);
        };

        that.stop = function () {
            if (timer) {
                clearInterval(timer);
                timer = undefined;
            }
        };

        return that;
    }());

    // Get things rolling
    $(document).ready(live);
}());