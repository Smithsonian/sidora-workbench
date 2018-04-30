window.sidora_util = {
  "lock":{
    "locks":  [],
    "keepAliveStarted": false,
    "keepAliveHeartbeatSeconds": 10
  }
};
sidora_util.lock.Obtain = function(pid, callback){
  if (typeof(pid) == 'undefined'){
    console.log("Attempted to obtain lock on undefined pid");
    return false;
  }
  if (typeof(callback) == 'undefined') callback = function(){};
  //If trying to obtain a lock already
  for (var i = 0; i < this.locks.length; i++){
    var currLock = this.locks[i];
    if (!currLock.killed && currLock.pid == pid){
      console.log("attempted to reobtain lock for:"+pid);
      if (currLock.firstAttemptAjaxArguments == null){
        var ofa = currLock.onFirstAttempt;
        var newCallback = function(args){
          ofa(args);
          callback(args);
        }
        currLock.onFirstAttempt = newCallback;
      }else{
        callback(currLock.firstAttemptAjaxArguments); 
      }
      return;
    }
  }
  
  var myNewLock = {
    "pid":pid,
    "killed":false,
    "onFirstAttempt":callback,
    "numBeats": 0,
    "firstAttemptAjaxArguments":null
  };
  
  this.locks.push(myNewLock);
  this.Renew();
}
sidora_util.lock.Renew = function(){
  for (var i = 0; i < this.locks.length; i++){
    var currLock = this.locks[i];
    var pid = this.locks[i].pid;
    var killed = this.locks[i].killed;
    if (!killed){
      var url = Drupal.settings.basePath+"sidora/ajax_parts/lock/"+pid+"/renew";
      jQuery.ajax({
        "url":url
      }).done(function(){
        currLock.numBeats++;
        if (currLock.numBeats == 1){
          currLock.firstAttemptAjaxArguments = arguments;
          currLock.onFirstAttempt(arguments); 
        }
      });
    }
  }
}
sidora_util.lock.KeepAlive = function(){
  if (!this.keepAliveStarted){
    this.keepAliveStarted = true;
    this._KeepAliveRecursion();
  }
}
sidora_util.lock._KeepAliveRecursion = function(){
  var myself = this;
  //If they are all killed don't do any more
  var atLeastOne = false;
  for (var i = 0; i < this.locks.length && (atLeastOne == false); i++){
    if (!this.locks[i].killed) atLeastOne = true;
  } 
  if (atLeastOne){
    this.Renew();
    setTimeout(function(){
      myself._KeepAliveRecursion();
    }, this.keepAliveHeartbeatSeconds * 1000);
  }else{
    this.keepAliveStarted = false;
  }
}
sidora_util.lock.Release = function(pidToKill){
  for (var i = 0; i < this.locks.length; i++){
    var pid = this.locks[i].pid;
    if (pid == pidToKill) this.locks[i].killed = true;
  }
  var url = Drupal.settings.basePath+"sidora/ajax_parts/lock/"+pid+"/release";
  jQuery.ajax({
    "url":url
  });
}

sidora_util.ParentPid = function(){
  var pid = '';
  var checkAgainst = ["/sidora/create_concept","/sidora/create_resource","/sidora/edit_metadata","/sidora/edit_metamulti"];
  for (var i = 0; i < checkAgainst.length; i++){ 
    var piecesToCheck = checkAgainst[i];
    var ptcLocation = window.location.href.indexOf(piecesToCheck);
    if (ptcLocation > -1){
      var section = window.location.href.substring(ptcLocation+piecesToCheck.length+1);
      var endPidLocation = section.indexOf("/");
      if (endPidLocation == -1){
        pid = section;
      }else{
        pid = section.substring(0,section.indexOf("/"));
      }
    }
  }
  return decodeURIComponent(pid);
}
sidora_util.ajaxUrl = function(count){
  var pidsBeingProcessedString = sidora_util.ParentPid();
  var pidsBeingProcessedArray = pidsBeingProcessedString.split("&");
  var pidsInUrl = window.location.href.indexOf(pidsBeingProcessedString)
  var baseUrl = window.location.href.substr(0,pidsInUrl);
  return baseUrl+pidsBeingProcessedArray[count];
}

/**
 * Intended to block clicking on new items and show the "loading" cursor, but no z-index given
 */
sidora_util.clickBlocker = {};
sidora_util.clickBlocker.block = function(showOrHide) {
  if (showOrHide !== 'hide' && showOrHide !== false && jQuery("#click_blocker").length < 1) {
    jQuery(".content").append("<div id='click_blocker' style='position:absolute;top:0px;left:0px;width:100%;height:100%;cursor:wait;'></div>");
    sidora_util.clickBlocker.started = (new Date()).getTime();
  } else {
    sidora_util.clickBlocker.ended = (new Date()).getTime();
    if (typeof(sidora_util.clickBlocker.started) != 'undefined' && (sidora_util.clickBlocker.ended - sidora_util.clickBlocker.started > 1)){
      jQuery("#click_blocker").css("background","rgba(0,200,0,0.05)").fadeOut("normal",function(){jQuery(this).remove();});
    } else {
      jQuery("#click_blocker").remove();
    }
  }
}
sidora_util.clickBlocker.unblock = function(){this.block(false);}
sidora_util.cachedObjects = {};
sidora_util.cache = function(key, object, ttlSeconds) {
  if (typeof(object) == 'undefined') {
    var cachedObj = sidora_util.cachedObjects[key];
    if (typeof(cachedObj) == 'undefined') {
      return;
    }
    if (Date.now() < cachedObj.expire) {
      return cachedObj.obj;
    }
    delete sidora_util.cachedObjects[key];
    return;
  }
  sidora_util.cachedObjects[key] = {
    'obj' : object,
    'expire' : Date.now() + 1000 * ttlSeconds
  };
}
sidora_util.cacheTidy = function(){
  for (var key in sidora_util.cachedObjects) {
    if (sidora_util.cachedObjects[key].expire > Date.now()) {
      delete sidora_util.cachedObjects[key];
    }
  }
}
sidora_util.cacheClear = function(){
  for (var key in sidora_util.cachedObjects) {
    delete sidora_util.cachedObjects[key];
  }
}
sidora_util.writeCookie = function(name,value,days) {
    var date, expires;
    if (days) {
        date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires;
}
sidora_util.readCookie = function(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}

fixXmlFormsBehavior = function() {
  if (!(Drupal && Drupal.behaviors && Drupal.behaviors.xmlFormElementTabs && Drupal.behaviors.xmlFormElementTabs.tabs)){
    return;
  }
  //Add items to fix the xml form to behave the way SI wants
  Drupal.behaviors.xmlFormElementTabs.tabs.loadPanels = function(collapse, context) {
    var load = '.xml-form-elements-tabs:not(.processed)';
    var collapsible = '.xml-form-elements-tabs-collapsible';
    var collapsed = '.xml-form-elements-tabs-collapsed';
    this.tabs = jQuery(load);
    this.collapsibleTabs = this.tabs.filter(collapsible);
    this.nonCollapsibleTabs = this.tabs.not(collapsible);
    var expandedTabs = this.collapsibleTabs.not(collapsed);
    var collapsedTabs = this.collapsibleTabs.filter(collapsed);
    if (collapsedTabs.length > 0) {
      collapsedTabs.tabs({
        collapsible: true,
        selected: collapse ? -1 : undefined,
        select: this.setCollapsibleIconOnSelect,
        create: this.setCollapsibleIconOnCreate
      });
    }
    if (expandedTabs.length > 0) {
      expandedTabs.tabs({
        collapsible: true,
        select: this.setCollapsibleIconOnSelect,
        create: this.setCollapsibleIconOnCreate
      });
    }
    if (this.nonCollapsibleTabs.length > 0) {
      this.nonCollapsibleTabs.tabs({});
    }
    this.tabs.each(function() {
      var goToNewestTab = true;
      jQuery(this).find('li a:not(.sidora-bound)').addClass('sidora-bound').bind('click', function(){
        var container = jQuery(this).closest(".clear-block").attr('id');
        tabInformationObject = {};
        tabInformationObject.container = container;
        tabInformationObject.tab_selected = jQuery(this).text();
        tabInformationObject.number_of_tabs = jQuery(this).closest('ul').find('li').size();
        var alreadySet = false;
        if (typeof(window.sidora_util) != 'undefined') {
          for (var ti = 0; ti < window.sidora_util.tabInformationBetweenAjaxCalls.length; ti++){
            if (window.sidora_util.tabInformationBetweenAjaxCalls[ti].container == container){
              alreadySet = true;
              window.sidora_util.tabInformationBetweenAjaxCalls[ti] = tabInformationObject;
            }
          }
          if (!alreadySet) {
            window.sidora_util.tabInformationBetweenAjaxCalls.push(tabInformationObject);
          }
        }
      });

      var indexToSelect = 0;
      var container = jQuery(this).closest(".clear-block").attr('id');
      var tabsOfInterest = jQuery("#"+container).find('ul').first().children('li');
      if (typeof(window.sidora_util) == 'undefined') {
        window.sidora_util = {};
      }
      if (typeof(window.sidora_util.tabInformationBetweenAjaxCalls) == 'undefined') {
        window.sidora_util.tabInformationBetweenAjaxCalls = [];
      }
      for (var ti = 0; ti < window.sidora_util.tabInformationBetweenAjaxCalls.length; ti++){
        var tabInformationObject = window.sidora_util.tabInformationBetweenAjaxCalls[ti];
        if (
          tabInformationObject.container == container &&
          tabInformationObject.number_of_tabs == tabsOfInterest.size()
          ){
          for (var tabsIndex = 0; tabsIndex < tabsOfInterest.size(); tabsIndex++) {
            if (jQuery(tabsOfInterest[tabsIndex]).children('a').text() == tabInformationObject.tab_selected) {
              indexToSelect = tabsIndex;
              goToNewestTab = false;
            }
          }
        }
      }

      if (goToNewestTab) {
        indexToSelect = jQuery(this).find('li').length - 1;
      }
      jQuery(this).tabs({
        selected: indexToSelect,         
        active: indexToSelect
      });
    });
  }
}
// SID:542 - overriding drupal behavior for islandora_form_fieldpanel to hide the Move Up & Down buttons when 
// they don't work for nested fieldpanels
fixXmlFormFieldpanelBehavior = function() {
  if (!(Drupal && Drupal.behaviors && Drupal.behaviors.islandora_form_fieldpanel && Drupal.behaviors.islandora_form_fieldpanel.attach)){
    return;
  }
  Drupal.behaviors.sidora = {
    attach: function (context) {
      var paneNames = []; 
      jQuery(".islandora-form-fieldpanel-pane").each(function(){ paneNames.push(jQuery(this).find("input").attr("name"));})
      jQuery.each(paneNames, function( paneIndex, paneName) { 
        var matches = [];
        paneName.replace(/\[(.*?)\]/, function(g0,g1){matches.push(g1);}); 
        if (!isNaN(matches[0])) { 
          jQuery('[name="'+paneName+'"]').parent().parent().children('.ui-fieldpane-move-down-button').css('display','none');
          jQuery('[name="'+paneName+'"]').parent().parent().children('.ui-fieldpane-move-up-button').css('display','none');
        }
      })
    }
  }
}
/* Simple countdown originally from:
http://stackoverflow.com/questions/2064186/how-can-i-make-a-jquery-countdown
 */
// Our countdown plugin takes a callback, a duration, and an optional message
jQuery.fn.countdown = function (callback, duration, message) {
    // If no message is provided, we use an empty string
    message = message || "";
    // Get reference to container, and set initial content
    var container = jQuery(this[0]).html(duration + message);
    // Get reference to the interval doing the countdown
    var countdown = setInterval(function () {
        // If seconds remain
        if (--duration) {
            // Update our container's message
            container.html(duration + message);
        // Otherwise
        } else {
            // Clear the countdown interval
            clearInterval(countdown);
            // And fire the callback passing our container as `this`
            callback.call(container);   
        }
    // Run interval every 1000ms (1 second)
    }, 1000);

};
/*
 * Inject and remove injected styles
 * Modified from injectStyles (since I needed to remove as well) from:
https://css-tricks.com/snippets/javascript/inject-new-css-rules/
 */
function styleInject(rule, name) {
var div = jQuery("<div />", {
    html: '&shy;<style id="styleInject'+name+'">' + rule + '</style>'
  }).children().appendTo("body"); 
}
function styleRemove(name) {
  jQuery("styleInject"+name).remove();
}
/**
 * Get proper location of Dom object on page
 */
function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}
/**
 * Performs a certain action as soon (500ms interval check) as it appears
 * selector - css / jQuery selector for item
 * myFunction - calls this with the selector as the argument
 *
 */

function performWhenDisplayedOnScreen(selector, myFunction) {
  var intervalId = setInterval(function(){
    if (jQuery(selector).length != 0) {
      clearInterval(intervalId);
      myFunction(selector);
    }
  },500);
}
/**
 * Clear the text selection of html elements (useful when dragging things across text)
 */
function clearSelection() {
    if ( document.selection ) {
        document.selection.empty();
    } else if ( window.getSelection ) {
        window.getSelection().removeAllRanges();
    }
}

jQuery(document).ready(function(){
  var pp = sidora_util.ParentPid();
  if (pp != ''){
    sidora_util.lock.Obtain(pp);
    sidora_util.lock.KeepAlive();
  }
  fixXmlFormsBehavior();
  fixXmlFormFieldpanelBehavior();
  jQuery(document).ajaxSend(function(){
    //Don't block on renew calls
    if (!arguments[2].url.endsWith("/renew")){
      sidora_util.clickBlocker.block();
    }
  });
  jQuery(document).ajaxComplete(function(){
    //ALL current AJAX calls have completed, including the lock renews
    if (!arguments[2].url.endsWith("/renew")){
      sidora_util.clickBlocker.block(false);
    }
  });
});
//https://gist.github.com/djKianoosh/7090542
// Some common IE shims... indexOf, startsWith, trim

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    "use strict";
    if (this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}

/*
  IE Doesn't have a .startsWith
*/
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function (str){
    return this.lastIndexOf(str, 0) === 0;
  };
}
// IE < 9 doesn't have a trim() for strings
if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/endsWith#Polyfill
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.lastIndexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}
