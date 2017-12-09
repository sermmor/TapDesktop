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

var stage;
var indexToModifyOrDelete;
var imagesToLoadList = [];
var allWallpapers = [];
var xIconPosInit = 100, yIconPosInit = 100;

$(document).bind("contextmenu", function(event) {
    return false;
});

$(document).keyup(function(event) {
     releaseAKey(event);
});

// Para abrir diálogos.
$(function () {
	$("#dialogAddIcon").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "35%"
	});

	$("#dialogModifyIcon").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "35%"
	});

	$("#dialogModifyFolder").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "25%"
	});

	$("#dialogDownloadData").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "40%",
	});

	$("#dialogDeleteIcon").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "20%",
	});

	$("#dialogAllOptions").dialog({
	  autoOpen: false,
	  modal: true,
	  width: "48%",
	});

	$("#dialogFolderContent").dialog({
		autoOpen: false,
		modal: true,
		width: "90%"
	});

	$("#btAddIcon").click(function() {
		rangeAddTransparency.value = 100.0 - (calculateAverageTransparency() * 100.0);
	 	$("#dialogAddIcon").dialog('open');
	});

	$("#btDownloadData").click(function() {
		textAreaDownloadData.value = parseDataToText();
		$("#dialogDownloadData").dialog('open');
	});

	$("#btOptions").click(function() {
		loadOptions();
		$("#dialogAllOptions").dialog('open');
	});

	$("#mainBody").click(function() {
		clearCanvasDialogs();
	});

	$("#btEditIconInFolder").click(function() {
		EditIconInFolder();
	});

	$("#btCloseEditIconInFolder").click(function() {
		EditIconInFolder();
	});

	$("#btToHomeIconInFolder").click(function() {
		SendIconInFolderToHomeDesktop();
	});

	$("#btTrashIconInFolder").click(function() {
		DeleteIconInFolder();
	});
});

function calculateAverageTransparency()
{
	var total = 0, size = 0;
	for (i = 0; i < allIconsDesktop.length; i++)
	{
		if (!allIconsDesktop[i].isDeleted)
		{
			total = total + allIconsDesktop[i].alpha;
			size++;
		}
	}

	if (size > 0)
		return total / size;
	else
		return 0;
}

function loadOptions()
{
	$("#allWallpapersToChoose").html('');
	for (i = 0; i < allWallpapers.length; i++)
	{
		$("#allWallpapersToChoose").append('<img id="previewWallpaperOption' + i + '" style="margin:7px;border-color: #99CCFF;" width="150" height="75" src="' 
			+ allWallpapers[i] + '" ' + 'onclick="changeWallpaper(\'' + allWallpapers[i] + '\', \'previewWallpaperOption' +  i +'\');" border="0"/>');
	}

	rangeModifyAllTransparency.value = 100.0 - (calculateAverageTransparency() * 100.0);
}

var oldSelected;
function changeWallpaper(sPathNewWallpaper, idPreview)
{
	setWallpaper(sPathNewWallpaper);
	// Deseleccionar imagen anterior y seleccionar la nueva sobre la que el usuario ha hecho clic.
	$("#" + oldSelected).attr("border", "0");
	$("#" + idPreview).attr("border", "5");
	oldSelected = idPreview;
}

function launchCheckExistImage(url)
{
    var img = new Image();//document.createElement("IMG");
    img.src = url;
    imagesToLoadList.push(img);
}

function checkLoadImages()
{
	if (imagesToLoadList.length == 0)
		return;

	//console.log("> Loading...");

	var toDelete = [], img;
	for (var i = 0; i < imagesToLoadList.length; i++)
	{
		img = imagesToLoadList[i];
		if (img.complete)
		{
			toDelete.push(i - toDelete.length);
			if (img.height != 0)
			{
				allWallpapers.push(img.src);
				//console.log("LOADED: " + img.src);
			}
			/*else
			{
				console.log("-----> ERROR: " + img.src);
			}*/
			//console.log("-----> " + img.src + ";;; " + img.height);
		}
	}
	for(var i = 0; i < toDelete.length; i++)
	{
		//console.log("-----> DELETING: " + imagesToLoadList[toDelete[i]].src);
		imagesToLoadList.splice(toDelete[i], 1);
	}

	/*if (isLoadedAllWallpaper())
		console.log("----> ALL LOADED");*/
}

function launchCheckPathsWallpaper(sNameImageWallpaper)
{
	var sImageFolder = "images/wallpapers/";
	var sImageName = sNameImageWallpaper;
	var lExtensions = [".jpg", ".png", ".gif"]; // Elimino el jpeg porque es lo mismo que el jpg pero escrito de forma idiota.

	for (i = 0; i < lExtensions.length; i++)
	{
		launchCheckExistImage(sImageFolder + sImageName + lExtensions[i]);
	}
}

function launchGetPathAllWallpaper()
{
	// The maximum number of wallpapers is 90 (images) x 3 (type formats) = 270.
	var sRootWallpaperName = "wallpaper";

	launchCheckPathsWallpaper(sRootWallpaperName + "01"); launchCheckPathsWallpaper(sRootWallpaperName + "02");
	launchCheckPathsWallpaper(sRootWallpaperName + "03"); launchCheckPathsWallpaper(sRootWallpaperName + "04");
	launchCheckPathsWallpaper(sRootWallpaperName + "05"); launchCheckPathsWallpaper(sRootWallpaperName + "06");
	launchCheckPathsWallpaper(sRootWallpaperName + "07"); launchCheckPathsWallpaper(sRootWallpaperName + "08");
	launchCheckPathsWallpaper(sRootWallpaperName + "09"); launchCheckPathsWallpaper(sRootWallpaperName + "10");
	launchCheckPathsWallpaper(sRootWallpaperName + "11"); launchCheckPathsWallpaper(sRootWallpaperName + "12");
	launchCheckPathsWallpaper(sRootWallpaperName + "13"); launchCheckPathsWallpaper(sRootWallpaperName + "14");
	launchCheckPathsWallpaper(sRootWallpaperName + "15"); launchCheckPathsWallpaper(sRootWallpaperName + "16");
	launchCheckPathsWallpaper(sRootWallpaperName + "17"); launchCheckPathsWallpaper(sRootWallpaperName + "18");
	launchCheckPathsWallpaper(sRootWallpaperName + "19"); launchCheckPathsWallpaper(sRootWallpaperName + "20");
	launchCheckPathsWallpaper(sRootWallpaperName + "21"); launchCheckPathsWallpaper(sRootWallpaperName + "22");
	launchCheckPathsWallpaper(sRootWallpaperName + "23"); launchCheckPathsWallpaper(sRootWallpaperName + "24");
	launchCheckPathsWallpaper(sRootWallpaperName + "25"); launchCheckPathsWallpaper(sRootWallpaperName + "26");
	launchCheckPathsWallpaper(sRootWallpaperName + "27"); launchCheckPathsWallpaper(sRootWallpaperName + "28");
	launchCheckPathsWallpaper(sRootWallpaperName + "29"); launchCheckPathsWallpaper(sRootWallpaperName + "30");
	launchCheckPathsWallpaper(sRootWallpaperName + "31"); launchCheckPathsWallpaper(sRootWallpaperName + "32");
	launchCheckPathsWallpaper(sRootWallpaperName + "33"); launchCheckPathsWallpaper(sRootWallpaperName + "34");
	launchCheckPathsWallpaper(sRootWallpaperName + "35"); launchCheckPathsWallpaper(sRootWallpaperName + "36");
	launchCheckPathsWallpaper(sRootWallpaperName + "37"); launchCheckPathsWallpaper(sRootWallpaperName + "38");
	launchCheckPathsWallpaper(sRootWallpaperName + "39"); launchCheckPathsWallpaper(sRootWallpaperName + "40");
	launchCheckPathsWallpaper(sRootWallpaperName + "41"); launchCheckPathsWallpaper(sRootWallpaperName + "42");
	launchCheckPathsWallpaper(sRootWallpaperName + "43"); launchCheckPathsWallpaper(sRootWallpaperName + "44");
	launchCheckPathsWallpaper(sRootWallpaperName + "45"); launchCheckPathsWallpaper(sRootWallpaperName + "46");
	launchCheckPathsWallpaper(sRootWallpaperName + "47"); launchCheckPathsWallpaper(sRootWallpaperName + "48");
	launchCheckPathsWallpaper(sRootWallpaperName + "49"); launchCheckPathsWallpaper(sRootWallpaperName + "50");
	launchCheckPathsWallpaper(sRootWallpaperName + "51"); launchCheckPathsWallpaper(sRootWallpaperName + "52");
	launchCheckPathsWallpaper(sRootWallpaperName + "53"); launchCheckPathsWallpaper(sRootWallpaperName + "54");
	launchCheckPathsWallpaper(sRootWallpaperName + "55"); launchCheckPathsWallpaper(sRootWallpaperName + "56");
	launchCheckPathsWallpaper(sRootWallpaperName + "57"); launchCheckPathsWallpaper(sRootWallpaperName + "58");
	launchCheckPathsWallpaper(sRootWallpaperName + "59"); launchCheckPathsWallpaper(sRootWallpaperName + "60");
	launchCheckPathsWallpaper(sRootWallpaperName + "61"); launchCheckPathsWallpaper(sRootWallpaperName + "62");
	launchCheckPathsWallpaper(sRootWallpaperName + "63"); launchCheckPathsWallpaper(sRootWallpaperName + "64");
	launchCheckPathsWallpaper(sRootWallpaperName + "65"); launchCheckPathsWallpaper(sRootWallpaperName + "66");
	launchCheckPathsWallpaper(sRootWallpaperName + "67"); launchCheckPathsWallpaper(sRootWallpaperName + "68");
	launchCheckPathsWallpaper(sRootWallpaperName + "69"); launchCheckPathsWallpaper(sRootWallpaperName + "70");
	launchCheckPathsWallpaper(sRootWallpaperName + "71"); launchCheckPathsWallpaper(sRootWallpaperName + "72");
	launchCheckPathsWallpaper(sRootWallpaperName + "73"); launchCheckPathsWallpaper(sRootWallpaperName + "74");
	launchCheckPathsWallpaper(sRootWallpaperName + "75"); launchCheckPathsWallpaper(sRootWallpaperName + "76");
	launchCheckPathsWallpaper(sRootWallpaperName + "77"); launchCheckPathsWallpaper(sRootWallpaperName + "78");
	launchCheckPathsWallpaper(sRootWallpaperName + "79"); launchCheckPathsWallpaper(sRootWallpaperName + "80");
	launchCheckPathsWallpaper(sRootWallpaperName + "81"); launchCheckPathsWallpaper(sRootWallpaperName + "82");
	launchCheckPathsWallpaper(sRootWallpaperName + "83"); launchCheckPathsWallpaper(sRootWallpaperName + "84");
	launchCheckPathsWallpaper(sRootWallpaperName + "85"); launchCheckPathsWallpaper(sRootWallpaperName + "86");
	launchCheckPathsWallpaper(sRootWallpaperName + "87"); launchCheckPathsWallpaper(sRootWallpaperName + "88");
	launchCheckPathsWallpaper(sRootWallpaperName + "89"); launchCheckPathsWallpaper(sRootWallpaperName + "90");
}

function isLoadedAllWallpaper()
{
	return imagesToLoadList.length == 0;
}

function setWallpaper(sPathNewWallpaper)
{
	mainBody.style.backgroundImage = "url('" + sPathNewWallpaper + "')";
	//dialogFolderContent.style.backgroundImage = "url('" + sPathNewWallpaper + "')";//"url('images/TextureFolder.jpg')";
	currentWallpaper = sPathNewWallpaper;
}

function parseDataLinkInFolderToText(link, isTheLast)
{
	var text = "";
	if (!link.isDeleted)
	{
		text = text + "{\n";
		text = text + '\ttitle : "' + link.title + '",\n';
		text = text + '\tnameIcon : "' + link.nameIcon + '",\n';
		text = text + '\turl : "' + link.url + '",\n';
		text = text + '\talpha : ' + link.alpha + ',\n';
		text = text + '\tisFolder : ' + link.isFolder + ',\n';
		text = text + '\tcontent : [],\n';
		text = text + '\tpositionX : ' + link.positionX + ',\n';
		text = text + '\tpositionY : ' + link.positionY + ',\n';
		text = text + '\tisDeleted : ' + false + '\n';
		
		if (!isTheLast)
			text = text + "},\n";
		else
			text = text + "}\n";
	}
	return text;
}

function parseDataFolderToText(listLinks)
{
	var ret = "[";
	if (listLinks.length > 0)
	{
		for (var i = 0; i < listLinks.length; i++)
		{
			var isTheLast = (i == (listLinks.length - 1)) || (i == (listLinks.length - 2) && listLinks[i].isDeleted);
			ret = ret + parseDataLinkInFolderToText(listLinks[i], isTheLast);
		}
	}
	return ret + "]";
}

function parseDataLinkToText(link, isTheLast)
{
	var text = "";
	if (!link.isDeleted)
	{
		text = text + "{\n";
		text = text + '\ttitle : "' + link.title + '",\n';
		text = text + '\tnameIcon : "' + link.nameIcon + '",\n';
		text = text + '\turl : "' + link.url + '",\n';
		text = text + '\talpha : ' + link.alpha + ',\n';
		text = text + '\tisFolder : ' + link.isFolder + ',\n';
		text = text + '\tcontent : ' + parseDataFolderToText(link.content) + ',\n';
		text = text + '\tpositionX : ' + link.positionX + ',\n';
		text = text + '\tpositionY : ' + link.positionY + ',\n';
		text = text + '\tisDeleted : ' + false + '\n';
		
		if (!isTheLast)
			text = text + "},\n";
		else
			text = text + "}\n";
	}
	return text;
}

function parseDataToText()
{
	var text = "var currentWallpaper = '" + currentWallpaper + "';\n\nvar allIconsDesktop = [\n";

	for (var i = 0; i < allIconsDesktop.length; i++)
	{
		var isTheLast = (i == (allIconsDesktop.length - 1)) || (i == (allIconsDesktop.length - 2) && allIconsDesktop[i].isDeleted);
		console.log("> " + allIconsDesktop[i].title);
		text = text + parseDataLinkToText(allIconsDesktop[i], isTheLast);
	}

	text = text + "];\n";
	return text;
}

function loadIconsData()
{
	for (var i = 0; i < allIconsDesktop.length; i++)
		if (!allIconsDesktop[i].isDeleted)
		{
			if (allIconsDesktop[i].isFolder)
			{
				allIconsDesktop[i].rectangle = [allIconsDesktop[i].positionX, allIconsDesktop[i].positionY, 210, 125];
				addFolderToCanvas(i, allIconsDesktop[i].positionX, allIconsDesktop[i].positionY, false);
			}
			else
			{
				addNewItemToDesktop(i, allIconsDesktop[i].positionX, allIconsDesktop[i].positionY, false);
			}
		}
}

function init()
{
	launchGetPathAllWallpaper();
	mainBody.style.backgroundImage = setWallpaper(currentWallpaper);

	resizeCanvas();
	createCanvasStage();
	// Cargamos todos los datos guardados.
	loadIconsData();

	// Reflescar el canvas.
	stage.update();
}

function cleanAndCloseDialogAddIcon()
{
	inputAddTitle.value = "";
	inputAddIcon.value = "";
	inputAddUrl.value = "";
	rangeAddTransparency.value = 0;
	$("#dialogAddIcon").dialog('close');
}

function cleanAndCloseDialogModifyIcon()
{
	inputModifyTitle.value = "";
	inputModifyIcon.value = "";
	inputModifyUrl.value = "";
	rangeModifyTransparency.value = 0;
	$("#dialogModifyIcon").dialog('close');
}

function cleanAndCloseDialogModifyFolder()
{
	inputModifyNameFolder.value = "";
	$("#dialogModifyFolder").dialog('close');
}

function createAndAddNewIcon()
{
	// Guardamos datos en estructura.
	allIconsDesktop.push({
		title : inputAddTitle.value,
		nameIcon : inputAddIcon.value,
		url : inputAddUrl.value,
		alpha : (100.0 - rangeAddTransparency.value)/100.0,
		isFolder : false,
		content : [],
		positionX : xIconPosInit,
		positionY : yIconPosInit,
		rectangle : "",
		isDeleted : false
	});
	var newIndex = allIconsDesktop.length - 1;

	// Crear el icono y añadirlo al canvasDesktop.
	addNewItemToDesktop(newIndex, xIconPosInit, yIconPosInit, false);

	// Limpieza y cerrar formulario.
	cleanAndCloseDialogAddIcon();
}

function modifyCurrentIcon()
{
	deleteShape(indexToModifyOrDelete);

	allIconsDesktop[indexToModifyOrDelete].title = inputModifyTitle.value;
	allIconsDesktop[indexToModifyOrDelete].nameIcon = inputModifyIcon.value;
	allIconsDesktop[indexToModifyOrDelete].url = inputModifyUrl.value;
	isFolder = false,
	content = [],
	allIconsDesktop[indexToModifyOrDelete].alpha = (100.0 - rangeModifyTransparency.value)/100.0;
	allIconsDesktop[indexToModifyOrDelete].isDeleted = false;

	addNewItemToDesktop(indexToModifyOrDelete, allIconsDesktop[indexToModifyOrDelete].positionX, 
		allIconsDesktop[indexToModifyOrDelete].positionY, true);

	// Limpieza y cerrar formulario.
	cleanAndCloseDialogModifyIcon();
}

function modifyCurrentFolderPushEnter(event)
{
	if (event.keyCode == 13) {
        modifyCurrentFolder();
    }
}

function modifyCurrentFolder()
{
	deleteFolderShapeOnlyDraw(indexToModifyOrDelete);

	allIconsDesktop[indexToModifyOrDelete].title = inputModifyNameFolder.value;

	var rectX = allShapeIcons[indexToModifyOrDelete][0].x,
		rectY = allShapeIcons[indexToModifyOrDelete][0].y;
	
	addFolderToCanvas(indexToModifyOrDelete, rectX + 210/2, rectY - 125/2, true);

	// Limpieza y cerrar formulario.
	cleanAndCloseDialogModifyFolder();
}

function closeDialogDeleteIcon()
{
	$("#dialogDeleteIcon").dialog('close');
}

function deleteCurrentIcon()
{
	if (allIconsDesktop[indexToModifyOrDelete].isFolder)
		deleteFolderShape(indexToModifyOrDelete);
	else
		deleteShape(indexToModifyOrDelete);
	closeDialogDeleteIcon();
}

function modifyAlphaIcon(index, newAlpha)
{
	allIconsDesktop[index].alpha = newAlpha;
	allIconsDesktop[index].isDeleted = false;

	addNewItemToDesktop(index, allIconsDesktop[index].positionX, 
		allIconsDesktop[index].positionY, true);
}

function changeAllTransparencyIcons(currentValue)
{
	// Guardo en una estructura toda la información de los antiguos iconos que serán borrados.
	var oldLength = allIconsDesktop.length;
	var oldShapeIcons = [], iterShape;
	for (i = 0; i < allShapeIcons.length; i++)
	{
		iterShape = [];
		for (j = 0; j < allShapeIcons[i].length; j++)
			iterShape.push(allShapeIcons[i][j]);
		oldShapeIcons.push(iterShape);
	}

	// Cambio alpha creando nuevos iconos.
	var newAlpha = (100.0 - currentValue)/100.0;

	for (i = 0; i < allIconsDesktop.length; i++)
	{
		if (!allIconsDesktop[i].isDeleted)
		{
			modifyAlphaIcon(i, newAlpha);
		}
	}

	for (indexShape = 0; indexShape < oldLength; indexShape++)
	{
		for (i = 0; i < oldShapeIcons[indexShape].length; i++)
			stage.removeChild(oldShapeIcons[indexShape][i]);
	}

	stage.update();
}

function cloneListIcon(listIcon)
{
	var toReturn = [];
	if (listIcon.length > 0)
	{
		for (i = 0; i < listIcon.length; i++)
		{
			toReturn.push(toReturncloneIcon(listIcon[i]));
		}
	}
	return toReturn;
}

function cloneIcon(iconToClone)
{
	return {
		title : iconToClone.title,
		nameIcon : iconToClone.nameIcon,
		url : iconToClone.url,
		alpha : iconToClone.alpha,
		isFolder : iconToClone.isFolder,
		content : iconToClone.content,
		positionX : iconToClone.positionX,
		positionY : iconToClone.positionY,
		rectangle : [iconToClone.rectangle[0], iconToClone.rectangle[1], iconToClone.rectangle[2], iconToClone.rectangle[3]],
		isDeleted : iconToClone.isDeleted
	};
}

function addFolderToData(posX, posY, indexToIncludeInFolder)
{
	var folderContent = [];
	for (i = 0; i < indexToIncludeInFolder.length; i++)
		folderContent.push(cloneIcon(allIconsDesktop[indexToIncludeInFolder[i]]));

	var rectangleLast = allIconsDesktop[indexToIncludeInFolder[indexToIncludeInFolder.length - 1]].rectangle;

	// Guardamos datos en estructura.
	allIconsDesktop.push({
		title : "Folder",
		nameIcon : "",
		url : "",
		alpha : calculateAverageTransparency(),
		isFolder : true,
		content : folderContent,
		positionX : posX,
		positionY : posY,
		rectangle : [rectangleLast[0], rectangleLast[1], rectangleLast[2], rectangleLast[3]],
		isDeleted : false
	});
	var newIndex = allIconsDesktop.length - 1;
	
	for (i = 0; i < indexToIncludeInFolder.length; i++)
		allIconsDesktop[indexToIncludeInFolder[i]].isDeleted = true;
}

function addIconDataToFolderData(indexFolder, indexIcon)
{
	// Clonamos el icono en la carpeta y, después, marcamos como borrado el icono original, para así moverlo.
	allIconsDesktop[indexFolder].content.push(cloneIcon(allIconsDesktop[indexIcon]));
	allIconsDesktop[indexIcon].isDeleted = true;
}

function addIconInFolderDataToDeskData(indexFolder, indexIconInFolder)
{
	var newIconInDesk = cloneIcon(allIconsDesktop[indexFolder].content[indexIconInFolder]);
	allIconsDesktop[indexFolder].content[indexIconInFolder].isDeleted = true;
	allIconsDesktop.push(newIconInDesk);
	return allIconsDesktop.length - 1;
}