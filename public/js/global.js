
jQuery.noConflict();

(function ($) {
  $('#subscription').submit(function (e) {
    e.preventDefault();

    var self = this;
    var progress = $('.progress');
    var responseD = $('#responseD');

    progress.slideDown(function () {
      $.post('/subscribe', $(self).serialize())
      
      .done(function (res) {
        self.reset();

        progress.slideUp(function () {
          responseD.addClass('alert-success').html($('<strong>' + res + '</strong>')).slideDown('slow');
        });
          
        setTimeout(function () { 
          responseD.slideUp(function () {
            responseD.removeClass('alert-success');
          }); 
        }, 10 * 1000);
      }) 
      
      .fail(function (res) {
        self.reset();

        progress.slideUp(function () {
          responseD.addClass('alert-error').html($('<strong>' + res + '</strong>')).slideDown();
        });
          
        setTimeout(function () { 
          responseD.slideUp(function () {
            responseD.removeClass('alert-error');
          }); 
        }, 10 * 1000);
      });
    });
  });
})(jQuery);