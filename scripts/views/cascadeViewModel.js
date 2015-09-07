/*jslint browser: true*/
/*global $, jQuery*/

(function () {
    "use strict";

    // Config

    var tileUpdateRate = 1000;

    var tileFadeDuration = 500;
    var tileOpacity = 0.5;

    var tileInitialHue = 0;
    var tileMaxHueShift = 2;

    var tileMinSaturation = 0.2;
    var tileSaturationSpread = 0.4;

    var tileMinLightness = 0.85;
    var tileLightnessSpread = 0.15;

    var tileLightnessDeadZoneLowerBound = 0.97;
    var tileLightnessDeadZoneUpperBound = 0.99;

    // Locals

    var viewHeight = ko.observable($(window).height());
    var viewWidth = ko.observable($(window).width());

    var margin = ko.observable(0);
    var height = ko.computed(function () {
        return viewHeight() - margin();
    });

    var width = ko.computed(function () {
        return viewWidth() - margin();
    });

    var refreshing = false;

    var timer;

    var tileRows = ko.observable(0);
    var tileColumns = ko.observable(0);

    var tileHeight = ko.computed(function () {
        return Math.floor(height() / tileRows() - margin());
    });

    var tileWidth = ko.computed(function () {
        return Math.floor(width() / tileColumns() - margin());
    });

    var tileColor = jQuery.Color().hsla({
        hue:        tileInitialHue,
        saturation: 0.5,
        lightness:  0.75,
        alpha:      tileOpacity
    });

    var updateLoop = (function () {
        var timers = [];
        var blocks = 0;

        var that = {};

        that.start = function () {
            if (blocks === 0) {
                updateTiles();
                timers.push(setInterval(updateTiles, tileUpdateRate));
            } else {
                blocks--;
            }
        };

        that.stop = function () {
            if (timers.length > 0) {
                clearInterval(timers.pop());
            } else {
                blocks++;
            }
        };

        return that;
    }());

    // Get things rolling
    $(document).ready(initialize);
    $(window).resize(function () {
        recalculateWindowSize();

        if (!refreshing) {
            refreshing = true;

            refreshTiles().then(function () {
                refreshing = false;
            });
        }
    });

    // Calls the given function for each tile with the current tile's id
    function forEachTile(callback) {
        var row, col;
        for (row = 1; row <= tileRows(); row += 1) {
            for (col = 1; col <= tileColumns(); col += 1) {
                callback(row, col);
            }
        }
    }

    // Creates the tiles and sets them to auto update
    function initialize() {
        $('#cascade').click(function (e) {
            refreshTiles();
            e.preventDefault();
        });

        $('#pause').click(function (e) {
            updateLoop.stop();
            e.preventDefault();
        });

        $('#resume').click(function (e) {
            updateLoop.start();
            e.preventDefault();
        });

        updateTileSettings();
        updateTilePlacement();

        updateLoop.start();
    }

    function maxTileDelayTime() {
        return tileDelayTime(tileRows(), tileColumns());
    }

    // Makes a new tile of the given height and width and with the given id
    function newTile(row, col) {
        return $("<div></div>")
            .addClass("tile")
            .prop("id", row + "-" + col)
            .css({
                height: tileHeight() + 'px',
                width: tileWidth() + 'px',
                marginLeft: margin() + 'px',
                marginTop: margin() + 'px',
                marginRight: (col === tileColumns() ? margin() - 1 : 0) + 'px',
                marginBottom: (row === tileRows() ? margin() - 1 : 0) + 'px'
            });
    }

    function recalculateWindowSize() {
        viewHeight($(window).height());
        viewWidth($(window).width());
    }

    function refreshTiles() {
        updateLoop.stop();
        updateTileSettings();

        return removeTiles().then(function () {
            updateTilePlacement();
            updateLoop.start();
        });
    }

    function removeTiles() {
        var deferred = $.Deferred();

        forEachTile(function (row, col) {
            setTimeout(function () {
                $("#" + row + "-" + col).animate({
                    backgroundColor: "white"
                }, tileFadeDuration);
            }, tileDelayTime(row, col) / 2);
        });

        setTimeout(function () {
            forEachTile(function (row, col) {
                $("#" + row + "-" + col).remove();
            });

            deferred.resolve();
        }, maxTileDelayTime() + tileFadeDuration);

        return deferred.promise();
    }

    function tileDelayTime(row, col) {
        return (row - 1) * 10 +
               (col - 1) * 10;
    }

    function updateTileSettings() {
        margin($("#margin").val());
    }

    // 
    function updateTilePlacement() {
        tileRows(Number($('#rows').val()));
        tileColumns(Number($('#columns').val()));

        forEachTile(function (row, col) {
            $("#background").append(newTile(row, col));
        });
    }

    // Updates the colors of all the tiles in the window
    function updateTiles() {
        forEachTile(function update(row, col) {
            setTimeout(function () {
                tileColor = jQuery.Color().hsla({
                    hue:        (tileColor.hue() + (Math.random() * tileMaxHueShift)) % 360,
                    saturation: tileMinSaturation + (Math.random() * tileSaturationSpread),
                    lightness:  tileMinLightness + (Math.random() * tileLightnessSpread),
                    alpha:      tileOpacity
                });

                var currentColor = jQuery.Color($("#" + row + "-" + col), "backgroundColor");

                // when to update the Tiles
                if (currentColor.lightness() < tileLightnessDeadZoneLowerBound ||
                    currentColor.lightness() > tileLightnessDeadZoneUpperBound ||
                    currentColor.lightness() == 1) {
                    $("#" + row + "-" + col).animate({
                        backgroundColor: tileColor
                    }, tileFadeDuration);
                }
            }, tileDelayTime(row, col));
        });
    }

}());