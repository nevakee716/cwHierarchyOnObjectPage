| **Name** | **cwHierarchyOnObjectPage** | **Version** | 
| --- | --- | --- |
| **Updated by** | Mathias PFAUWADEL | 1.0 |


## Patch Notes

* 1.0 : 1st version working

## Description 
Allow you to display hierarchy in an objectPage. This is a specific not a layout.

## Screen Shot
Here we have a hierarchy of process related with the association type (is child of/is parent of). With the specific we can display the hierachy in the title of the process

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/1.jpg" alt="Drawing" style="width: 95%;"/>

## Setup

### Node in Evolve

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/2.jpg" alt="Drawing" style="width: 95%;"/>

This node configuration need to be done for EACH view where you want to display the hierarchy.
For good naming convention, you should use BreadcrumbHierarchy {nameOfTheView}. The hierarchy will apply as long as the node id start with BreadcrumbHierarchy . Remember the node id need to be unique.

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/3.jpg" alt="Drawing" style="width: 95%;"/>

Use the custom Display string to put separator between the different element of the hierarchy

### On the js code

You need to add the following line with the view you want to use the hierarchy.
Add the line to this file : \Evolve\Site\bin\webDesigner\custom\Marketplace\libs\cwHierarchyOnObjectPage\src\hierarchyOnObjectPage.js

<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/4.jpg" alt="Drawing" style="width: 95%;"/>

Ps : this line can also be add in your main.js, if you have multiple deployments

## Multiple elements

If an element has multiple parent, the specific will display the number of parents
<img src="https://raw.githubusercontent.com/nevakee716/cwHierarchyOnObjectPage/master/screen/5.jpg" alt="Drawing" style="width: 95%;"/>



