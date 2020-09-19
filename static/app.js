function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for(var i in uiBathrooms) {
    if(uiBathrooms[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1;
}

function getBedValue() {
  var uiBedroom = document.getElementsByName("uiBathrooms");
  for(var i in uiBedroom) {
    if(uiBedroom[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1;
}

function getToiletValue() {
  var uiToilets = document.getElementsByName("uiToilets");
  for(var i in uiToilets) {
    if(uiToilets[i].checked) {
        return parseInt(i)+1;
    }
  }
  return -1;
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked");
  var bedrooms = getBedValue();
  var bathrooms = getBathValue();
  var toilets = getToiletValue();
  var location = document.getElementById("uiLocations");
  var estPrice = document.getElementById("uiEstimatedPrice");

  console.log(location.value,bathrooms,bedrooms,toilets)

  var entry = {
      location: location.value,
      bathrooms: bathrooms,
      bedrooms: bedrooms,
      toilets : toilets
  }

  fetch('/predict_home_price', {
        method: 'POST',
        body : JSON.stringify(entry),
        headers: {
          "content-type": "application/json"
        }
      }).then(function(response){
        if (response.status !==200){
          console.log('There was a problem. Status code : ',response.status);
        }
        return response.json();
      }).then(function(data){
        console.log('POST response: ', data);
        value = data.estimated_price
        a = Math.round(value/100000)*100000
        b = a - 50000
        c = a + 50000
        estPrice.innerHTML = "<h2> Between #" + b.toLocaleString() + ' - #' + c.toLocaleString() + " Naira</h2>";
      console.log(status);
      })
    }

function onPageLoad() {
  console.log( "url document loaded ok" );

  fetch ('/locations')
      .then(function(response) {
           return response.json();
      }).then(function(data){
      console.log("successfuly got response for get_location_names request");
      if(data) {
          console.log('text locations are: ', data)
          var locations = data.locations;
          var uiLocations = document.getElementById("uiLocations");
          console.log(locations);
          $('#uiLocations').empty();
          for(var i in locations) {
              var opt = new Option(locations[i]);
              $('#uiLocations').append(opt);
          }
      }
  });
  
    }

window.onload = onPageLoad;