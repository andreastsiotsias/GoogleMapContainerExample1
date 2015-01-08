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
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var homeLatLng = new google.maps.LatLng(52.339526,-1.5595517);
        var homeZoom = 15;
        // get the map container element
        var mapElement = $element[0];
	// create the map & display
	var map = new google.maps.Map(mapElement, myOptions);
        // put an initial marker on the map
        var mapPointer = new google.maps.Marker({position: latlng, map: map, title: 'Starting position ...'});
        //
        // Create the DIV to hold the control and
        // call the HomeControl() constructor passing
        // in this DIV.
        var homeControlDiv = document.createElement('div');
        //homeControlDiv.className = 'btn-group';
        var homeControl = new HomeControl(homeControlDiv, map);
        //homeControlDiv.index = 1;
        var currentLocationControl = new CurrentLocationControl(homeControlDiv, map);
        //homeControlDiv.index = 2;
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
        //
 	// store in the root scope the reference to the map controller - this should be
	// sufficient to access all the other inner variables
	$rootScope.mapController = mapController;
	// define the function to centre at current location
	var useMyCurrentLocation = function useMyCurrentLocation () {
            // Try W3C Geolocation (Preferred)
            if(navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
		initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
		map.setZoom(14);
		map.setCenter(initialLocation);
		//map.panTo(initialLocation);
                mapPointer.position = initialLocation;
                mapPointer.title = 'Current Location';
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
        // store the function reference in the root scope, so we can call it from the view
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
            controlDiv.style.padding = '5px';
            var controlUI = document.createElement('div');
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Click to set the map to Home';
            controlUI.style.position = "relative";
            controlUI.style.display = "inline";
            controlUI.style.margin = "2px";
            controlDiv.appendChild(controlUI);
            var controlText = document.createElement('Button');
            controlText.textContent = '';
            controlText.className = 'btn btn-primary btn-xs';
            //controlText.style = 'width: 62px;';
            controlText.style.position = "relative";
            controlText.style.display = "inline";
            //controlText.style.margin = "5px";
            controlUI.appendChild(controlText);
            var controlTextGlyph = document.createElement('span');
            controlTextGlyph.className = 'glyphicon glyphicon-home';
            controlText.appendChild(controlTextGlyph);
            // Setup the click event listeners: simply set the map to
            // Heathrow
            google.maps.event.addDomListener(controlUI, 'click', function() {
                map.setZoom(homeZoom);
                map.setCenter(homeLatLng);
                mapPointer.position = homeLatLng;
                mapPointer.title = 'Home';
        
            });
        }
        //
        // define function to use current location
        function CurrentLocationControl(controlDiv, map) {
            // Set CSS styles for the DIV containing the control
            controlDiv.style.padding = '5px';
            var currentLocationControlUI = document.createElement('div');
            currentLocationControlUI.style.cursor = 'pointer';
            currentLocationControlUI.title = 'Click to set the map to Current Location';
            currentLocationControlUI.style.position = "relative";
            currentLocationControlUI.style.display = "inline";
            currentLocationControlUI.style.margin = "2px";
            controlDiv.appendChild(currentLocationControlUI);
            var controlText = document.createElement('Button');
            controlText.textContent = '';
            controlText.className = 'btn btn-primary btn-xs';
            //controlText.style = 'width: 62px;';
            controlText.style.position = "relative";
            controlText.style.display = "inline";
            //controlText.style.margin = "5px";
            currentLocationControlUI.appendChild(controlText);
            var controlTextGlyph = document.createElement('span');
            controlTextGlyph.className = 'glyphicon glyphicon-pushpin';
            controlText.appendChild(controlTextGlyph);
            // Setup the click event listeners: simply set the map to
            // Warwick
            google.maps.event.addDomListener(currentLocationControlUI, 'click', function() {
                //map.setZoom(homeZoom);
                //map.setCenter(new google.maps.LatLng(52.2920135,-1.5994146));
                useMyCurrentLocation();
            });
        }
}]);