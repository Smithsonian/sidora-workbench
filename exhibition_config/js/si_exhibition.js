function si_exhibition_ds(pid, dsid, title) {
  title = title || '';
  $.ajax({
    type: "GET",
    url: Drupal.settings.basePath + "si/exhibition/datastream",
    cache: false,
    data: {
      pid: pid,
      dsid: dsid
    },
    success: function(data) {
      var width = 960;
      if (dsid == 'CSV') {
        var widthType = 'auto';
      }
      else {
        var widthType = width;
      }
      // @todo Do we actually need this?
      // Evil height check hack.
      var check = $('<div id="height-check"></div>').appendTo('body').html(data.output).css({'float': 'left', 'width': widthType, 'display': 'none'});
      var checkHeight = check.outerHeight(true);
      var checkWidth = check.outerWidth(true);
      // If the rendered width is bigger than our default let it go wider.
      if (checkWidth > width) {
        width = checkWidth;
      }
      var height = checkHeight;
      var windowHeight = $(window).height(true);
      if (checkHeight > windowHeight) {
        var height = windowHeight - 100;
      }
      // dump evidence of evil height check hack. (this hack never happend)
      $('#height-check').remove();
      Shadowbox.open({
        content:    data.output,
        player:     "html",
        title:      decodeURIComponent((title).replace(/\+/g, '%20')),
        gallery:    pid,
        height:     height,
        width:      width + 15 // scroll bar
      });
    },
    dataType: 'json'
  });
  return false; // Prevent Event Propagation
}

function si_exhibition_flexpaper(pid, title) {
  title = title || '';
  Shadowbox.open({
    content:    Drupal.settings.basePath + "si/exhibition/flexpaper/" + pid,
    player:     "iframe",
    title:      decodeURIComponent((title).replace(/\+/g, '%20')),
    gallery:    pid
  });
  return false;
}
