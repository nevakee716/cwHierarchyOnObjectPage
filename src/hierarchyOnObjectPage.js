(function(cwApi, $) { 
  "use strict";

    /********************************************************************************
    Custom Action for Single Page : See Impact here http://bit.ly/2qy5bvB
    *********************************************************************************/
    cwCustomerSiteActions.doActionsForSingle_Custom = function (rootNode) { 
        var currentView, url,i;
        currentView = cwAPI.getCurrentView();

        for(i in cwAPI.customLibs.doActionForSingle) {
            if(cwAPI.customLibs.doActionForSingle.hasOwnProperty(i)) {
                if (typeof(cwAPI.customLibs.doActionForSingle[i]) === "function"){
                    cwAPI.customLibs.doActionForSingle[i](rootNode,currentView.cwView);
                }   
            }
        }
    };
    cwCustomerSiteActions.breadCrumbHierarchy = {};
    cwCustomerSiteActions.breadCrumbHierarchy.views = {};

    cwCustomerSiteActions.breadCrumbHierarchy.create = function(rootNode){
        var hierarchyList = document.getElementsByClassName('cw-list BreadcrumbHierarchy')[0];
        var title = document.getElementsByClassName('page-title')[0];
        var hierarchy = document.createElement('div');
        var fragment = document.createDocumentFragment();


        // Store the hierarchy list for the view
        if(cwCustomerSiteActions.breadCrumbHierarchy.views.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) { 
            hierarchy = cwCustomerSiteActions.breadCrumbHierarchy.views[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function
            var listToHide = document.getElementsByClassName('cw-list BreadcrumbHierarchy');
            if(listToHide && listToHide.hasOwnProperty(length) && listToHide !== []) {
                listToHide[0].hidden = true;
            }
        } else if(hierarchyList) { // Create the hierachyList
            fragment.appendChild(hierarchyList);
            hierarchy = cwCustomerSiteActions.breadCrumbHierarchy.createElement(fragment,hierarchy);
            cwCustomerSiteActions.breadCrumbHierarchy.views[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchy;
        } else {
            return;
        }
        
        // put the hierarchy on the title
        if(title && hierarchy) {
            title.insertBefore(hierarchy,title.firstChild);
        }

    };

    cwCustomerSiteActions.breadCrumbHierarchy.createElement = function(elem,hierarchy){
        var childUl,childLi;
        if(elem) {
            if(elem.childElementCount === 0) {
                return hierarchy;
            } else if(elem && elem.childElementCount === 1) { // un seul node de hierarchy
                childUl = elem.children[0];
                if(childUl && childUl.childElementCount === 1) { // un seul node de hierarchy
                    childLi  = childUl.children[0];
                    if(childLi && childLi.childElementCount === 2) { // un seul element parent
                        hierarchy.insertBefore(childLi.firstChild,hierarchy.firstChild); 
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild,hierarchy);
                    } else {
                        childLi.hidden = true;
                        hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 elements in the hierarchy > "),hierarchy.firstChild);
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild,hierarchy);
                    }
                } else if(childUl && childUl.childElementCount === 0) { // fin de la liste
                    return hierarchy;
                } else {
                    childUl.hidden = true;
                    hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(childUl.childElementCount + " elements > "),hierarchy.firstChild);
                    
                    return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childUl.firstChild.lastChild,hierarchy);
                }
            } else { 
                elem.hidden = true;
                hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 parents node in the hierarchy > "),hierarchy.firstChild);
                return hierarchy;
            }
        } else {
            hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" You have used edit mode please press F5 > "),hierarchy.firstChild);
            return hierarchy;           
        }
        
    };

    cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg = function(txt){
        var div = document.createElement('div');
        div.innerText = txt;
        return div;     
    };


    /********************************************************************************
    Configs : add trigger for single page
    *********************************************************************************/
    if(cwAPI.customLibs.doActionForSingle === undefined) { cwAPI.customLibs.doActionForSingle = {};}
    cwAPI.customLibs.doActionForSingle.breadCrumbHierarchy = cwCustomerSiteActions.breadCrumbHierarchy.create; 

}(cwAPI, jQuery));