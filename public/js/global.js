
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

  $(document).on('click', '#logouploadbtn', function(e) {
    e.preventDefault();
    $('#logofileinput').trigger('click');
  });


  $('#image-upload-form').on('change', function (e) {

      var cropBoxData;
      var canvasData;
      var cropper;

      var oFReader = new FileReader();
      var _URL = window.URL || window.webkitURL;
      var width;
      var height;

      if (typeof document.getElementById('logofileinput').files[0] !== 'undefined') {

        img = new Image();
        img.onload = function() {
          width = this.width;
          height = this.height;
        };

        img.src = _URL.createObjectURL(document.getElementById('logofileinput').files[0]);
        oFReader.readAsDataURL(document.getElementById('logofileinput').files[0]);

        var size = document.getElementById('logofileinput').files[0].size;

        if ((width > 100 && height > 100) || size > 5000) {

          // All functions that follow are attached to the onload instance of the FileReader
          oFReader.onload = function(oFREvent) {
            document.getElementById('profilePic').src = oFREvent.target.result;

            // Show the imagePreview and manipulate the attributes.
            //$('#profilePic').show();
            $('#profilePic').attr('data-cropped', 'false');


            $('#cropPopup').on('shown.bs.modal', function () {
              var image = document.getElementById('profilePic');

              cropper = new Cropper(image, {
                aspectRatio: 1 / 1,
                viewMode: 2,
                ready: function () {
                  // Strict mode: set crop box data first
                  cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
                }
              });
            })
            .on('hidden.bs.modal', function () {
              cropBoxData = cropper.getCropBoxData();
              canvasData = cropper.getCanvasData();
              cropper.destroy();
            });

            $('#cropPopup').modal('show');
          };
        }
      }

      $(document).on('click', '.crop-image', function(e) {
        var canvas = cropper.getCroppedCanvas();

        canvas.toBlob(function(blob) {
          var data = new FormData();
          var post_url = '/users/upload-image';

          data.append('logo', blob);

          // Ajax Request that posts to the route specified by the POST_URL
          $.ajax({
            url: post_url,

            data: data,

            cache: false,

            processData: false,

            contentType: false,

            type: 'POST',

            success: function(data) {
              if (data.success) {
                // Update the images with the new images
                $('#profileImg').attr('src', data.image_url);
                $('#cropPopup').modal('hide');
              }
              else {
                console.log(data.errorMsg);
              }
            },

            error: function(error) {
              alert(
                error.errorMsg
              );
            }
          });
        }, 'image/jpeg');
      });
    });

})(jQuery);
