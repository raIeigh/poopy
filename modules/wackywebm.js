'use strict'

/*
Make WebM files with changing aspect ratios
By OIRNOIR#0032
*/
const path = require('path')
const fs = require('fs')
const getFileName = p => path.basename(p, path.extname(p))

module.exports = async function (inputType, videoPath, { delta = 2, bouncesPerSecond = 1.9 } = {}) {
	let poopy = this
	const execSync = poopy.functions.execPromise

	// Process input arguments. Assume first argument is the desired output type, and if
	// it matches none, assume part of the rawVideoPath and unshift it back before joining.
	const type = { n: 0, w: 'Bounce' }
	switch (inputType.toLowerCase()) {
		case 'bounce':
			type.n = 0
			type.w = 'Bounce'
			break
		case 'shutter':
			type.n = 1
			type.w = 'Shutter'
			break
		case 'sporadic':
			type.n = 2
			type.w = 'Sporadic'
			break
		case 'bounce+shutter':
			type.n = 3
			type.w = 'Bounce_Shutter'
			break
	}
	const filePath = path.dirname(videoPath)

	// Build an index of temporary locations so they do not need to be repeatedly rebuilt.
	// All temporary files are within one parent folder for cleanliness and ease of removal.
	const workLocations = {}
	function buildLocations() {
		workLocations.tempFolder = path.join(filePath, 'tempFiles')
		workLocations.tempAudio = path.join(workLocations.tempFolder, 'tempAudio.webm')
		//workLocations.tempVideo = path.join(workLocations.tempFolder, 'tempVideo.webm')
		workLocations.tempConcatList = path.join(workLocations.tempFolder, 'tempConcatList.txt')
		workLocations.tempFrames = path.join(workLocations.tempFolder, 'tempFrames')
		workLocations.tempFrameFiles = path.join(workLocations.tempFrames, '%d.png')
		workLocations.tempResizedFrames = path.join(workLocations.tempFolder, 'tempResizedFrames')
		workLocations.outputFile = path.join(filePath, `output.webm`)
	}

	async function main() {
		// Only build the path if temporary location index if the code can move forward. Less to do.
		buildLocations()

		// Use one call to ffprobe to obtain framerate, width, and height, returned as JSON.
		const videoInfo = await execSync(`ffprobe -v error -select_streams v -of json -show_entries stream=r_frame_rate,width,height ${videoPath}`)
		// Deconstructor extracts these values and renames them.
		let { streams: [{ width: maxWidth, height: maxHeight, r_frame_rate: framerate }] } = JSON.parse(videoInfo.trim())
		maxWidth = Number(maxWidth)
		maxHeight = Number(maxHeight)
		const decimalFramerate = framerate.includes('/') ? Number(framerate.split('/')[0]) / Number(framerate.split('/')[1]) : Number(framerate)

		// Make folder tree using NodeJS promised mkdir with recursive enabled.

		await fs.promises.mkdir(workLocations.tempFrames, { recursive: true })
		await fs.promises.mkdir(workLocations.tempResizedFrames, { recursive: true })

		// Separates the audio to be re-applied at the end of the process.
		// If the file has no audio, flag it to it is not attempted.
		let audioFlag = true
		try {
			await execSync(`ffmpeg -y -i ${videoPath} -vn -c:a libvorbis "${workLocations.tempAudio}"`)
		}
		catch {
			audioFlag = false
		}

		// Extracts the frames to be modified for the wackiness.
		await execSync(`ffmpeg -y -i ${videoPath} ${workLocations.tempFrameFiles}`)

		// Sorts with a map so extraction of information only happens once per entry.
		const tempFramesFiles = fs.readdirSync(workLocations.tempFrames)
		const tempFramesFrames = tempFramesFiles.filter(f => f.endsWith('png')).map(f => ({ file: f, n: Number(getFileName(f)) })).sort((a, b) => a.n - b.n)
		// Index tracked from outside. Width and/or height initialize as the maximum and are not modified if unchanged.
		let index = 0,
			lines = [],
			width = maxWidth,
			height = maxHeight

		for (const { file } of tempFramesFrames) {
			// Makes the height/width changes based on the selected type.
			switch (type.n) {
				case 0:
					height = index === 0 ? maxHeight : (Math.floor(Math.abs(Math.cos(index / (decimalFramerate / bouncesPerSecond) * Math.PI) * (maxHeight - delta))) + delta)
					break
				case 1:
					width = index === 0 ? maxWidth : (Math.floor(Math.abs(Math.cos(index / (decimalFramerate / bouncesPerSecond) * Math.PI) * (maxWidth - delta))) + delta)
					break
				case 2:
					width = index === 0 ? maxWidth : (Math.floor(Math.random() * (maxWidth - delta)) + delta)
					height = index === 0 ? maxHeight : (Math.floor(Math.random() * (maxHeight - delta)) + delta)
					break
				case 3:
					height = index === 0 ? maxHeight : (Math.floor(Math.abs(Math.cos(index / (decimalFramerate / bouncesPerSecond) * Math.PI) * (maxHeight - delta))) + delta)
					width = index === 0 ? maxWidth : (Math.floor(Math.abs(Math.sin(index / (decimalFramerate / bouncesPerSecond) * Math.PI) * (maxWidth - delta))) + delta)
					break
			}
			// Creates the respective resized frame based on the above.
			await execSync(`ffmpeg -y -i ${path.join(workLocations.tempFrames, file)} -c:v vp8 -b:v 1M -crf 10 -auto-alt-ref 0 -vf scale=${width}x${height} -aspect ${width}:${height} -r ${framerate} -f webm ${path.join(workLocations.tempResizedFrames, file + '.webm')}`)
			// Tracks the new file for concatenation later.
			lines.push(`file '${path.join('tempResizedFrames', file + '.webm')}'`)
			index++
		}

		// Writes the concatenation file for the next step.
		await fs.promises.writeFile(workLocations.tempConcatList, lines.join('\n'))

		// Concatenates the resized files.
		//await execSync(`ffmpeg -y -f concat -safe 0 -i "${workLocations.tempConcatList}" -c copy "${workLocations.tempVideo}"`)

		// Applies the audio to the new file to form the final file.
		//await execSync(`ffmpeg -y -i "${workLocations.tempVideo}" -i "${workLocations.tempAudio}" -c copy "${path.join(filePath, `${fileName}_${type.w}.webm`)}"`)

		// Congatenates segments and applies te original audio to the new file.
		//if(audioFlag) await execSync(`ffmpeg -y -f concat -safe 0 -i "${workLocations.tempConcatList}" -i "${workLocations.tempAudio}" -c copy "${workLocations.outputFile}"`)
		//else await execSync(`ffmpeg -y -f concat -safe 0 -i "${workLocations.tempConcatList}" -c copy "${workLocations.outputFile}"`)
		await execSync(`ffmpeg -y -f concat -safe 0 -i ${workLocations.tempConcatList}${audioFlag ? ` -i ${workLocations.tempAudio} ` : ' '}-c copy ${workLocations.outputFile}`)

		// Recursive removal of temporary files via the main temporary folder.
		await fs.promises.rm(workLocations.tempFolder, { recursive: true })

	}

	await main()
}