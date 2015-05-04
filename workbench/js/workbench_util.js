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
jQuery(document).ready(function(){
  var pp = sidora_util.ParentPid();
  if (pp != ''){
    sidora_util.lock.Obtain(pp);
    sidora_util.lock.KeepAlive();
  }
});
