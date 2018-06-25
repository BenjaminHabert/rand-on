const mappa = new Mappa('Leaflet');
let cities, allCities;
let earth;
const NCITIES = 20;


function preload() {
  console.log('preload')
  allCities = loadJSON("https://raw.githubusercontent.com/mahemoff/geodata/master/cities.geojson");
}

function setup() {
  let canvas = createCanvas(600, 600).parent('p5sketch');
  earth = createMap(canvas);
  ellipseMode(CENTER);
}


function draw() {
  if (!cities) {
    if (earth.map) {
      cities = prepareCities(allCities);
    }
    else {
      return;
    }
  }

  clear();
  showCities(cities);
}


function showCities(cities) {
  fill(0);
  stroke(0);

  // cities
  Object.values(cities).forEach(function (city) {
    let pos = earth.latLngToPixel(city.lat, city.lng);
    ellipse(pos.x, pos.y, 10, 10);
  });

  // links between cities
  Object.values(cities).forEach(from => {
    Object.values(from.neighbors).forEach(toId => {
      let to = cities[toId];

      const fromPos = earth.latLngToPixel(from.lat, from.lng);
      const toPos = earth.latLngToPixel(to.lat, to.lng);
      line(fromPos.x, fromPos.y, toPos.x, toPos.y);
    });
  });
}


function mouseClicked() {
  console.log(earth.pixelToLatLng(mouseX, mouseY))
  console.log(earth.zoom())
}

function prepareCities(allCities) {
  // STEP 1: get sample of city from geojson object
  let cities = {};
  while (Object.keys(cities).length < NCITIES) {
    let randomCity = random(allCities.features);
    let id = randomCity.id
    if (!Object.keys(cities).includes(id)) {
      let lat = randomCity.geometry.coordinates[1],
          lng = randomCity.geometry.coordinates[0];  // geojson...
      cities[id] = {
        'name': randomCity.properties.city,
        'id': id,
        'LngLat': [lng, lat],
        'LatLng' : [lat, lng],
        'lat': lat,
        'lng': lng,
      };
    }
  }


  // STEP 2: find 2 neighbors for each city
  citiesArray = Object.values(cities);
  Object.keys(cities).forEach( id => {
    let city = cities[id];
    city.neighbors = citiesArray
      .sort((a, b) => cityDistance(city, a) - cityDistance(city, b))
      .slice(0, int(random(1.8, 3.2)))
      .map(other => other.id);
    console.log(city)
  });

  return cities
}

function cityDistance(city, other) {
  if (city.id == other.id) {
    return Infinity;
  }
  return earth.map.distance(city.LatLng, other.LatLng);
}

function createMap(canvas) {
  let map = mappa.tileMap({
    lat: 47.4596,
    lng: 2.7764,
    zoom: 1,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  });
  map.overlay(canvas)
  return map
}
