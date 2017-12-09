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


function createMiniIconsList(newIndex, xIconInit, yIconInit)
{
	var miniIcons = [];
	var offsetX = 0, offsetY = 0;
	var contentFolder = allIconsDesktop[newIndex].content;
	if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1)
		// Comprobamos si los elementos de dentro de la carpeta tienen iconos o no y añadimos tanto iconos como rectángulos de colorines sin labels.
		for (i = 0; i < contentFolder.length; i++)
		{
			if (miniIcons.length > 3)
				break;

			if (contentFolder[i].nameIcon != "")
			{
				// Creamos el icono y lo añadimos a miniIcons.
				//miniIcons.push(createIconToCanvas(contentFolder[i].nameIcon, xIconInit, yIconInit, 1, 200, 90));
				miniIcons.push(createIconToCanvas(contentFolder[i].nameIcon, xIconInit + offsetX, yIconInit + offsetY, 1, 200/2, 90/2));
				offsetX = (miniIcons.length == 1 || miniIcons.length == 3) ? 200/2 : 0;
				offsetY = (miniIcons.length == 2 || miniIcons.length == 3) ? 90/2 : 0;
			}
		}

	// Rellenamos el resto de huecos con rectángulos con colores.
	while (miniIcons.length < 4)
	{
		miniIcons.push(createRandomColorRectangle(-1, xIconInit + offsetX, yIconInit + offsetY, 200/2, 90/2, false));
		offsetX = (miniIcons.length == 1 || miniIcons.length == 3) ? 200/2 : 0;
		offsetY = (miniIcons.length == 2 || miniIcons.length == 3) ? 90/2 : 0;
	}

	return miniIcons;
}

function addFolderToCanvas(newIndex, xIconInit, yIconInit, isReplace)
{
	var opacity = allIconsDesktop[newIndex].alpha;
	var rectangle = new createjs.Shape();
	rectangle.graphics.beginFill("rgba(255,255,255," + opacity + ")").drawRoundRect(xIconInit, yIconInit, 210, 125, 15);
	
	var label = new createjs.Text(allIconsDesktop[newIndex].title, "bold 10px Arial", "#000000");
	label.textAlign = "center";
	label.x = xIconInit + 100;
	label.y = yIconInit + 100;

	var miniIcons = createMiniIconsList(newIndex, xIconInit, yIconInit);

	var dragger = new createjs.Container();
	dragger.x = dragger.y = 100;
	
	dragger.addChild(rectangle, label);
	for (i = 0; i < miniIcons.length; i++)
		dragger.addChild(miniIcons[i]);

	stage.addChild(dragger);
	stage.update();

	if (!isReplace)
		allShapeIcons.push([rectangle, label, miniIcons, dragger]);
	else
	{
		allShapeIcons[newIndex][0] = rectangle;
		allShapeIcons[newIndex][1] = label;
		allShapeIcons[newIndex][2] = miniIcons;
		allShapeIcons[newIndex][3] = dragger;
	}

	dragger.on("pressmove", function(event)
	{
		moveIcon(event, newIndex, xIconInit, yIconInit);
	});

	dragger.on("pressup", function(event)
	{
		// Evento de released.
		clickBlock = false;
		allowDrag = false;
	});

	rectangle.addEventListener("click", function(event) {
		simpleClickInFolder(event, newIndex);
	});

	rectangle.addEventListener("mousedown", function(event) {
	    if (event.nativeEvent.button == 0)
	    	allowDrag = true;
	});

	for (i = 0; i < miniIcons.length; i++)
	{
		miniIcons[i].addEventListener("click", function(event) {
			simpleClickInFolder(event, newIndex);
		});

		miniIcons[i].addEventListener("mousedown", function(event) {
		    if (event.nativeEvent.button == 0)
		    	allowDrag = true;
		});
	}
}

function deleteFolderShapeOnlyDraw(indexShape)
{
	for (i = 0; i < allShapeIcons[indexShape].length; i++)
		if (i == 2)
			for (j = 0; j < allShapeIcons[indexShape][i].length; j++)
				stage.removeChild(allShapeIcons[indexShape][i][j]);
		else
			stage.removeChild(allShapeIcons[indexShape][i]);

	stage.update();
}

function deleteFolderShape(indexShape)
{
	allIconsDesktop[indexShape].isDeleted = true;

	for (i = 0; i < allShapeIcons[indexShape].length; i++)
		if (i == 2)
			for (j = 0; j < allShapeIcons[indexShape][i].length; j++)
				stage.removeChild(allShapeIcons[indexShape][i][j]);
		else
			stage.removeChild(allShapeIcons[indexShape][i]);

	stage.update();
}

function folderRightClicButton(eventClic, indexIcon)
{
	var downMarginLastMenuItem = 5;
	var wordMarginX = 10, wordMarginY = 10, itemIterator = 30, indexItem = 0;
	
	// Creamos menú de modificar nombre.
	rectModifyMenu = new createjs.Shape();
	rectModifyMenu.graphics.beginFill("rgba(255,255,255, 1)").drawRect(eventClic.stageX, eventClic.stageY, 150, 30);
	optModifyMenu = new createjs.Text("Modify folder", "15px Arial", "#000000");
	optModifyMenu.textAlign = "left";
	optModifyMenu.x = eventClic.stageX + wordMarginX;
	optModifyMenu.y = eventClic.stageY + wordMarginY + (indexItem * itemIterator);
	indexItem++;

	// Creamos menú para eliminar carpeta.
	rectDeleteMenu = new createjs.Shape();
	rectDeleteMenu.graphics.beginFill("rgba(255,255,255, 1)").drawRect(eventClic.stageX, eventClic.stageY + itemIterator, 150, 30 + downMarginLastMenuItem);
	optDeleteMenu = new createjs.Text("Delete folder", "15px Arial", "#000000");
	optDeleteMenu.textAlign = "left";
	optDeleteMenu.x = eventClic.stageX + wordMarginX;
	optDeleteMenu.y = eventClic.stageY + wordMarginY + (indexItem * itemIterator);

	// Añadimos objetos al stage, asignamos eventos y updateamos.
	stage.addChild(rectModifyMenu, rectDeleteMenu, optModifyMenu, optDeleteMenu);

	rectModifyMenu.on("mouseover", function(event) {
    	mouseOverRectangleItemMenu(event, eventClic.stageX, eventClic.stageY, 150, 30);
	});
	rectModifyMenu.on("mouseout", function(event) {
    	mouseOutRectangleItemMenu(event, eventClic.stageX, eventClic.stageY, 150, 30);
	});
	rectModifyMenu.on("click", function(event) {
    	clicOnModifyFolderMenu(event, indexIcon);
	});

	rectDeleteMenu.on("mouseover", function(event) {
    	mouseOverRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + itemIterator, 150, 30 + downMarginLastMenuItem);
	});
	rectDeleteMenu.on("mouseout", function(event) {
    	mouseOutRectangleItemMenu(event, eventClic.stageX, eventClic.stageY + itemIterator, 150, 30 + downMarginLastMenuItem);
	});
	rectDeleteMenu.on("click", function(event) {
    	clicOnDeleteMenu(event, indexIcon);
	});

	stage.update();
}
