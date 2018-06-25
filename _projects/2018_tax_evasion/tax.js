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
  Object.values(cities).forEach(city => {
    let pos = earth.latLngToPixel(city.lat, city.lng);
    ellipse(pos.x, pos.y, 10, 10);
  });

  // links between cities
  Object.values(cities).forEach(from => {
    Object.values(from.neighbors).forEach(to => {
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
      cities[id] = new City(id, lat, lng);
    }
  }


  // STEP 2: find 2 neighbors for each city
  citiesArray = Object.values(cities);
  Object.keys(cities).forEach( id => {
    let city = cities[id];
    city.neighbors = citiesArray
      .sort((a, b) => city.distanceTo(a) - city.distanceTo(b))
      .slice(0, int(random(1.8, 3.2)))
      // .map(other => other.id);
  });

  return cities
}

class City {
  constructor(id, lat, lng) {
    console.log(id, lat, lng)
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.LngLat = [lng, lat];
    this.LatLng = [lat, lng];
    this.neighbors = [];
  }

  distanceTo(other) {
    if (this.id == other.id) {
      return Infinity;
    }
    return earth.map.distance(this.LatLng, other.LatLng);
  }
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
