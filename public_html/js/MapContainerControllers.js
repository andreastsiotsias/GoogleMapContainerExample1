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
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        // get the map container element
        //var _controllerName="MapController";
        //var mapElementArray = angular.element(document.querySelector('[ng-controller='+_controllerName+']'));
        //$scope.mapElement = mapElementArray[0];
		var mapElement = $element[0];
		// create the map & display
		var map = new google.maps.Map(mapElement, myOptions);
		// define the function to centre at current location
		var useMyCurrentLocation = function (command) {
			// Try W3C Geolocation (Preferred)
			  if(navigator.geolocation) {
			    browserSupportFlag = true;
			    navigator.geolocation.getCurrentPosition(function(position) {
			      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
			      map.setZoom(14);
			      //map.setCenter(initialLocation);
			      map.panTo(initialLocation);
			    }, function() {
			      handleNoGeolocation(browserSupportFlag);
			    });
			  }
			  // Browser doesn't support Geolocation
			  else {
			    browserSupportFlag = false;
			    handleNoGeolocation(browserSupportFlag);
			  }

			  function handleNoGeolocation(errorFlag) {
			    if (errorFlag == true) {
			      window.alert("Geolocation service failed.");
			    } else {
			      window.alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			    }
			  }
                    //alert("Was given command:"+command);
		}
		// store in the root scope the reference to the map controller - this should be
		// sufficient to access all the other inner variables
		$rootScope.mapController = mapController;
		$rootScope.mapController.useMyCurrentLocation = useMyCurrentLocation;
	}]);