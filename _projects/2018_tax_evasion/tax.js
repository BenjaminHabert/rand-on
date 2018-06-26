const mappa = new Mappa('Leaflet');
const NCITIES = 30;

let cities, allCities;
let earth;


function preload() {
  allCities = loadJSON("https://raw.githubusercontent.com/mahemoff/geodata/master/cities.geojson");
}

function setup() {
  let canvas = createCanvas(800, 500).parent('p5sketch');
  earth = mappa.tileMap({
    lat: 47.4596,
    lng: 2.7764,
    zoom: 4,
    style: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png'
  });
  earth.overlay(canvas)
  ellipseMode(CENTER);
}


function draw() {
  if (!cities) {
    if (earth.map) {
      prepareMap();
      cities = prepareCities(allCities);
    }
    else {
      return;
    }
  }

  clear();
  cities.forEach(city => city.updateInteraction())
  cities.forEach(city => city.update())
  cities.forEach(city => city.drawNeighbors())
  cities.forEach(city => city.drawCity())
  cities.forEach(city => city.drawCoins())
}


function prepareMap() {

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
    let newNeighbors = cities
      .sort((a, b) => city.distanceTo(a) - city.distanceTo(b))
      .slice(0, 2);

    for (let neighbor of newNeighbors) {
      neighbor.addNeighbor(city);
      city.addNeighbor(neighbor);
    }
  });

  return cities
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

    if (!sent && iterations < 3) {
      for (let neighbor of neighbors) {
        sent = neighbor.sendCoinToNeighbors(coin, iterations + 1);
        if (sent) {
          break;
        }
      }
    }

    return sent;
  }

  drawCity() {
    fill(255, 100);
    stroke(0, 100);
    strokeWeight(1);
    const pos = this.pos()
    ellipse(pos.x, pos.y, 20, 20);
  }

  drawNeighbors() {
    stroke(0, 50);
    strokeWeight(0.5);
    this.neighbors.forEach(to => {
      const fromPos = this.pos();
      const toPos = to.pos();
      line(fromPos.x, fromPos.y, toPos.x, toPos.y);
    })
  }

  drawCoins() {
    this.coins.forEach(coin => coin.draw());
  }

  addNeighbor(neighbor) {
    if(!this.neighbors.includes(neighbor)) {
      this.neighbors.push(neighbor);
    }
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


class Coin {
  constructor(city) {
    this.targetLat = city.lat;
    this.targetLng = city.lng;
    // current:
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
    ellipse(pos.x, pos.y, 13, 13);

    // const targetPos = earth.latLngToPixel(this.targetLat, this.targetLng);
    // strokeWeight(1);
    // stroke(100, 255, 100);
    // line(pos.x, pos.y, targetPos.x, targetPos.y);
  }
}



function mouseClicked() {
  console.log(earth.pixelToLatLng(mouseX, mouseY))
  console.log(earth.zoom())
}



//
// function myShuffle(arr) {
//   let original = arr.slice();
//   let final = [];
//   while (final.length < arr.length) {
//     let index = int(random(original.length))
//     final.push(original[index]);
//     original = original.splice(index, 1);
//   }
//   return final
// }
