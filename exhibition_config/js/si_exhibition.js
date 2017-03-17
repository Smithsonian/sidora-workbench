/*
 * Copyright 2015 Smithsonian Institution.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License.You may obtain a copy of
 * the License at: http://www.apache.org/licenses/
 *
 * This software and accompanying documentation is supplied without
 * warranty of any kind. The copyright holder and the Smithsonian Institution:
 * (1) expressly disclaim any warranties, express or implied, including but not
 * limited to any implied warranties of merchantability, fitness for a
 * particular purpose, title or non-infringement; (2) do not assume any legal
 * liability or responsibility for the accuracy, completeness, or usefulness of
 * the software; (3) do not represent that use of the software would not
 * infringe privately owned rights; (4) do not warrant that the software
 * is error-free or will be maintained, supported, updated or enhanced;
 * (5) will not be liable for any indirect, incidental, consequential special
 * or punitive damages of any kind or nature, including but not limited to lost
 * profits or loss of data, on any basis arising from contract, tort or
 * otherwise, even if any of the parties has been warned of the possibility of
 * such loss or damage.
 *
 *
 * This distribution includes several third-party libraries, each with their own
 * license terms. For a complete copy of all copyright and license terms, including
 * those of third-party libraries, please see the product release notes.
 */

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
