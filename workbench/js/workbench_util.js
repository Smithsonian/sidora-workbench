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


jQuery(document).ready(function(){
  var pp = sidora_util.ParentPid();
  if (pp != ''){
    sidora_util.lock.Obtain(pp);
    sidora_util.lock.KeepAlive();
  }
  fixXmlFormsBehavior();
});

