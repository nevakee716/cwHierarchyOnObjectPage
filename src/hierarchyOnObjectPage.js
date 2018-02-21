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
    cwCustomerSiteActions.breadCrumbHierarchy.history = [];

    cwCustomerSiteActions.breadCrumbHierarchy.left = {};
    cwCustomerSiteActions.breadCrumbHierarchy.left.views = {};

    cwCustomerSiteActions.breadCrumbHierarchy.right = {};
    cwCustomerSiteActions.breadCrumbHierarchy.right.views = {};

    cwCustomerSiteActions.breadCrumbHierarchy.create = function(rootNode){
        var hierarchyListLeft = document.querySelectorAll('.cw-list.BreadcrumbHierarchyLeft')[0];
        var hierarchyLeft = document.createElement('div');
        var fragmentLeft = document.createElement('div');

        var hierarchyListRight = document.querySelectorAll('.cw-list.BreadcrumbHierarchyRight')[0];
        var hierarchyRight = document.createElement('div');
        var fragmentRight = document.createElement('div');

        var title = document.getElementsByClassName('page-title')[0];
        var titletxt = title.innerText;
        var listToHideLeft,listToHideRight,displayRight = true,displayLeft = true;
        
        // Store the hierarchy list for the view right side
        if(cwCustomerSiteActions.breadCrumbHierarchy.right.views.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) { 
            hierarchyRight = cwCustomerSiteActions.breadCrumbHierarchy.right.views[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function
            listToHideRight = document.getElementsByClassName('cw-list breadCrumbHierarchyRight');
            if(listToHideRight && listToHideRight.hasOwnProperty(length) && listToHideRight !== []) {
                listToHideRight[0].hidden = true;
            }
        } else if(hierarchyListRight) { // Create the hierachyList
            fragmentLeft.appendChild(hierarchyListRight);
            hierarchyRight = cwCustomerSiteActions.breadCrumbHierarchy.createElement(fragmentLeft,hierarchyRight,"right");
            cwCustomerSiteActions.breadCrumbHierarchy.right.views[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchyRight;
        } else {
            displayRight = false;
        }

        // Store the hierarchy list for the view
        if(cwCustomerSiteActions.breadCrumbHierarchy.left.views.hasOwnProperty(cwAPI.getCurrentView().cwView + rootNode.object_id)) { 
            hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.left.views[cwAPI.getCurrentView().cwView + rootNode.object_id];
            // hide the list that may appear when use preview page function
            listToHideLeft = document.getElementsByClassName('cw-list BreadcrumbHierarchyLeft');
            if(listToHideLeft && listToHideLeft.hasOwnProperty(length) && listToHideLeft !== []) {
                listToHideLeft[0].hidden = true;
            }
        } else if(hierarchyListLeft) { // Create the hierachyList
            fragmentRight.appendChild(hierarchyListLeft);
            hierarchyLeft = cwCustomerSiteActions.breadCrumbHierarchy.createElement(fragmentRight,hierarchyLeft,"left");
            cwCustomerSiteActions.breadCrumbHierarchy.left.views[cwAPI.getCurrentView().cwView + rootNode.object_id] = hierarchyLeft;
        } else {
            displayLeft = false;
        }

     
        
        // put the hierarchy on the title
        if(title && hierarchyLeft) {
            title.insertBefore(hierarchyLeft,title.firstChild);
        }
        // put the hierarchy on the title
        if(title && hierarchyRight) {
            title.appendChild(hierarchyRight);
        }

        if(displayLeft || displayLeft) {
            cwCustomerSiteActions.breadCrumbHierarchy.hideList();
            cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(hierarchyRight);
            cwCustomerSiteActions.breadCrumbHierarchy.checkHistory(hierarchyLeft);           
        }

        if(cwCustomerSiteActions.breadCrumbHierarchy.history.indexOf(titletxt) === -1) {
            cwCustomerSiteActions.breadCrumbHierarchy.history.push(titletxt);
        }

    };

    cwCustomerSiteActions.breadCrumbHierarchy.createElement = function(elem,hierarchy,direction){
        var childUl,childLi,bDirection = true;
        if(direction == "right") bDirection = false;
        if(elem) {
            if(elem.childElementCount === 0) {
                return hierarchy;
            } else if(elem && elem.childElementCount === 1) { // un seul node de hierarchy
                childUl = elem.children[0];
                if(childUl && childUl.childElementCount === 1) { // un seul node de hierarchy
                    childLi  = childUl.children[0];
                    if(childLi && childLi.childElementCount === 2) { // un seul element parent
                        if(bDirection) hierarchy.insertBefore(childLi.firstChild,hierarchy.firstChild); 
                        else hierarchy.appendChild(childLi.firstChild); 
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild,hierarchy,direction);
                    } else {
                        childLi.hidden = true;
                        if(bDirection) {
                            hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 elements in the hierarchy > "),hierarchy.firstChild);
                        } else {
                            hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > more than 2 elements in the hierarchy"));
                        }
                        return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childLi.lastChild,hierarchy,direction);
                    }
                } else if(childUl && childUl.childElementCount === 0) { // fin de la liste
                    return hierarchy;
                } else {
                    childUl.hidden = true;
                    if(bDirection) {
                        hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createList(childUl,bDirection),hierarchy.firstChild);
                    } else hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createList(childUl,bDirection));
                    return cwCustomerSiteActions.breadCrumbHierarchy.createElement(childUl.firstChild.lastChild,hierarchy,direction);
                }
            } else { 
                elem.hidden = true;
                if(bDirection) {
                    hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" more than 2 parents node in the hierarchy > "),hierarchy.firstChild);
                } else {
                    hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > more than 2 parents node in the hierarchy"));
                }
                
                return hierarchy;
            }
        } else {
            if(bDirection) {
                hierarchy.insertBefore(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" You have used edit mode please press F5 > "),hierarchy.firstChild);
            } else {
                hierarchy.appendChild(cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > You have used edit mode please press F5"));
            }
            
            return hierarchy;           
        }
        
    };

    cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg = function(txt){
        var div = document.createElement('div');
        div.innerText = txt;
        return div;     
    };

    cwCustomerSiteActions.breadCrumbHierarchy.createList = function(childUl,bDirection){
        var div = document.createElement('div');
        div.className = "breadCrumbHierarchyMultipleElement";       
        
        var div1
        
        if(bDirection) div1 = cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(childUl.childElementCount + " Objects > ");
        else  div1 = cwCustomerSiteActions.breadCrumbHierarchy.createHierarchyWarningMsg(" > " + childUl.childElementCount + " Objects");

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