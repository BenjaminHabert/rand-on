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
  cities.forEach(city => city.updateInteraction())
  cities.forEach(city => city.update())
  cities.forEach(city => city.draw())


  let sum = 0;
  for (city of cities) {
    for (coin of city.coins) {
      sum += 1
    }
  }
  // console.log(sum);
}


class Coin {
  constructor(city) {
    this.targetLat = city.lat;
    this.targetLng = city.lng;
    // current
    this.lat = city.lat;
    this.lng = city.lng;
  }

  pos() {
    return earth.latLngToPixel(this.lat, this.lng);
  }

  update() {
    this.lat = map(0.1, 0, 1, this.lat, this.targetLat);
    this.lng = map(0.1, 0, 1, this.lng, this.targetLng);
  }

  draw() {
    const pos = this.pos();

    fill(255, 100, 100, 100);
    stroke(240, 90, 90, 120)
    ellipse(pos.x, pos.y, 18, 19);


    const targetPos = earth.latLngToPixel(this.targetLat, this.targetLng);
    strokeWeight(1);
    stroke(100, 255, 100);
    line(pos.x, pos.y, targetPos.x, targetPos.y);
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
    this.canReceive = true;

    this.coins = [];
    for (let i = 0; i < 5; i++) {
      this.coins.push(new Coin(this));
    }
  }

  updateInteraction() {
    const pos = this.pos();
    this.canReceive = true;
    if (dist(pos.x, pos.y, mouseX, mouseY) < 50) {
      this.canReceive = false;
    }
  }

  update() {
    if (!this.canReceive && this.coins.length > 0) {
      this.coins = this.coins.filter(coin => !this.sendCoinToNeighbors(coin, 0));
    }

    this.coins.forEach(coin => coin.update());
  }

  sendCoinToNeighbors(coin, iterations) {
    let neighbors = shuffle(this.neighbors);
    let sent = false
    for (let neighbor of neighbors) {
      if (neighbor.canReceive) {
        neighbor.coins.push(coin);
        coin.targetLat = neighbor.lat;
        coin.targetLng = neighbor.lng;
        sent = true;
        break;
      }
    }

    if (!sent & iterations < 2) {
      for (let neighbor of neighbors) {
        sent = neighbor.sendCoinToNeighbors(coin, iterations + 1);
        if (sent) {
          break;
        }
      }
    }

    return sent;
  }

  draw() {
    this.drawCity();
    this.drawNeighbors();
    this.drawCoins();
  }

  drawCity() {
    // fill(this.canReceive? 0: 'rgb(255, 100, 100)');
    fill(255, 100);
    stroke(0, 100);
    strokeWeight(1);
    const pos = this.pos()
    ellipse(pos.x, pos.y, 20, 20);
  }

  drawNeighbors() {
    stroke(0, 100);
    strokeWeight(1);
    this.neighbors.forEach(to => {
      const fromPos = this.pos();
      const toPos = to.pos();
      line(fromPos.x, fromPos.y, toPos.x, toPos.y);
    })
  }

  drawCoins() {
    this.coins.forEach(coin => coin.draw());
  }

  pos() {
    return earth.latLngToPixel(this.lat, this.lng);
  }

  distanceTo(other) {
    if (this.id == other.id) {
      return Infinity;
    }
    return earth.map.distance(this.LatLng, other.LatLng);
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