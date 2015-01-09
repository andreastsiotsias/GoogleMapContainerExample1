/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
angular.module("mapContainer.tsiotsias.uk")
    .factory('getLocationsService', function($http) {
        var getData = function() {
            return $http({method:"GET", url:"Locations.json"}).then(function(result){
                return result.data;
            });
        };
        return { getData: getData };
    });