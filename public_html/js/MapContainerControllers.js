/**
 * 
 */
angular.module("mapContainer.tsiotsias.uk")
    .controller("MapController", ['$rootScope','$scope', '$element',
        function($rootScope, $scope, $element) {
	// get the current controller address
	var mapController = this;
	// set up a default latitude & lognitude (Europe zoomed out)
	var latlng = new google.maps.LatLng(47.73855,12.5088275);
	// set up some starter options
        var myOptions = {
            zoom: 4,
            center: latlng,
            panControl: false,
            zoomControl: false,
            scaleControl: true,
            overviewMapControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var homeLatLng = new google.maps.LatLng(51.4720202,-0.4543496);
        var homeZoom = 17;
        // get the map container element
        var mapElement = $element[0];
	// create the map & display
	var map = new google.maps.Map(mapElement, myOptions);
        //
        // Create the DIV to hold the control and
        // call the HomeControl() constructor passing
        // in this DIV.
        var homeControlDiv = document.createElement('div');
        var homeControl = new HomeControl(homeControlDiv, map);
        homeControlDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
        //
 	// store in the root scope the reference to the map controller - this should be
	// sufficient to access all the other inner variables
	$rootScope.mapController = mapController;
	// define the function to centre at current location
	var useMyCurrentLocation = function useMyCurrentLocation (command) {
            // Try W3C Geolocation (Preferred)
            if(navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
		initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		map.setZoom(14);
		map.setCenter(initialLocation);
		//map.panTo(initialLocation);
                }, 
                function() {
                    handleNoGeolocation(browserSupportFlag);
		});
            }
            // Browser doesn't support Geolocation
            else {
                browserSupportFlag = false;
                handleNoGeolocation(browserSupportFlag);
            }
            // provide the missing capability handling
            function handleNoGeolocation(errorFlag) {
                if (errorFlag == true) {
                    window.alert("Geolocation service failed.");
		}
                else {
                    window.alert("Your browser doesn't support geolocation");
		}
            }
        };
        $rootScope.mapController.useMyCurrentLocation = useMyCurrentLocation;
        //
        // add a control to the map
        /**
        * The HomeControl adds a control to the map that simply
        * returns the user to Chicago. This constructor takes
        * the control DIV as an argument.
        * @constructor
        */
        function HomeControl(controlDiv, map) {
            // Set CSS styles for the DIV containing the control
            // Setting padding to 5 px will offset the control
            // from the edge of the map
            controlDiv.style.padding = '5px';
            // Set CSS for the control border
            var controlUI = document.createElement('div');
            controlUI.style.backgroundColor = 'white';
            controlUI.style.borderStyle = 'solid';
            controlUI.style.borderWidth = '2px';
            controlUI.style.cursor = 'pointer';
            controlUI.style.textAlign = 'center';
            controlUI.title = 'Click to set the map to Home';
            controlDiv.appendChild(controlUI);
            // Set CSS for the control interior
            var controlText = document.createElement('div');
            controlText.style.fontFamily = 'Arial,sans-serif';
            controlText.style.fontSize = '12px';
            controlText.style.paddingLeft = '4px';
            controlText.style.paddingRight = '4px';
            controlText.innerHTML = '<b>Home</b>';
            controlUI.appendChild(controlText);
            // Setup the click event listeners: simply set the map to
            // Heathrow
            google.maps.event.addDomListener(controlUI, 'click', function() {
                map.setZoom(homeZoom);
                map.setCenter(homeLatLng);
            });
        }
}]);