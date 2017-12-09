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

var originCanvasX = 100, originCanvasY = 51, widthCanvas = 0, heightCanvas = 0, heightCanvasMargin = 18;

function checkMoveIconCollisions(indexIcon, newPosition)
{
	/* Caso de colisionar con los bordes del canvas. */
	var thereIsBorderCollisionX = false, thereIsBorderCollisionY = false;

	var rectCurrentIcon = allIconsDesktop[indexIcon].rectangle;

	if (newPosition[0] < originCanvasX || newPosition[0] > (widthCanvas + originCanvasX - rectCurrentIcon[2])) // Left & right border.
		thereIsBorderCollisionX = true;

	if (newPosition[1] < originCanvasY || newPosition[1] > (heightCanvas - rectCurrentIcon[3] + heightCanvasMargin)) // Up & down border.
		thereIsBorderCollisionY = true;

	return [thereIsBorderCollisionX, thereIsBorderCollisionY];
}

// @return [thereIsCollision, indexIconInAllIconsDesktop]
function checkReleasedIconCollision(indexIcon, newPosition)
{
	/* TODO Comprobar las colisiones con otros iconos, pues crean carpetas en cuanto se suelte el ratón (en el 
	caso de colisionar con otra carpeta, lo introduce dentro de la carpeta en cuanto suelte el ratón). En caso de ser
	una carpeta sólo podrá introducirse dentro de otras carpetas, NO tendrá eventos con un icono. */

	var currentBoundingBox = allIconsDesktop[indexIcon].rectangle;

	for (i = 0; i < allIconsDesktop.length; i++)
	{
		if (!allIconsDesktop[i].isDeleted && (i != indexIcon) 
			&& isRectangleIntersection(currentBoundingBox, allIconsDesktop[i].rectangle))
		{
			/*console.log("INTERSECTION: ");
			logRectangle(currentBoundingBox);
			logRectangle(allIconsDesktop[i].rectangle);*/
			return [true, i];
		}
	}

	return [false, -1];
}

function isInRange(range, number)
{
	return range[0] <= number && number <= range[1];
}

function isRectangleIntersection(rect1, rect2)
{
	var rect1_4Points = [
						[rect1[0], rect1[1]],
						[rect1[0] + rect1[2], rect1[1]],
						[rect1[0], rect1[1] + rect1[3]],
						[rect1[0] + rect1[2], rect1[1] + rect1[3]],
						];
	var rect2_4Points = [
						[rect2[0], rect2[1]],
						[rect2[0] + rect2[2], rect2[1]],
						[rect2[0], rect2[1] + rect2[3]],
						[rect2[0] + rect2[2], rect2[1] + rect2[3]],
						];

	var rect1RangeX = [rect1_4Points[0][0], rect1_4Points[1][0]];
	var rect1RangeY = [rect1_4Points[0][1], rect1_4Points[2][1]];
	var rect2RangeX = [rect2_4Points[0][0], rect2_4Points[1][0]];
	var rect2RangeY = [rect2_4Points[0][1], rect2_4Points[2][1]];

	//console.log("> IS COLLISION X : " + (isInRange(rect1RangeX, rect2RangeX[0]) || isInRange(rect1RangeX, rect2RangeX[1])));
	//console.log("> IS COLLISION Y : " + (isInRange(rect1RangeY, rect2RangeY[0]) || isInRange(rect1RangeY, rect2RangeY[1])));
	
	return (isInRange(rect1RangeX, rect2RangeX[0]) || isInRange(rect1RangeX, rect2RangeX[1]))
						&& (isInRange(rect1RangeY, rect2RangeY[0]) || isInRange(rect1RangeY, rect2RangeY[1]));;
}

function logPoints(listPoint)
{
	var toShow = "[";
	for (i = 0; i < listPoint.length; i++)
	{
		if (i == 0)
			toShow = toShow + "(" + listPoint[i][0] + ", " + listPoint[i][1] + ")";
		else
			toShow = toShow + ", (" + listPoint[i][0] + ", " + listPoint[i][1] + ")";
	}
	console.log(toShow + "]");
}

function logRectangle(rectangle)
{
	console.log("Rectangle: Position = (" + rectangle[0] + ", " + rectangle[1] + "); width = " + rectangle[2] + "; height = " + rectangle[3]);
}