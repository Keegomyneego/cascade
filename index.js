(function () {
	"use strict";

	$(document).ready(function () {
		$("body").load("views/cascadeView.html", function () {
            console.log("loaded view");
			$.get("/scripts/views/cascadeViewModel.js").done(function () {
                console.log("loaded view model");
				ko.applyBindings();
			});
		});
	});
}());