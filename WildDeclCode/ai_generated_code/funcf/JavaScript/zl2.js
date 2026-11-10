```js
function animateDiv(eleID)
{
	zl.quipD("Modal AJAX content received. Animating.");

	let steps = 10;       //define how many steps ( hence limiting framerate )
	let durationMS = 200; //define total duration of animation
	let ele = zl.getID(eleID);
	let eleInner = zl.getClass(eleID + "_inner");

	//measure the size of the content while it's hidden
	let initialWidth = ele.clientWidth;
	let initialHeight = ele.clientHeight;

	//ok, let's get on it already.
	for(let step = 1; step <= steps; step++)
	{
		setTimeout(() =>
		{
		    ele.style.width = ((initialWidth / steps) * step) + 'px';
		    ele.style.height = ((initialHeight / steps) * step) + 'px';
		    ele.style.opacity = ((1 / steps) * step);

			if(step == steps) //..and we're done!
			{
				//cleanup after animation
				ele.style.width = null; ele.style.height = null;
				eleInner.style.overflow = "auto";
				addDrag(dialogName,"zl_modal_titlebar");
				//currently broken by margin:auto; in dialog element

				//zl.addDrag(dialogName,"zl_modal_titlebar");
				//^-- this version not working
			}
		}, (durationMS / steps) * step);
	}
}
```