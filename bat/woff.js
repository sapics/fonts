const fs = require('fs')
var BASE_PATH = __dirname.replace(/\\[^\\]+$/, '')
var dirs = fs.readdirSync(BASE_PATH)
var parentPaths = []
for(var i = dirs.length; i--; ){
	var path = dirs[i]
	if(path.indexOf('.') === 0){
		continue
	}
	try{
		var paths = fs.readdirSync(BASE_PATH + '/' + path)
		for(var j = paths.length; j--; ){
			paths[j] = BASE_PATH + '/' + path + '/' + paths[j]
		}
		parentPaths.push.apply(parentPaths, paths)
	}catch(e){
	}
}

var woffFonts = [],
		woff2Fonts = [],
    ttfFonts = [],
    parentPath
var woffReg = /\.woff$/
  , woff2Reg = /\.woff2$/
  , ttfReg = /\.ttf$/
for(var i = parentPaths.length; i--; ){
	parentPath = parentPaths[i]
	if(!fs.existsSync(parentPath + '/METADATA.pb')){
		continue;
	}
	try{
		var files = fs.readdirSync(parentPath)
		  , file
		for(var j = files.length; j--; ){
			file = parentPath + '/' + files[j]
			if(ttfReg.test(file)){
				ttfFonts.push(file)
			}else if(woffReg.test(file)){
				woffFonts.push(file)
			}else if(woff2Reg.test(file)){
				woff2Fonts.push(file)
			}
		}
	}catch(e){
		continue;
	}
}


const execSync = require('child_process').execSync
var ttfFont, woffFont, woff2Font,
    newWoffFlg, newWoff2Flg
for(var i = ttfFonts.length; i--; ){
	newWoffFlg = newWoff2Flg = false

	ttfFont = ttfFonts[i]
	woffFont = ttfFont.replace(ttfReg, '.woff')
	woff2Font = ttfFont.replace(ttfReg, '.woff2')

	if(woffFonts.indexOf(woffFont) === -1){
		newWoffFlg = true
	} else {
		try{
			var ttfStat = fs.statSync(ttfFont)
			  , woffStat = fs.statSync(woffFont)
			if(ttfStat.mtime.getTime() >= woffStat.mtime.getTime()
				|| !woffStat.size){
				newWoffFlg = true
			}
		}catch(e){
			newWoffFlg = true
		}
	}
	if(woff2Fonts.indexOf(woff2Font) === -1){
		newWoff2Flg = true
	} else {
		try{
			var ttfStat = fs.statSync(ttfFont)
			  , woff2Stat = fs.statSync(woff2Font)
			if(ttfStat.mtime.getTime() >= woff2Stat.mtime.getTime()
				|| !woff2Stat.size){
				newWoff2Flg = true
			}
		}catch(e){
			newWoff2Flg = true
		}
	}

	ttfFont = ttfFont.replace(/\//g, '\\')
	if(newWoffFlg || newWoff2Flg){
		try{
			console.log(woffFont)
			execSync('sfnt2woff-zopfli.exe "' + ttfFont + '"')
		}catch(e){
			console.warn('ERROR ' + ttfFont, e)
		}

		try{
			console.log(woff2Font)
			execSync('woff2_compress.exe "' + ttfFont + '"')
		}catch(e){
			console.warn('ERROR2 ' + ttfFont, e)
		}
	}
}
