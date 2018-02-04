var map;
var tweets;
function initMap(map) {
  var policeStations = [{"name":"1st Precinct: 16 Ericsson Pl, New York, NY 10013, USA","location":{"lat":40.7202455,"lng":-74.0070858}},{"name":"5th Precinct: 19 Elizabeth St, New York, NY 10013, USA","location":{"lat":40.7162009,"lng":-73.9974768}},{"name":"6th Precinct: 233 W 10th St, New York, NY 10014, USA","location":{"lat":40.7340002,"lng":-74.0054329}},{"name":"7th Precinct: 19 1/2 Pitt St, New York, NY 10002, USA","location":{"lat":40.71649682,"lng":-73.9839894}},{"name":"9th Precinct: 321 E 5th St, New York, NY 10003, USA","location":{"lat":40.7265384,"lng":-73.98782}},{"name":"10th Precinct: 230 W 20th St, New York, NY 10011, USA","location":{"lat":40.7427047,"lng":-73.9986444}},{"name":"13th Precinct: 230 E 21st St, New York, NY 10010, USA","location":{"lat":40.73673960000001,"lng":-73.9827007}},{"name":"Midtown South Precinct: 357 W 35th St, New York, NY 10001, USA","location":{"lat":40.7538231,"lng":-73.9950023}},{"name":"17th Precinct: 167 E 51st St, New York, NY 10022, USA","location":{"lat":40.7567424,"lng":-73.97077659999999}},{"name":"Midtown North Precinct: 306 W 54th St, New York, NY 10019, USA","location":{"lat":40.7649516,"lng":-73.9851039}},{"name":"19th Precinct: 153 E 67th St, New York, NY 10065, USA","location":{"lat":40.76717,"lng":-73.96379}},{"name":"20th Precinct: 120 W 82nd St, New York, NY 10024, USA","location":{"lat":40.78418120000001,"lng":-73.9749862}},{"name":"Central Park Precinct: 86th and Transverse Rd, New York, NY 10024, USA","location":{"lat":40.7833113,"lng":-73.96437159999999}},{"name":"23rd Precinct: 162 E 102nd St, New York, NY 10029, USA","location":{"lat":40.7890549,"lng":-73.9470836}},{"name":"24th Precinct: 151 W 100th St, New York, NY 10025, USA","location":{"lat":40.796503,"lng":-73.967192}},{"name":"25th Precinct: 120 E 119th St, New York, NY 10035, USA","location":{"lat":40.8008218,"lng":-73.9410566}},{"name":"26th Precinct: 520 W 126th St, New York, NY 10027, USA","location":{"lat":40.8147539,"lng":-73.95638529999999}},{"name":"28th Precinct: 2271-89 Frederick Douglass Blvd, New York, NY 10027, USA","location":{"lat":40.80885019999999,"lng":-73.9525697}},{"name":"30th Precinct: 451 W 151st St, New York, NY 10031, USA","location":{"lat":40.8288143,"lng":-73.94371599999999}},{"name":"32nd Precinct: 250 W 135th St, New York, NY 10030, USA","location":{"lat":40.81573059999999,"lng":-73.94535879999999}},{"name":"33rd Precinct: 2207 Amsterdam Ave, New York, NY 10032, USA","location":{"lat":40.84075,"lng":-73.9358766}},{"name":"34th Precinct: 4295 Broadway, New York, NY 10033, USA","location":{"lat":40.8515173,"lng":-73.9353799}}];
  for(var i = 0; i<policeStations.length; i++){
    var marker = new google.maps.Marker({
      position: {lat: policeStations[i]["location"]["lat"], lng: policeStations[i]["location"]["lng"]},
      map: map,
      title: policeStations[i]["name"],
      icon: "https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png"
    });
  }

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directions-panel'));
  var markerArray = [];
  var stepDisplay = new google.maps.InfoWindow;
  var onChangeHandler = function() {
    calculateAndDisplayRoute(
      directionsDisplay, directionsService, markerArray, stepDisplay, map);
  };
  document.getElementById('search').addEventListener('click', onChangeHandler);


  // var heatmapData = [
  //   {location: new google.maps.LatLng(40.744, -73.987), weight: 3},
  //   {location: new google.maps.LatLng(40.754, -73.987), weight: 3},
  //   {location: new google.maps.LatLng(40.764, -73.987), weight: 3},
  //   {location: new google.maps.LatLng(40.774, -73.987), weight: 3},

  // ]

  // var heatmap = new google.maps.visualization.HeatmapLayer({
  //   data: heatmapData,
  //   radius: 30
  // });

  // heatmap.setMap(map);

}

function findPlace(location){
  var key = "AIzaSyBy0VORo6CxYu0uJ3voASFRR0LITk798es";

  $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+location+",+NY&key="+key, function(data){
    $("#messageDestination").removeClass("hidden");
    $("#messageFormatDestination").text(data["results"][0]["formatted_address"]);
  });
}

function calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map){
  console.log("calculateAndDisplayRoute");
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }


  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('destination').value,
    travelMode: 'WALKING',
    provideRouteAlternatives: true
  }, function(response, status) {
    console.log(response);
    // Route the directions and pass the response to a function to create
    // markers for each step.
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function showSteps(directionResult, markerArray, stepDisplay, map) {
  // For each step, place a marker, and add the text to the marker's infowindow.
  // Also attach the marker to an array so we can keep track of it and remove it
  // when calculating new routes.
  var myRoute = directionResult.routes[0].legs[0];
  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
    marker.setMap(map);
    marker.setPosition(myRoute.steps[i].start_location);
    attachInstructionText(
        stepDisplay, marker, myRoute.steps[i].instructions, map);
  }
}

function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
$(document).ready(function() {
  $("#start").val("Times Square");
  $("#destination").val("Wall Street");
  windowHeight = $(window).height();
  headerHeight = $("#header").height();
  $("#map").css("height", windowHeight-headerHeight-20);

  $("#search").click(function(){
    $.get( "http://localhost:5000/checkPredatorLocation", {location: document.getElementById('destination').value}, function( data ) {
      if(data === "True"){
        $("#warningPredator").removeClass("hidden");
      }
    });
    findPlace( document.getElementById('destination').value);

    $.get( "http://localhost:5000/getCollisions", function(data){
      var collisions = JSON.parse(data);
      var heatmapData = []
      for(var i = 0; i<collisions.length; i++){
        heatmapData.push({location: new google.maps.LatLng(collisions[i][1], collisions[i][0]), weight: collisions[i][2]*10});
      }
      var heatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData,
        radius: 15
      });
      heatmap.setMap(map);
    });
  });

  $("#sendSMS").click(function(){
    console.log($("#phoneNumber").val()+" - "+$("#messageFormatDestination").text())
    $.post("http://localhost:5000/sendSMS", { number: $("#phoneNumber").val(), location: $("#messageFormatDestination").text() }, function(data){
      console.log(data);
    }, "json")
  });

  $("#destination").keypress(function(){
    console.log($("#warningPredator").hasClass("hidden"));
    if($("#warningPredator").hasClass("hidden") === false){
      console.log("makehidden")
      $("#warningPredator").addClass("hidden");
    }
  })
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.758896, lng: -73.985130},
    zoom: 14
  });
  initMap(map);
  var key = "AIzaSyBy0VORo6CxYu0uJ3voASFRR0LITk798es";
  // $.get("http://localhost:5000/getTweets", function(data){
  //     var tweets = JSON.parse(data);
  //     for(var i = 0; i<tweets.length; i++){
  //         $("#alerts").append("<div>"+tweets[i][0]+": "+tweets[i][1]+"</div>")
  //     }
  // });

  // $.get("http://localhost:5000/getTweets", function(data){
  //     var tweets = JSON.parse(data);
  //     console.log(tweets.length);
  //     for(var i = 0; i<tweets.length; i++){
  //       console.log(tweets[i]);
  //       $.get("https://maps.googleapis.com/maps/api/geocode/json?address="+tweets[i][0]+",+NY&key="+key, function(data){
  //
  //         var lat = data["results"][0]["geometry"]["location"]["lat"];
  //         var lng = data["results"][0]["geometry"]["location"]["lng"];
  //         console.log(lat+" "+lng);
  //
  //         var marker = new google.maps.Marker({
  //           position: {lat: lat, lng: lng},
  //           map: map,
  //           title: tweets[i][1],
  //           icon: "https://maps.google.com/mapfiles/kml/shapes/info-i_maps.png"
  //          });
  //       });
  //
  //     }
  // });
});
