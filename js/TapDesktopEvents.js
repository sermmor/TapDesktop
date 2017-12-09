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

var clickBlock = false;
var allowDrag = false;

// Evento que todo el update que pueda suceder en el Canvas.
function updateCanvas(event) {
	if (!event.paused) {
		checkLoadImages();
	}
	// Para que se hagan efectivos los cambios, reflescamos el canvas constantemente.
	stage.update();
}

// Eventos de icono.
function moveIcon(event, indexIcon, posX, posY)
{

	//console.log("EVENT BUTTON: " + event.nativeEvent.button);
	if (!allowDrag)
		return;

	clearCanvasDialogs();
	var cannotMove = checkMoveIconCollisions(indexIcon, [event.stageX, event.stageY]);
	var canMove = [!cannotMove[0], !cannotMove[1]];

	if (canMove[0] || canMove[1])
	{
		var rect = allIconsDesktop[indexIcon].rectangle;
		clickBlock = true;
		if (canMove[0]) event.currentTarget.x = event.stageX - (posX + 100);
		if (canMove[1]) event.currentTarget.y = event.stageY - (posY + 50);
		if (canMove[0]) allIconsDesktop[indexIcon].positionX = event.stageX - (xIconPosInit + 100);
		if (canMove[1]) allIconsDesktop[indexIcon].positionY = event.stageY - (yIconPosInit + 50);

		allIconsDesktop[indexIcon].rectangle = [
			(canMove[0])? event.stageX : rect[0],
		 	(canMove[1])? event.stageY : rect[1],
		 	rect[2],
		 	rect[3]
			];

		stage.update();	
	}
}

function releasedIcon(event, indexIcon)
{
	clickBlock = false;
	allowDrag = false;
	var collisionRet = checkReleasedIconCollision(indexIcon, [event.stageX, event.stageY]);

	if (collisionRet[0] && !allIconsDesktop[collisionRet[1]].isFolder)
	{
		// collisionRet[1] es otro icono.
		addFolderToData(allIconsDesktop[collisionRet[1]].positionX, allIconsDesktop[collisionRet[1]].positionY, [indexIcon, collisionRet[1]]);

		var oldIndex = collisionRet[1];
		var rectX = allShapeIcons[oldIndex][0].x, rectY = allShapeIcons[oldIndex][0].y;

		addFolderToCanvas(allIconsDesktop.length - 1, rectX + 210/2, rectY - 125/2, false);

		deleteShapeOnlyDraw(indexIcon);
		deleteShapeOnlyDraw(collisionRet[1]);
	}
	else if (collisionRet[0])
	{
		// collisionRet[1] es una carpeta.
		addIconDataToFolderData(collisionRet[1], indexIcon);

		var oldIndex = collisionRet[1];
		var rectX = allShapeIcons[oldIndex][0].x, rectY = allShapeIcons[oldIndex][0].y;
		deleteFolderShapeOnlyDraw(collisionRet[1]);

		addFolderToCanvas(collisionRet[1], rectX + 210/2, rectY - 125/2, true);

		deleteShapeOnlyDraw(indexIcon);
	}
}

function simpleClickInIcon(event, indexIcon)
{
	clearCanvasDialogs();

	if (!clickBlock)
	{
		if (event.nativeEvent.button == 0) // Clic izquierdo.
			window.open(allIconsDesktop[indexIcon].url,'_blank');
		else if (event.nativeEvent.button == 2) // Clic izquierdo.
			openRightClicButton(event, indexIcon);
	}
}

// Eventos de carpetas.
function simpleClickInFolder(event, indexIcon)
{
	clearCanvasDialogs();

	if (!clickBlock)
	{
		if (event.nativeEvent.button == 0) // Clic izquierdo.
		{
			// Abrir carpeta en diálogo JQUERY.
			$("#dialogFolderContent").dialog({ title: allIconsDesktop[indexIcon].title });
			loadLinksFolder(indexIcon, false);
			$("#dialogFolderContent").dialog('open');
		}
		else if (event.nativeEvent.button == 2) // Clic izquierdo.
			folderRightClicButton(event, indexIcon);
	}
}

// Eventos del menú.
function mouseOverRectangleItemMenu(event, posX, posY, width, height)
{
	event.target.graphics.clear().beginFill("rgba(153, 204, 255, 1)").drawRect(posX, posY, width, height).endFill();
	stage.update();
}

function mouseOutRectangleItemMenu(event, posX, posY, width, height)
{
	event.target.graphics.clear().beginFill("rgba(255, 255, 255, 1)").drawRect(posX, posY, width, height).endFill();
	stage.update();
}

function copyToClipboard(textToCopy) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(textToCopy).select();
  document.execCommand("copy");
  $temp.remove();
}

function clicOnCopyLinkMenu(event, indexIcon)
{
	copyToClipboard(allIconsDesktop[indexIcon].url);
}

function clicOnModifyMenu(event, indexIcon)
{
	indexToModifyOrDelete = indexIcon;

	inputModifyTitle.value = allIconsDesktop[indexIcon].title;
	inputModifyIcon.value = allIconsDesktop[indexIcon].nameIcon;
	inputModifyUrl.value = allIconsDesktop[indexIcon].url;
	rangeModifyTransparency.value = 100.0 - (allIconsDesktop[indexIcon].alpha * 100.0);

	$("#dialogModifyIcon").dialog('open');
}

function clicOnDeleteMenu(event, indexIcon)
{
	indexToModifyOrDelete = indexIcon;
	$("#dialogDeleteIcon").dialog('open');	
}

// Eventos de teclado.
function releaseAKey(event)
{
	if (event.keyCode == 27) { // Escape.
        clearCanvasDialogs();
    }
}

function clicOnModifyFolderMenu(event, indexIcon)
{
	indexToModifyOrDelete = indexIcon;

	inputModifyNameFolder.value = allIconsDesktop[indexIcon].title;
	$("#dialogModifyFolder").dialog('open');
}