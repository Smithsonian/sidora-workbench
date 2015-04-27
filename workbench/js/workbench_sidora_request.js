var SidoraRequest = function(userFriendlyNameOrFullObject, ajaxRequestUrl, doneFunction, failFunction, pidsBeingProcessed){
  //multi-constructor
  //if only one non-string, then assume it's an object of this type:
  //{
  //  "ajaxRequest": something to go directly into jQuery.ajax
  //  "userFriendlyName": user friendly name
  //  "pidsBeingProcessed": array of pids
  //}
  if (typeof(userFriendlyNameOrFullObject) == 'undefined'){
    return;
  }
  if (typeof(userFriendlyNameOrFullObject) != 'string'){
    this.pullFromConfigObject(userFriendlyNameOrFullObject);
  }else{
		var userFriendlyName = userFriendlyNameOrFullObject;
		if (typeof(pidsBeingProcessed) == 'string') pidsBeingProcessed = [pidsBeingProcessed];
		if (typeof(pidsBeingProcessed) == 'undefined' || !(pidsBeingProcessed instanceof Array)){
			pidsBeingProcessed = [];
		}
		this.fullObject = null;
		this.ajaxRequestUrl = ajaxRequestUrl;
		this.doneFunction = doneFunction;
		this.failFunction = failFunction;
		this.pidsBeingProcessed = pidsBeingProcessed;
		this.userFriendlyName = userFriendlyName;
    
  }
}
SidoraRequest.prototype.isSilent = false;
SidoraRequest.prototype.pullFromConfig = function(configObject){
	this.fullObject = configObject;
	this.pidsBeingProcessed = this.fullObject.pidsBeingProcessed;
	if (typeof(pidsBeingProcessed) == 'undefined'){
		this.pidsBeingProcessed = [];
	}
	this.userFriendlyName = this.fullObject.userFriendlyName; 
  this.pidsBeingProcessed = this.fullObject.pidsBeingProcessed;
  this.isSilent = this.fullObject.isSilent;
}

SidoraRequest.prototype.performAjax = function(){
  var myself = this;
  if (this.fullObject != null){
    console.log("In performAjax of Sidora request to execute this request:"+this.fullObject.ajaxRequest.url);
    jQuery.ajax(this.fullObject.ajaxRequest);
  }else{
    jQuery.ajax({
      url: this.ajaxRequestUrl
    }).done(function(doneInfo){
      myself.doneFunction(doneInfo);
    }).fail(function(failInfo){
      myself.failFunction(failInfo);
    });
  }
}
