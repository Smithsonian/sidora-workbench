jQuery(document).ready(function(){
  resetMenu("concept-menu");
  resetMenu("resource-menu");
});
var resetMenu = function(menuId){
  jQuery("#"+menuId).addClass("jMenu");
  jQuery("#"+menuId+" li a").unbind("click.openMenu mouseenter").bind("click.openMenu mouseenter",function(event){
    var openItems = jQuery(".jMenu ul li:visible").parent();
    for(var i = 0; i < openItems.length; i++){
      if (!isInParentList(jQuery(this),openItems[i])){
        jQuery(openItems[i]).hide();
      }
    }
    var myWidth = jQuery(this).parent().width();
    var myHeight = jQuery(this).parent().height();
    var ulOfInterest = jQuery(this).parent().children("ul");
    if (ulOfInterest.length == 0) return;
    ulOfInterest.show();
    ulOfInterest.css("width","");
   /* Mod added by RA on 3/11/15 to fix the issue where the concept dropdown menu widths were changing on each load */
	  var prefWidth = '0';
		if (ulOfInterest.css("position") != "relative"){ // eof - RA mod
		var prefWidth = ulOfInterest[0].scrollWidth; //Math.max(ulOfInterest[0].scrollWidth + 10, ulOfInterest.width());
	  }
		ulOfInterest.css("height","0");
  	ulOfInterest.css("position","relative");
    isFirstLevel = !(jQuery(this).parent().parent().parent().is('li'));
    if (!isFirstLevel){
      ulOfInterest.css("top","-"+myHeight+"px");
      ulOfInterest.css("left",myWidth+"px");
    }
    ulOfInterest.css("width","0px");
    //check if any of them are newly added and not widthed properly
    var toCheckSet = ulOfInterest.children("li");
    /* Mod added by RA on 3/11/15 to fix the issue where the concept dropdown menu widths were changing on each load */
		if ((prefWidth == '0') && (toCheckSet.length > 0)){
		  prefWidth = toCheckSet[0].scrollWidth;
		}	
		// eof RA - mod
		for(var i = 0; i < ulOfInterest.length; i++){
      var liOfInterest = jQuery(ulOfInterest[i]);
      if (liOfInterest.css("width") == "0px" || liOfInterest.width() < 1) 
         ulOfInterest.children("li").css("width",prefWidth+"px");
    }  
    jQuery(this).parent().css("height",myHeight+"px");
    jQuery(this).parent().css("width",myWidth+"px");
    event.stopPropagation();
  });
}

var isInParentList = function(child, possibleParent){
  var currentCheck = jQuery(child);
  while (currentCheck.length > 0 && !currentCheck.is(jQuery("body"))){
    if (currentCheck.is(jQuery(possibleParent))) return true;
    currentCheck = currentCheck.parent();
  }
  return false;
}
var closeJMenus = function(){
  jQuery(".jMenu ul").hide();
}
jQuery("html").unbind("click",closeJMenus);
jQuery("html").bind("click",closeJMenus);
jQuery(".jMenu li").unbind("mouseleave").bind("mouseleave",closeJMenus);
