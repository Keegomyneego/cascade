(function () {
	"use strict";

	$(document).ready(function () {
		$("body").load("views/cascadeView.html", function () {
			$.get("scripts/views/cascadeViewModel.js").done(function () {
				ko.applyBindings();
			});
		});
	});
}());
