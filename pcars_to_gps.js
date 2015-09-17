//Refpoint = module.require('./pcars_refPoints');

var cwd = 'C:\\Work\\Automotive_CLOUD\\Projects\\FTF2015\\Demo\\EKB\\PCars\\GPS_Conversion';


module.exports = function (circuit_id,PosX,PosY){
//function calc_coordinates (circuit_id,PosX,PosY){

//	var aRefPointTmp         =       new Refpoint(circuit_id);
	var aRefPointTmp         =       new module.require(cwd + '/pcars_refPoints')(circuit_id);

	// define variables
	var rotation = degreeToRadians ( aRefPointTmp[circuit_id]["rotation"] );           //rotation angle in radian, because Math.cos() needs angle in radian
	var x_new;
	var y_new;

	//correction multiplier
	PosX = PosX * aRefPointTmp[circuit_id]["cor_PosX_mul"];
	PosY = PosY * aRefPointTmp[circuit_id]["cor_PosY_mul"];
	
	//console.log("CALC:", aRefPointTmp );
	//console.log("Calc rotation: " + rotation);

	//eliminate rotation error
	if ( aRefPointTmp[circuit_id]["rotation"] != 0) {
		//ATTENTION: Math.cos needs angle in radian
		x_new = (Math.cos(rotation) * PosX) - (Math.sin(rotation) * PosY);
		y_new = (Math.sin(rotation) * PosX) + (Math.cos(rotation) * PosY);
	}else{
		// no rotation
		x_new = PosX;
		y_new = PosY;
	}

	//console.log ("X_old: " + PosX + " X_New: " + x_new + "Y_old: " + PosY + " Y_New: " + y_new);

	//calculation from game position data to an GPS angle (radius earth 6371.000.000 mm, because the data from the Game DS API is in millimeter):
	//ATTENTION: Math.cos needs angle in radian
	var radius2EarthAxis = 6371000000 * Math.cos( degreeToRadians(aRefPointTmp[circuit_id]["refLat"]) ) +  aRefPointTmp[circuit_id]["cor_r_Long"];

		
	/************************************************************
	////Method 1: right-angled triangle
        var angleX = Math.asin(x_new/radius2EarthAxis);
        var angleY = Math.asin(y_new/6371000000);
        //convert radian to degree
       // console.log("angleX before calculation: " + angleX + " angleY: " + angleY );
        angleX = radiansToDegrees(angleX);
        angleY = radiansToDegrees(angleY);
	**************************************************************/

	//Method 2: set angle in relation, 360 degrees are 40030km circumference  - better method
	//var circumference_earth = 40030000000; //in millimeter
	var circumference_earth = 2 * Math.PI * (6371000000 + aRefPointTmp[circuit_id]["cor_r_Lat"]);
	var circumference_earth_Lat = 2 * Math.PI * radius2EarthAxis; //in millimeter


	//console.log("Calc Coordinates. circumference_earth/circumference_earth_Lat: " + circumference_earth + " / " + circumference_earth_Lat );
 
	var angleX = x_new / circumference_earth_Lat * 360;
	var angleY = y_new / circumference_earth * 360;
		
		
	//console.log("CuircitName: "     + aRefPointTmp[circuit_id]["Name"]);
	//console.log("radius2EarthAxis: "  + radius2EarthAxis);
	//console.log("angleX: "         + angleX + " angleY: " + angleY );

	// calculate final value
	var car_coordinateLong  =  aRefPointTmp[circuit_id]["refLong"] + angleX;
	var car_coordinateLat   =  aRefPointTmp[circuit_id]["refLat"] + angleY;
		
	//console.log ("GPS RefLong: " + aRefPointTmp[circuit_id]["refLong"] + " RefLat: " + aRefPointTmp[circuit_id]["refLat"] );
	//console.log ("GPS Long:    " + car_coordinateLong + " Lat: " + car_coordinateLat + "++++++++++++End++++++");

	// return a hash of gps coordinates
	return {"Lat" : car_coordinateLat , "Long" : car_coordinateLong};
}

function degreeToRadians($degree)
{
    return $degree * Math.PI / 180;
}

function radiansToDegrees($radian)
{
        return $radian * 180/ Math.PI;
}
