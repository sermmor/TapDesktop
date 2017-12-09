/*Copyright (C) 2012  Sergio Martín Moreno.

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA-*/

var allShapeIcons = [];

function createCanvasStage()
{
	stage = new createjs.Stage("canvasDesktop");
	stage.enableMouseOver();
	createjs.Touch.enable(stage);
	stage.mouseMoveOutside = true; 

	// Configurar número framerates.
	createjs.Ticker.framerate = 60; // 60FPS
	// Eventos.
	createjs.Ticker.addEventListener("tick", updateCanvas); // Actualización del canvas del juego.
}

function resizeCanvas()
{
    canvasDesktop.width  = window.innerWidth;
    canvasDesktop.height = window.innerHeight;
    document.body.appendChild(canvasDesktop);
    widthCanvas = window.innerWidth;
    heightCanvas = window.innerHeight;
}

function createIconToCanvas(nameIconToPath, xIconInit, yIconInit, opacity, width, height)
{
	var icon = new createjs.Shape();
	var imageIcon = new Image();
	imageIcon.style.opacity = "" + opacity;
	imageIcon.style.filter  = 'alpha(opacity=' + opacity + ')';
	imageIcon.crossOrigin = "Anonymous";
	imageIcon.src = "images/miniWebs/" + nameIconToPath;
	var xImg = xIconInit + 5, yImg = yIconInit + 5, wImg = width, hImg = height;

	imageIcon.onload = function() {
		var m = new createjs.Matrix2D();
	  	m.translate(xImg, yImg);
	  	m.scale(wImg/imageIcon.width, hImg/imageIcon.height);
	  	icon.graphics
		    .beginBitmapFill(imageIcon, "no-repeat", m)
		    .drawRect(xImg, yImg, wImg, hImg);
	}

	return icon;
}

function calculateComplementary(r, g, b)
{
	return [Math.abs(255 - r), Math.abs(255 - g), Math.abs(255 - b)];
}

function createRandomColorRectangle(newIndex, xIconInit, yIconInit, width, height, bCreateLabel)
{
	var color = getRandomColor();
	var fontColor = calculateComplementary(color[0], color[1], color[2]);
	var xImg = xIconInit + 5, yImg = yIconInit + 5, wImg = width, hImg = height;

	var rectangle = new createjs.Shape();
	rectangle.graphics.beginFill("rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", 1)").drawRect(xImg, yImg, wImg, hImg);

	if (bCreateLabel)
	{
		var label = new createjs.Text(allIconsDesktop[newIndex].title, "bold 14px Arial", 
			"rgba(" + fontColor[0] + ", " + fontColor[1] + ", " + fontColor[2] + ")");
		label.textAlign = "center";
		label.x = xIconInit + 100;
		label.y = yIconInit + 50;

		return [rectangle, label];
	}
	else
	{
		return rectangle;
	}
}

function addNewItemToDesktop(newIndex, xIconInit, yIconInit, isReplace)
{
	var opacity = allIconsDesktop[newIndex].alpha;
	var rectangle = new createjs.Shape();
	rectangle.graphics.beginFill("rgba(255,255,255," + opacity + ")").drawRoundRect (xIconInit, yIconInit, 210, 125, 15);
	allIconsDesktop[newIndex].rectangle = [xIconInit, yIconInit, 210, 125];

	var icon, labelImage = "";
	
	if ((navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) && allIconsDesktop[newIndex].nameIcon != "")
		icon = createIconToCanvas(allIconsDesktop[newIndex].nameIcon, xIconInit, yIconInit, opacity, 200, 90);
	else
	{
		var recLabel = createRandomColorRectangle(newIndex, xIconInit, yIconInit, 200, 90, true);
		icon = recLabel[0];
		labelImage = recLabel[1];
	}

	var label = new createjs.Text(allIconsDesktop[newIndex].title, "bold 10px Arial", "#000000");
	label.textAlign = "center";
	label.x = xIconInit + 100;
	label.y = yIconInit + 100;

	var dragger = new createjs.Container();
	dragger.x = dragger.y = 100;
	
	// Posiciono cada elemento y añado eventos
	if (labelImage == "")
		dragger.addChild(rectangle, icon, label);
	else
		dragger.addChild(rectangle, icon, labelImage, label);
	stage.addChild(dragger);

	dragger.on("pressmove", function(event)
	{
		moveIcon(event, newIndex, xIconInit, yIconInit);
	});

	dragger.on("pressup", function(event)
	{
		releasedIcon(event, newIndex);
	});

	icon.addEventListener("click", function(event) { //"dblclick", function(event) {
		simpleClickInIcon(event, newIndex);
	});
	
	icon.addEventListener("mousedown", function(event){
	    if (event.nativeEvent.button == 0)
	    	allowDrag = true;
	});

	stage.update();

	if (!isReplace)
		allShapeIcons.push([rectangle, icon, labelImage, label, dragger]);
	else
	{
		allShapeIcons[newIndex][0] = rectangle;
		allShapeIcons[newIndex][1] = icon;
		allShapeIcons[newIndex][2] = labelImage;
		allShapeIcons[newIndex][3] = label;
		allShapeIcons[newIndex][4] = dragger;
	}
}

var optCopyLinkMenu, optModifyMenu, optDeleteMenu, rectCopyLinkMenu, rectModifyMenu, rectDeleteMenu;

function openRightClicButton(eventClic, indexIcon)
{
	var downMarginLastMenuItem = 5;
	var wordMarginX = 10, wordMarginY = 10, itemIterator = 30, indexItem = 0;
	
	// Creamos menú de copiar link.
	rectCopyLinkMenu = new createjs.Shape();
	rectCopyLinkMenu.graphics.beginFill("rgba(255,255,255, 1)").drawRect(eventClic.stageX, eventClic.stageY, 150, 30);
	optCopyLinkMenu = new createjs.Text("Copy link", "15px Arial", "#000000");
	optCopyLinkMenu.textAlign = "left";
	optCopyLinkMenu.x = eventClic.stageX + wordMarginX;
	optCopyLinkMenu.y = eventClic.stageY + wordMarginY + (indexItem * itemIterator);
	indexItem++;
	
	// Creamos menú de modificar link.
	rectModifyMenu = new createjs.Shape();
	rectModifyMenu.graphics.beginFill("rgba(255,255,255, 1)").drawRect(eventClic.stageX, eventClic.stageY + itemIterator, 150, 30);
	optModifyMenu = new createjs.Text("Modify link", "15px Arial", "#000000");
	optModifyMenu.textAlign = "left";
	optModifyMenu.x = eventClic.stageX + wordMarginX;
	optModifyMenu.y = eventClic.stageY + wordMarginY + (indexItem * itemIterator);
	indexItem++;

	// Creamos menú para eliminar link.
	rectDeleteMenu = new createjs.Shape();
	rectDeleteMenu.graphics.beginFill("rgba(255,255,255, 1)").drawRect(eventClic.stageX, eventClic.stageY + (itemIterator * 2), 150, 30 + downMarginLastMenuItem);
	optDeleteMenu = new createjs.Text("Delete link", "15px Arial", "#000000");
	optDeleteMenu.textAlign = "left";
	optDeleteMenu.x = eventClic.stageX + wordMarginX;
	optDeleteMenu.y = eventClic.stageY + wordMarginY + (indexItem * itemIterator);

	// Añadimos objetos al stage, asignamos eventos y updateamos.
	stage.addChild(rectCopyLinkMenu, rectModifyMenu, optCopyLinkMenu, rectDeleteMenu, optModifyMenu, optDeleteMenu);
	rectCopyLinkMenu.on("mouseover", function(event) {
    	mouseOverRectangleItemMenu(event, eventClic.stageX, eventClic.stageY, 150, 30);
	});
	rectCopyLinkMenu.on("mouseout", function(event) {
    	mouseOutRectangleItemMenu(event, eventClic.stageX, eventClic.stageY, 150, 30);
	});
	rectCopyLinkMenu.on("click", function(event) {
    	clicOnCopyLinkMenu(event, indexIcon);
	});

	rectModifyMenu.on("mouseover", function(event) {
    	mouseOverRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + itemIterator, 150, 30);
	});
	rectModifyMenu.on("mouseout", function(event) {
    	mouseOutRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + itemIterator, 150, 30);
	});
	rectModifyMenu.on("click", function(event) {
    	clicOnModifyMenu(event, indexIcon);
	});

	rectDeleteMenu.on("mouseover", function(event) {
    	mouseOverRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + (itemIterator * 2), 150, 30 + downMarginLastMenuItem);
	});
	rectDeleteMenu.on("mouseout", function(event) {
    	mouseOutRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + (itemIterator * 2), 150, 30 + downMarginLastMenuItem);
	});
	rectDeleteMenu.on("click", function(event) {
    	clicOnDeleteMenu(event, indexIcon);
	});

	stage.update();
}

function clearCanvasDialogs()
{
	stage.removeChild(rectModifyMenu, rectDeleteMenu, optModifyMenu, optDeleteMenu);
	stage.removeChild(rectCopyLinkMenu, optCopyLinkMenu);
}

function deleteShape(indexShape)
{
	allIconsDesktop[indexShape].isDeleted = true;

	for (i = 0; i < allShapeIcons[indexShape].length; i++)
		stage.removeChild(allShapeIcons[indexShape][i]);

	stage.update();
}

function deleteShapeOnlyDraw(indexShape)
{
	for (i = 0; i < allShapeIcons[indexShape].length; i++)
		stage.removeChild(allShapeIcons[indexShape][i]);

	stage.update();
}
