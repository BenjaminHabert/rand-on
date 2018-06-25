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
  cities.forEach(city => city.drawNeighbors())
  cities.forEach(city => city.drawCity())
  cities.forEach(city => city.drawMoney())
}


class Money {
  constructor(city) {
    this.currentCity = city;
    this.targetCity = city;
    // current
    this.lat = city.lat;
    this.lng = city.lng;
  }

  pos() {
    return earth.latLngToPixel(this.lat, this.lng);
  }
}


class City {
  constructor(id, lat, lng) {
    this.id = id;
    this.lat = lat;
    this.lng = lng;
    this.LngLat = [lng, lat];
    this.LatLng = [lat, lng];
    this.neighbors = [];

    this.money = [];
    for (let i = 0; i < 5; i++) {
      this.money.push(new Money(this));
    }
  }

  distanceTo(other) {
    if (this.id == other.id) {
      return Infinity;
    }
    return earth.map.distance(this.LatLng, other.LatLng);
  }

  drawCity() {
    fill(0);
    const pos = this.pos()
    ellipse(pos.x, pos.y, 10, 10);
  }

  drawNeighbors() {
    stroke(0);
    this.neighbors.forEach(to => {
      const fromPos = this.pos();
      const toPos = to.pos();
      line(fromPos.x, fromPos.y, toPos.x, toPos.y);
    })
  }

  drawMoney() {
    fill(255);
    this.money.forEach(m => {
      const pos = m.pos();
      ellipse(pos.x, pos.y, 8, 8);
    })
  }

  pos() {
    return earth.latLngToPixel(this.lat, this.lng);
  }
}


function mouseClicked() {
  console.log(earth.pixelToLatLng(mouseX, mouseY))
  console.log(earth.zoom())
}

function prepareCities(allCities) {
  // STEP 1: get sample of city from geojson object
  let cities = [];
  while (cities.length < NCITIES) {
    let randomCity = random(allCities.features);
    let id = randomCity.id
    if (!cities.map(city => city.id).includes(id)) {
      let lat = randomCity.geometry.coordinates[1],
          lng = randomCity.geometry.coordinates[0];  // geojson...
      cities.push(new City(id, lat, lng));
    }
  }


  // STEP 2: find 2 neighbors for each city
  cities.slice().forEach( city => {
    // using .slice() above because I then reorder the elements and I
    // don't want to miss a city in the forEach loop because of that
    // (it will miss some without it)
    city.neighbors = cities
      .sort((a, b) => city.distanceTo(a) - city.distanceTo(b))
      .slice(0, int(random(1.8, 3.2)));
  });

  return cities
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
