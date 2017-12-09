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

var currenIndexFolderIcon;
var indexItemInFolderToModify = [];

function showModifyButtonsFolderBar(enable)
{
	indexItemInFolderToModify = [];
	if (enable)
	{
		$('#btToHomeIconInFolder').show();
		$('#btTrashIconInFolder').show();
		$('#btCloseEditIconInFolder').show();
		$('#btEditIconInFolder').hide();
	}
	else
	{
		$('#btToHomeIconInFolder').hide();
		$('#btTrashIconInFolder').hide();
		$('#btCloseEditIconInFolder').hide();
		$('#btEditIconInFolder').show();
	}
}

function loadLinksFolder(indexFolderIcon, isInEditMode)
{
	currenIndexFolderIcon = indexFolderIcon;
	if (!isInEditMode)
		showModifyButtonsFolderBar(false);
	$("#allIconsInFolder").html('<div style="font-size:3pt;">&nbsp;</div><div style="float:left;">&nbsp;</div>');
	var listIconsInFolder = allIconsDesktop[indexFolderIcon].content;

	for (var i = 0; i < listIconsInFolder.length; i++)
		if (!listIconsInFolder[i].isDeleted)
		{
			listIconsInFolder[i].rectangle = [listIconsInFolder[i].positionX, listIconsInFolder[i].positionY, 210, 125];
			if (!isInEditMode)
				createNewIconInsideFolder(listIconsInFolder, i);
			else
				createNewIconInsideFolderToModify(listIconsInFolder, i);
		}

	rangeModifyAllTransparency.value = 100.0 - (calculateAverageTransparency() * 100.0);
}

function createImageIconPathToFolder(listIconsInFolder, currentIndex)
{
	// TODO (para el futuro) Contemplar que puede NO haber icono, y entonces poner un div de color ALEATORIO con un texto dentro.

	var nameIconToPath;
	//if (allIconsDesktop[currentIndex].nameIcon != "")
		nameIconToPath = '<img id="iconImageInFolder' + currentIndex 
			+ '" style="margin:7px;" width="200" height="90" src="images/miniWebs/' + listIconsInFolder[currentIndex].nameIcon 
			+ '" border="0"/>';
	/*else
		nameIconToPath = '<div id="iconImageInFolder' + currentIndex 
			+ '" class="floatBox" border="0"/></div>'; // TODO NO RULA DEL TODO ESTO Y HACE COSAS MUY PERO QUE MUY RARAS.
	*/
	return nameIconToPath;
}

function createNewIconInsideFolder(listIconsInFolder, currentIndex)
{
	var nameIconToPath = createImageIconPathToFolder(listIconsInFolder, currentIndex);

	$("#allIconsInFolder").append('<a href="' + listIconsInFolder[currentIndex].url + '" target="_blank">'
			+ '<div class="buttonItemInFolder">'
			+ nameIconToPath
			+ '<br />' + listIconsInFolder[currentIndex].title + '</div></a>'
			+ '<div style="float:left;">&nbsp;</div>');
}

function createNewIconInsideFolderToModify(listIconsInFolder, currentIndex)
{
	var nameIconToPath = createImageIconPathToFolder(listIconsInFolder, currentIndex);

	$("#allIconsInFolder").append('<div id="idNewIconFolderToModify' + currentIndex + '" class="buttonItemInFolder">'
			+ nameIconToPath
			+'<br />' + listIconsInFolder[currentIndex].title + '</div>'
			+ '<div style="float:left;">&nbsp;</div>');

	$("#idNewIconFolderToModify" + currentIndex).click(function() {
		var indexIcon = parseInt($(this)[0].id.split("idNewIconFolderToModify")[1]);
		if ($(this)[0].className == "buttonItemInFolder")
		{
			$(this)[0].className = "buttonItemInFolderSelected";
			indexItemInFolderToModify.push(indexIcon);
		}
		else
		{
			$(this)[0].className = "buttonItemInFolder";
			var indexToDelete = indexItemInFolderToModify.indexOf(indexIcon);
			indexItemInFolderToModify.splice(indexToDelete, 1);
		}
	});
}

function EditIconInFolder()
{
	var isDisabledEditIconsButtons = ("" + $('#btToHomeIconInFolder')[0].style.display) == "none";
	showModifyButtonsFolderBar(isDisabledEditIconsButtons);
	loadLinksFolder(currenIndexFolderIcon, isDisabledEditIconsButtons);
}

function DeleteIconInFolder()
{
	// Marcamos todo icono seleccionado como borrado y luego limpiamos.
	var listIconsInFolder = allIconsDesktop[currenIndexFolderIcon].content;
	var currentIndex;
	for (var i = 0; i < indexItemInFolderToModify.length; i++)
	{
		currentIndex = indexItemInFolderToModify[i];
		listIconsInFolder[currentIndex].isDeleted = true;
	}

	indexItemInFolderToModify = [];
	loadLinksFolder(currenIndexFolderIcon, false);
}

function SendIconInFolderToHomeDesktop()
{
	var listIconsInFolder = allIconsDesktop[currenIndexFolderIcon].content;
	var currentIndex, newIndex, nextXIconPosInit = xIconPosInit, nextYIconPosInit = yIconPosInit, incrementPos = 25;
	for (var i = 0; i < indexItemInFolderToModify.length; i++)
	{
		currentIndex = indexItemInFolderToModify[i];
		newIndex = addIconInFolderDataToDeskData(currenIndexFolderIcon, currentIndex);
		addNewItemToDesktop(newIndex, nextXIconPosInit, nextYIconPosInit, false);
		nextXIconPosInit = nextXIconPosInit + incrementPos;
		nextYIconPosInit = nextYIconPosInit + incrementPos;
	}

	indexItemInFolderToModify = [];
	loadLinksFolder(currenIndexFolderIcon, false);
}

function enterToSearchInsideFolder(event)
{
	var candidateOne, candidateTwo, isCandidateOne, isCandidateTwo;
	var toSearch = inputSearchInFolder.value.toUpperCase();

	var isInEditMode = ("" + $('#btToHomeIconInFolder')[0].style.display) == "none";
	$("#allIconsInFolder").html('<div style="font-size:3pt;">&nbsp;</div><div style="float:left;">&nbsp;</div>');
	var listIconsInFolder = allIconsDesktop[currenIndexFolderIcon].content;
	for (var i = 0; i < listIconsInFolder.length; i++)
		if (!listIconsInFolder[i].isDeleted)
		{
			candidateOne = listIconsInFolder[i].title.toUpperCase();
			candidateTwo = listIconsInFolder[i].url.toUpperCase();
			isCandidateOne = (candidateOne.indexOf(toSearch) !== -1);
			isCandidateTwo = (candidateTwo.indexOf(toSearch) !== -1);

			if (isCandidateOne || isCandidateTwo)
			{
				if (!isInEditMode)
					createNewIconInsideFolder(listIconsInFolder, i);
				else
					createNewIconInsideFolderToModify(listIconsInFolder, i);
			}
		}
}

