const Canvas = require('canvas')
const settings = {
	greyscale_mode: "luminance",
	dithering: true,
	monospace: false,
}

module.exports = async function (src, negative) {
	if (src === undefined) return;

	const canvas = await createImageCanvas(src);
	if (!canvas) return ''
	const text = await canvasToText(canvas, negative);
	return text
}

async function createImageCanvas(src) {
	const canvas = Canvas.createCanvas(1, 1);
	const image = await Canvas.loadImage(src).catch(() => { });

	if (!image) return

	let width = Math.floor(image.width / 6);;
	let height = width * image.height / image.width;

	//nearest multiple
	canvas.width = width - (width % 2);
	canvas.height = height - (height % 4);

	ctx = canvas.getContext("2d");
	ctx.fillStyle = "#FFFFFF"; //get rid of alpha
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	return canvas;
}


async function canvasToText(canvas, negative) {
	const ctx = canvas.getContext("2d");
	const width = canvas.width;
	const height = canvas.height;

	let image_data = [];

	if (settings.dithering) {
		image_data = new Dithering(canvas).image_data;
	} else {
		image_data = new Uint8Array(ctx.getImageData(0, 0, width, height).data.buffer);
	}

	let output = "";

	for (let imgy = 0; imgy < height; imgy += 4) {
		for (let imgx = 0; imgx < width; imgx += 2) {
			const braille_info = [0, 0, 0, 0, 0, 0, 0, 0];
			let dot_index = 0;
			for (let x = 0; x < 2; x++) {
				for (let y = 0; y < 4; y++) {
					const index = (imgx + x + width * (imgy + y)) * 4;
					const pixel_data = image_data.slice(index, index + 4); //ctx.getImageData(imgx+x,imgy+y,1,1).data
					if (pixel_data[3] >= 128) { //account for alpha
						const grey = toGreyscale(pixel_data[0], pixel_data[1], pixel_data[2]);
						if (!negative) {
							if (grey >= 128) braille_info[dot_index] = 1;
						} else {
							if (grey <= 128) braille_info[dot_index] = 1;
						}
					}
					dot_index++;
				}
			}
			output += pixelsToCharacter(braille_info);
		}
		output += "\n";
	}

	return output;
}

function pixelsToCharacter(pixels_lo_hi) { //expects an array of 8 bools
	//Codepoint reference - https://www.ssec.wisc.edu/~tomw/java/unicode.html#x2800
	const shift_values = [0, 1, 2, 6, 3, 4, 5, 7]; //correspond to dots in braille chars compared to the given array
	let codepoint_offset = 0;
	for (const i in pixels_lo_hi) {
		codepoint_offset += (+pixels_lo_hi[i]) << shift_values[i];
	}

	if (codepoint_offset === 0 && settings.monospace === false) { //pixels were all blank
		codepoint_offset = 4; //0x2800 is a blank braille char, 0x2804 is a single dot
	}
	return String.fromCharCode(0x2800 + codepoint_offset);
}

function toGreyscale(r, g, b) {
	switch (settings.greyscale_mode) {
		case "luminance":
			return (0.22 * r) + (0.72 * g) + (0.06 * b);

		case "lightness":
			return (Math.max(r, g, b) + Math.min(r, g, b)) / 2;

		case "average":
			return (r + g + b) / 3;

		case "value":
			return Math.max(r, g, b);

		default:
			console.error("Greyscale mode is not valid");
			return 0;
	}
}

function Dithering(canvas) {
	this.canvas = canvas;
	this.image_data = new Uint8Array(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data); //clone

	let oldpixel;
	let newpixel;
	let quant_error;
	let err_red, err_green, err_blue;

	const _getPixel = (x, y) => {
		const index = (x + y * canvas.width) * 4;
		return [this.image_data[index + 0], this.image_data[index + 1], this.image_data[index + 2]];
	}

	const _setPixel = (x, y, colour) => {
		const index = (x + y * canvas.width) * 4;
		this.image_data[index + 0] = Math.floor(colour[0] + 0.5);
		this.image_data[index + 1] = Math.floor(colour[1] + 0.5);
		this.image_data[index + 2] = Math.floor(colour[2] + 0.5);
		this.image_data[index + 3] = 255;
	}

	const _closestPalleteColour = (pixel) => {
		return (0.2126 * pixel[0] + 0.7152 * pixel[1] + 0.0722 * pixel[2]) > 128 ? [255, 255, 255] : [0, 0, 0];
	}

	const _colourDifference = (one, two) => {
		return [(one[0] - two[0]), (one[1] - two[1]), (one[2] - two[2])];
	}

	const _colourAddError = (x, y, err_red, err_green, err_blue) => {
		const clip = (x) => (x < 0 ? 0 : (x > 255 ? 255 : x));
		const index = (x + y * canvas.width) * 4;
		this.image_data[index + 0] = clip(this.image_data[index + 0] + err_red)
		this.image_data[index + 1] = clip(this.image_data[index + 1] + err_green)
		this.image_data[index + 2] = clip(this.image_data[index + 2] + err_blue)
		this.image_data[index + 3] = 255;
	}

	for (let y = 0; y < canvas.height; y++) {
		for (let x = 0; x < canvas.width; x++) {
			oldpixel = _getPixel(x, y);
			newpixel = _closestPalleteColour(oldpixel);
			_setPixel(x, y, newpixel);
			quant_error = _colourDifference(oldpixel, newpixel);

			err_red = quant_error[0];
			err_green = quant_error[1];
			err_blue = quant_error[2];

			if (x + 1 < canvas.width) _colourAddError(x + 1, y, (7 / 16) * err_red, (7 / 16) * err_green, (7 / 16) * err_blue);
			if (x - 1 > 0 && y + 1 < canvas.height) _colourAddError(x - 1, y + 1, (3 / 16) * err_red, (3 / 16) * err_green, (3 / 16) * err_blue);
			if (y + 1 < canvas.height) _colourAddError(x, y + 1, (5 / 16) * err_red, (5 / 16) * err_green, (5 / 16) * err_blue);
			if (x + 1 < canvas.width) _colourAddError(x + 1, y + 1, (1 / 16) * err_red, (1 / 16) * err_green, (1 / 16) * err_blue);
		}
	}
}