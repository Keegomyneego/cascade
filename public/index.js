;(function () {
  'use strict'

  $(document).ready(function () {
    $('body').load('views/cascade.html', function () {
      $.get('views/cascade.js').done(function () {
        ko.applyBindings()
      })
    })
  })
})()
