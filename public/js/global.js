
jQuery.noConflict();

(function ($) {
  $('#subscription').submit(function (e) {
    e.preventDefault();

    var self = this;
    var loadingBtn = $('#subscribe-btn');
    var updatep = $('#updatep');
    var ogData = updatep.html();
    var timer = 1000 * 10;

    loadingBtn.button('loading');

    $.post('/subscribe', $(self).serialize())
    .done(function (res) {
      updatep.html('<span class="glyphicon glyphicon-ok"></span> Please check your inbox to confirm subscription');
      loadingBtn.button('reset');
      self.reset();

      setTimeout(function () {
        updatep.html(ogData);
      }, timer);
    }) 
    .fail(function (res) {
      updatep.addClass('text-danger').html('<span class="glyphicon glyphicon-remove"></span> Error, subscription failed.');
      loadingBtn.button('reset');
      self.reset();

      setTimeout(function () {
        updatep.removeClass('text-danger').html(ogData);
      }, timer);
    });
  });
})(jQuery);