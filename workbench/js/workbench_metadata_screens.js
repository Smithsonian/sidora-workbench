jQuery().ready(function(){
  jQuery("body").css("padding-top","0px");
  jQuery(".content").append("<input id=\"workbench-submit\" class=\"form-submit\" value=\"Submit\"></input>");
  var sidora = window.parent.sidora;
  jQuery("#workbench-submit").click(function(){
    var shouldHaveVals = jQuery(".form-required").closest("div").find("input[type=text]");
    shouldHaveVals.css("border","");

    //Before attempting to submit, see that there are values in the proper places
    var needVals = jQuery(".form-required").closest("div").find("input[type=text]").filter(function(){return this.value == "";});
    //needVals is going to cont1056ain all the blank required inputs
    if (needVals.length > 0){
      needVals.css("border","solid 1px red");
      //Show a pop up indicating which ones still need values?
      var fullHtml = "<div style=\"background:whitesmoke;height:100%\"><div style=\"padding:10px;\"><div>The following items need values:</div>";
      fullHtml += "<ul>";
      for(var i = 0; i < needVals.length; i++){
        fullHtml += "<li>";
        fullHtml += jQuery(needVals[i]).closest(".form-item").find("label")[0].childNodes[0].textContent;
        fullHtml += "</li>";
      }
      fullHtml += "</ul>";
      fullHtml += "</div>"; //padding div
      fullHtml += "</div>"; //100% div

      var sbH = jQuery(window).height() - 600;
      if (sbH < 100) sbH = 400;
      var sbW = 600;
      Shadowbox.open({
            content:    fullHtml,
            player:     "html",
            title:      "Create Concept Form Submission",
            height: sbH,
            width: sbW,//jQuery(window).width()- 600,
            options: {
              onFinish:  function(){}
            }
      });

      return;
    }
    var createCcSuccess = function(parentPid) {
      return function(data) {
        ccSuccessBasic(data, parentPid);
      }
    }
    var ccSuccessBasic = function( data , parentPid) {
        if (data.indexOf("<h2 class=\"element-invisible\">Error message</h2")>0){
          //If not successful, reload the page so that the user can see why
          jQuery("#edit-next").click();
        }else{
          //If successful, kill itself.
          newPid = data.substring(0,data.indexOf(")"+" has been ingested")).substring(data.substring(0,data.indexOf(")"+" has been ingested")).lastIndexOf("si:"))
          newTitle = data.substring(data.indexOf("dcterms:title")+24, data.indexOf('class="dc-title')-2);
          newNodeId = data.substring(data.indexOf("node created for new folder --")+31);
          newNodeId = newNodeId.substring(0,newNodeId.indexOf("--"));
          sidora.util.conceptAddedCompletelyNew(parentPid, newPid, newNodeId, newTitle);

          //sidora.util.RefreshTree(null, parentPid);
          //Guess at how long it will take for Fedora to update the relationships
          //On dev server it's done before these even get called
          //sidora.util.RefreshTreeIfNew(10, parentPid);
          //sidora.util.RefreshTreeIfNew(30, parentPid);
          //sidora.util.RefreshTreeIfNew(60, parentPid);
        }
    };
    var parentPid = sidora_util.ParentPid();
    var ccSuccess = createCcSuccess(parentPid);
    if (parent.location.hash == '#' + parentPid) {
      ccSuccess = function(){ 
        sidora.reloadPage();
      }
    }
    var postData = jQuery("#islandora-ingest-form").serialize()+"&ingest=Ingest";
    if (typeof(sidora) != "undefined"){
      sidora.queue.RequestPost("Create Concept",window.location.href,postData, ccSuccess, function(){}, "","createConcept");
      sidora.queue.Next();
      sidora.CloseIFrame("","concept create");
    }else{
      console.log("Assumed debugging, sending information via Ajax because the parent of this frame does not have a valid sidora object");
      jQuery.ajax({
        type: "POST",
        url: window.location,
        data: postData,
        success: ccSuccess,
        error: function(){
          console.log("Error submitting");
          window.recentThis = this;
          window.recentArgs = arguments;
          },
        dataType: "text"
      });
    }
  });//ends click
});//ends ready
