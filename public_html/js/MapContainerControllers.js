/**
 * 
 */
angular.module("mapContainer.tsiotsias.uk")
    .controller("MapController", ['$rootScope','$scope', '$element', 'getLocationsService',
        function($rootScope, $scope, $element, getLocationsService) {
	// get the current controller address
	var mapController = this;
        // declare some variable with controller-wide scope
        var homeTitle;
        var homeLatLng;
        var homeZoom;
        var initialTitle;
        var initialLatLng;
        var initialZoom;
        var map;
        var mapPointer;
        var locations;
        var useMyCurrentLocation;
        // Get a list of Locations to build for
        var locationsPromise = getLocationsService.getData();
        locationsPromise.then(function(result) {  // this is only run after $http completes
            locations = result;
            initialiseMap();
            });        
        //
        // add a control to the map
        /**
        * The HomeControl adds a control to the map that simply
        * returns the user to Chicago. This constructor takes
        * the control DIV as an argument.
        * @constructor
        */
        function HomeLocationControl(controlDiv, map) {
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
                moveMapPointer (homeLatLng,homeTitle);
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
                useMyCurrentLocation();
            });
        }
        //
        function OtherLocationsControl(controlDiv, map) {
            // Set CSS styles for the DIV containing the control
            controlDiv.style.padding = '5px';
            var controlUI = document.createElement('div');
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Click for other locations';
            controlUI.style.position = "relative";
            controlUI.style.display = "inline";
            controlUI.style.margin = "2px";
            controlDiv.appendChild(controlUI);
            var controlText = document.createElement('Button');
            controlText.textContent = '';
            controlText.className = 'btn btn-warning btn-xs';
            //controlText.style = 'width: 62px;';
            controlText.style.position = "relative";
            controlText.style.display = "inline";
            //controlText.style.margin = "5px";
            controlUI.appendChild(controlText);
            var controlTextGlyph = document.createElement('span');
            controlTextGlyph.className = 'glyphicon glyphicon-list';
            controlText.appendChild(controlTextGlyph);
            // Create the location selection modal dialogue
            var locationSelectionDialogue = document.createElement('div');
            locationSelectionDialogue.className = 'modal fade';
            locationSelectionDialogue.setAttribute("id", "locationSelectionDialogue");
            locationSelectionDialogue.setAttribute("tabindex", "-1");
            locationSelectionDialogue.setAttribute("role", "dialog");
            locationSelectionDialogue.setAttribute("aria-labelledby", "locationSelectionTitle");
            locationSelectionDialogue.setAttribute("aria-hidden", "true");
            // add the actual modal dialogue container
            var locationSelectionDialogueContainer = document.createElement('div');
            locationSelectionDialogueContainer.className = 'modal-dialog modal-sm';
            locationSelectionDialogue.appendChild(locationSelectionDialogueContainer);
            // add the content container
            var locationSelectionDialogueContent = document.createElement('div');
            locationSelectionDialogueContent.className = 'modal-content';
            locationSelectionDialogueContainer.appendChild(locationSelectionDialogueContent);
            // add the header content
            var locationSelectionDialogueHeader = document.createElement('div');
            locationSelectionDialogueHeader.className = 'modal-header';
            locationSelectionDialogueContent.appendChild(locationSelectionDialogueHeader);
            // add the close/exit decoration (button with glyph only) to the dialogue header on top right corner
            var locationSelectionDialogueHeaderExit = document.createElement('button');
            locationSelectionDialogueHeaderExit.className = 'close';
            locationSelectionDialogueHeaderExit.setAttribute("type", "button");
            locationSelectionDialogueHeaderExit.setAttribute("data-dismiss", "modal");
            locationSelectionDialogueHeaderExit.setAttribute("aria-hidden", "true");
            //locationSelectionDialogueHeaderExit.textContent = TIMES;
            locationSelectionDialogueHeader.appendChild(locationSelectionDialogueHeaderExit);
            // add the 'close window' glyph icon to the button
            var locationSelectionDialogueHeaderExitGlyph = document.createElement('span');
            locationSelectionDialogueHeaderExitGlyph.className = 'glyphicon glyphicon-remove-circle';
            locationSelectionDialogueHeaderExit.appendChild(locationSelectionDialogueHeaderExitGlyph);
            // add the heading label to the dialogue header
            var locationSelectionDialogueHeaderLabel = document.createElement('h5');
            locationSelectionDialogueHeaderLabel.className = 'modal-title';
            locationSelectionDialogueHeaderLabel.setAttribute("id", "locationSelectionTitle");
            locationSelectionDialogueHeaderLabel.textContent = 'Select a location ......';
            locationSelectionDialogueHeader.appendChild(locationSelectionDialogueHeaderLabel);
            // add the body content
            var locationSelectionDialogueBody = document.createElement('div');
            locationSelectionDialogueBody.className = 'modal-body';
            locationSelectionDialogueContent.appendChild(locationSelectionDialogueBody);
            // add the location selection options
            var locationSelectionOptions = document.createElement('select');
            locationSelectionOptions.className = 'form-control btn-warning';
            locationSelectionOptions.setAttribute("id", "locationSelectionOptions");
            locationSelectionDialogueBody.appendChild(locationSelectionOptions);
            // add the footer content
            var locationSelectionDialogueFooter = document.createElement('div');
            locationSelectionDialogueFooter.className = 'modal-footer';
            locationSelectionDialogueContent.appendChild(locationSelectionDialogueFooter);
            // add the Go button to the footer
            var locationSelectionGoButton = document.createElement('button');
            locationSelectionGoButton.className = 'btn btn-primary btn-xs';
            locationSelectionGoButton.setAttribute("id", "locationSelectionGoButton");
            locationSelectionGoButton.setAttribute("type", "button");
            //locationSelectionGoButton.textContent = 'Go';
            locationSelectionDialogueFooter.appendChild(locationSelectionGoButton);
            // add a glyph to the Go button
            var locationSelectionGoButtonGlyph = document.createElement('span');
            locationSelectionGoButtonGlyph.className = 'glyphicon glyphicon-ok-sign';
            locationSelectionGoButton.appendChild(locationSelectionGoButtonGlyph);
            //
            // Setup variables related to the location selection modal dialogue
            //var locationSelectionDialogue = $("#locationSelectionDialogue");
            //var locationSelectionOptions = $("#locationSelectionOptions")[0];
            //var locationSelectionGoButton = $("#locationSelectionGoButton")[0];
            // Create the list of locations based on the Locations.json data
            for (i=0; i<locations.Target.length; i++) {
                option=document.createElement('option');
                option.textContent = locations.Target[i].Title;
                locationSelectionOptions.appendChild(option);
            }
            // Setup the click event listener on the location list in map
            google.maps.event.addDomListener(controlUI, 'click', function() {
                //Just show the location selection modal dialogue
                $(locationSelectionDialogue).modal('show');
            });
            // Setup the click event listener on the Go button of the modal dialogue
            google.maps.event.addDomListener(locationSelectionGoButton, 'click', function () {
                var locationIndex = $("#locationSelectionOptions")[0].selectedIndex;
                map.setZoom(locations.Target[locationIndex].Zoom);
                gotoLatLng = new google.maps.LatLng(locations.Target[locationIndex].Lat, 
                    locations.Target[locationIndex].Lng);
                map.setCenter(gotoLatLng);
                moveMapPointer (gotoLatLng,locations.Target[locationIndex].Title);
                $(locationSelectionDialogue).modal('hide');   
            });
        }
        //
        function ResetLocationsControl(controlDiv, map) {
            // Set CSS styles for the DIV containing the control
            controlDiv.style.padding = '5px';
            var controlUI = document.createElement('div');
            controlUI.style.cursor = 'pointer';
            controlUI.title = 'Click to reset map';
            controlUI.style.position = "relative";
            controlUI.style.display = "inline";
            controlUI.style.margin = "2px";
            controlDiv.appendChild(controlUI);
            var controlText = document.createElement('Button');
            controlText.textContent = '';
            controlText.className = 'btn btn-success btn-xs';
            //controlText.style = 'width: 62px;';
            controlText.style.position = "relative";
            controlText.style.display = "inline";
            //controlText.style.margin = "5px";
            controlUI.appendChild(controlText);
            var controlTextGlyph = document.createElement('span');
            controlTextGlyph.className = 'glyphicon glyphicon-refresh';
            controlText.appendChild(controlTextGlyph);
            // Setup the click event listeners
            google.maps.event.addDomListener(controlUI, 'click', function() {
                map.setZoom(initialZoom);
                map.setCenter(initialLatLng);
                moveMapPointer (initialLatLng,initialTitle);
            });
        }
        //
        // Move primary marker to a specified position and
        // specify a new title for it
        function moveMapPointer (newPos, newTitle) {
            mapPointer.setPosition(newPos);
            mapPointer.setTitle(newTitle);
        }
        //
        function initialiseMap(){
            // set up some starter options
            // set up the initial latitude & lognitude
            initialTitle = locations.Initial.Title;
            initialZoom = locations.Initial.Zoom;
            initialLatLng = new google.maps.LatLng(locations.Initial.Lat, locations.Initial.Lng);
            var myOptions = {
                zoom: initialZoom,
                center: initialLatLng,
                panControl: false,
                zoomControl: false,
                scaleControl: true,
                overviewMapControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            homeTitle = locations.Home.Title;
            homeLatLng = new google.maps.LatLng(locations.Home.Lat, locations.Home.Lng);
            homeZoom = locations.Home.Zoom;
            // get the map container element
            var mapElement = $element[0];
            // create the map & display
            map = new google.maps.Map(mapElement, myOptions);
            // put an initial marker on the map
            mapPointer = new google.maps.Marker({
                position: initialLatLng, 
                map: map, 
                title: initialTitle});
            //
            // Create the DIV to hold the control and
            // call the HomeControl() constructor passing
            // in this DIV.
            var mapControlDiv = document.createElement('div');
            var resetLocationsControl = new ResetLocationsControl(mapControlDiv, map);
            var homeLocationControl = new HomeLocationControl(mapControlDiv, map);
            var currentLocationControl = new CurrentLocationControl(mapControlDiv, map);
            var otherLocationsControl = new OtherLocationsControl(mapControlDiv, map);
            map.controls[google.maps.ControlPosition.TOP_RIGHT].push(mapControlDiv);
            //
            // Check if any 'predefined' locations have been specified
            if (locations.Target.length > 0) {
                //alert("Predefined Locations : "+locations.Target.length);
                //for (i=0;i<locations.Target.length; i++) {
                //    alert("Location "+i+" Title : "+locations.Target[i].Title);
                //}
            }
            //
            // store in the root scope the reference to the map controller
            $rootScope.mapController = mapController;
            // define the function to centre map at current location
            useMyCurrentLocation = function useMyCurrentLocation () {
                // Try W3C Geolocation (Preferred)
                if(navigator.geolocation) {
                    browserSupportFlag = true;
                    navigator.geolocation.getCurrentPosition(function(position) {
                    initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                    map.setZoom(14);
                    map.setCenter(initialLocation);
                    // put the pointer in
                    moveMapPointer (initialLocation,'Current Location');
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
        }
}]);