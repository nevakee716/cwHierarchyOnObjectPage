(function(cwApi, $) { 
  "use strict";

    /********************************************************************************
    Configs : add all the objectPage that will use the hierarchy
    *********************************************************************************/

    cwAPI.customLibs.breadcrumbConfiguration = ['microprocessus','process']; // list the view where the hierarchy should be use


    /********************************************************************************
    Custom Action for Single Page : See Impact here http://bit.ly/2qy5bvB
    *********************************************************************************/
    cwCustomerSiteActions.doActionsForSingle_Custom = function (rootNode) { 
        var currentView, url;
        currentView = cwAPI.getCurrentView();

        if (cwAPI.customLibs.breadcrumbConfiguration.indexOf(currentView.cwView) !== -1 && cwCustomerSiteActions.hasOwnProperty('doActionsForSingle_Custom_breadcrumbHierarchy')){
           cwCustomerSiteActions.doActionsForSingle_Custom_breadcrumbHierarchy(rootNode);
        }
    };

    cwCustomerSiteActions.breadcrumbHierarchy = {};

    cwCustomerSiteActions.doActionsForSingle_Custom_breadcrumbHierarchy = function(rootNode){
        var hierarchyList = document.getElementsByClassName('cw-list BreadcrumbHierarchy')[0];
        var title = document.getElementsByClassName('page-title')[0];
        var hierarchy = document.createElement('div');
        var fragment = document.createDocumentFragment();


        // Store the hierarchy list for the view
        if(cwCustomerSiteActions.breadcrumbHierarchy.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) { 
            hierarchy = cwCustomerSiteActions.breadcrumbHierarchy[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function
            var listToHide = document.getElementsByClassName('cw-list BreadcrumbHierarchy');
            if(listToHide && listToHide.hasOwnProperty(length) && listToHide !== []) {
                listToHide[0].hidden = true;
            }
        } else { // Create the hierachyList
            fragment.appendChild(hierarchyList);
            hierarchy = cwCustomerSiteActions.createHierarchyTitle(fragment,hierarchy);
            cwCustomerSiteActions.breadcrumbHierarchy[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchy;
        }
        
        // put the hierarchy on the title
        if(title && hierarchy) {
            title.insertBefore(hierarchy,title.firstChild);
        }

    };

    cwCustomerSiteActions.createHierarchyTitle = function(elem,hierarchy){
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
                        return cwCustomerSiteActions.createHierarchyTitle(childLi.lastChild,hierarchy);
                    } else {
                        childLi.hidden = true;
                        hierarchy.insertBefore(cwCustomerSiteActions.createHierarchyWarningMsg(" more than 2 elements in the hierarchy > "),hierarchy.firstChild);
                        return cwCustomerSiteActions.createHierarchyTitle(childLi.lastChild,hierarchy);
                    }
                } else if(childUl && childUl.childElementCount === 0) { // fin de la liste
                    return hierarchy;
                } else {
                    childUl.hidden = true;
                    hierarchy.insertBefore(cwCustomerSiteActions.createHierarchyWarningMsg(childUl.childElementCount + " elements > "),hierarchy.firstChild);
                    
                    return cwCustomerSiteActions.createHierarchyTitle(childUl.firstChild.lastChild,hierarchy);
                }
            } else { 
                elem.hidden = true;
                hierarchy.insertBefore(cwCustomerSiteActions.createHierarchyWarningMsg(" more than 2 parents node in the hierarchy > "),hierarchy.firstChild);
                return hierarchy;
            }
        } else {
            hierarchy.insertBefore(cwCustomerSiteActions.createHierarchyWarningMsg(" You have used edit mode please press F5 > "),hierarchy.firstChild);
            return hierarchy;           
        }
        
    };

    cwCustomerSiteActions.createHierarchyWarningMsg = function(txt){
        var div = document.createElement('div');
        div.innerText = txt;
        return div;     
    };




}(cwAPI, jQuery));