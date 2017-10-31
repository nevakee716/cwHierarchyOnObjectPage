(function(cwApi, $) { 
  "use strict";

    /********************************************************************************
    Custom Action for Single Page : See Impact here http://bit.ly/2qy5bvB
    *********************************************************************************/
    cwCustomerSiteActions.doActionsForSingle_Custom = function (rootNode) { 
        var currentView, url,i,cwView;
        currentView = cwAPI.getCurrentView();

        if(currentView) cwView = currentView.cwView;
        for(i in cwAPI.customLibs.doActionForSingle) {
            if(cwAPI.customLibs.doActionForSingle.hasOwnProperty(i)) {
                if (typeof(cwAPI.customLibs.doActionForSingle[i]) === "function"){
                    cwAPI.customLibs.doActionForSingle[i](rootNode,cwView);
                }   
            }
        }
    };
    cwCustomerSiteActions.breadCrumbHierarchy = {};
    cwCustomerSiteActions.breadCrumbHierarchy.views = {};
    cwCustomerSiteActions.breadCrumbHierarchy.history = [];


    cwCustomerSiteActions.breadCrumbHierarchy.create = function(rootNode){
        var hierarchyList = document.getElementsByClassName('cw-list BreadcrumbHierarchy')[0];
        var title = document.getElementsByClassName('page-title')[0];
        var hierarchy = document.createElement('div');
        var fragment = document.createElement('div');
        var titletxt = title.innerText;
        
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

        cwCustomerSiteActions.breadCrumbHierarchy.hideList();
        cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(hierarchy);

        if(cwCustomerSiteActions.breadCrumbHierarchy.history.indexOf(titletxt) === -1) {
            cwCustomerSiteActions.breadCrumbHierarchy.history.push(titletxt);
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
                   // hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(childUl.childElementCount + " Objects > "),hierarchy.firstChild);
                    hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createList(childUl),hierarchy.firstChild);
                    //hierarchy.insertBefore(childUl,hierarchy.firstChild);
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

    cwCustomerSiteActions.breadCrumbHierarchy.createList = function(childUl){
        var div = document.createElement('div');
        div.className = "breadCrumbHierarchyMultipleElement";       
        
        var div1 = cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(childUl.childElementCount + " Objects > ");
        div1.className = "breadCrumbHierarchyMultipleElementHeader";

        var div2 = document.createElement('div');
        div2.className = "breadCrumbHierarchyMultipleElementListHidden";

        var element;
        for (var i = 0; i < childUl.childElementCount; i++) {
            element  = childUl.children[i].firstChild.lastChild;
            div2.appendChild(element);
        }

        div1.onclick = function(){
            if(div2.className === "breadCrumbHierarchyMultipleElementListVisible") {
                div2.className = "breadCrumbHierarchyMultipleElementListHidden";
            } else {
                div2.className = "breadCrumbHierarchyMultipleElementListVisible";
            }
        };
        div2.onclick = function(){
            div2.className = "breadCrumbHierarchyMultipleElementListHidden";
        };

        div.appendChild(div1);
        div.appendChild(div2);
        return div;      
    };

    cwCustomerSiteActions.breadCrumbHierarchy.hideList = function(){
        var lists = document.getElementsByClassName("breadCrumbHierarchyMultipleElementListVisible"); 
        for(var i = 0; i < lists.length; i++) {
            lists[i].className  = "breadCrumbHierarchyMultipleElementListHidden";
        }
    };


    cwCustomerSiteActions.breadCrumbHierarchy.checkHistory = function(hierarchy,history) {
        if(history === undefined) {
            history = cwCustomerSiteActions.breadCrumbHierarchy.history.slice(0);
            var first = true;
        }
        var index,child;
        if(hierarchy) {
            for(var i = 0; i < hierarchy.children.length; i++) {
                child = hierarchy.children[i];
                if(child.tagName === "A") {
                    index = history.indexOf(child.innerText.replace(" >",""));
                    if(index !== -1) {
                        child.className = "historyHierarchyLink";
                        history.splice(index,1); 
                    } else {
                        child.className = "HierarchyLink";
                    }                   
                }

                cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(child,history);
            };
        }
        if(first) {
            cwCustomerSiteActions.breadCrumbHierarchy.history = cwCustomerSiteActions.breadCrumbHierarchy.history.filter(function(i) {return history.indexOf(i) < 0;});
        }
    };



    /********************************************************************************
    Configs : add trigger for single page
    *********************************************************************************/
    if(cwAPI.customLibs === undefined) { cwAPI.customLibs = {};}
    if(cwAPI.customLibs.doActionForSingle === undefined) { cwAPI.customLibs.doActionForSingle = {};}
    cwAPI.customLibs.doActionForSingle.breadCrumbHierarchy = cwCustomerSiteActions.breadCrumbHierarchy.create; 

}(cwAPI, jQuery));