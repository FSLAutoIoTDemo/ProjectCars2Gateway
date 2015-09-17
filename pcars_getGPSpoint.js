/*############## DEFINES #################*/

//var _TRACK_ID = 1988984740;		// Brands Hatch GP
//var _TRACK_ID = 1641471184;		// Silverstone GP
//var _TRACK_ID = -945967394;		// Nuerburgring GP

/*########################################*/

var cwd = 'C:\\Work\\Automotive_CLOUD\\Projects\\FTF2015\\Demo\\EKB\\PCars\\GPS_Conversion';

// Get variables from cli arguments
var trackID = process.argv[2];
var pCarsLong = process.argv[3];
var pCarsLat = process.argv[4];

// Get GPS coords
var GPScoords = getPcarsGPS(trackID,pCarsLong,pCarsLat);

// Return string version of JSON formatted GPS coords
console.log(JSON.stringify(GPScoords));

return 1;

//  console.log(input);
//  console.log('hello');

/// Run Main
//main(_TRACK_ID, -345193,-917875);

function getPcarsGPS(trackID, pCarsLong,pCarsLat){

	var latlng = require(cwd + '/pcars_to_gps')(trackID, pCarsLong, pCarsLat);

	//console.log(latlng);
	
	return latlng;
}