let app;

function addCity() {
	let name = prompt("Add new city");
	document.getElementById("cityName").innerHTML = `${name[0].toUpperCase()}${name.substr(1)}`;
	getCoords(name);
}

function getCoords(city) {
	let locationQuery = `https://maps.googleapis.com/maps/api/geocode/json?address=${city}&key=${mapKey}`
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", locationQuery);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				if(response.status == "ZERO_RESULTS") {
					document.getElementById("map").style.display = "none";
					document.getElementById("wiki").style.display = "none";
					document.getElementById("news").style.display = "none";
					document.getElementById("weather").style.display = "none";
					document.getElementById("errorMessage").innerHTML = "No city with this name!";
					document.getElementById("errorBox").style.display = "flex";
				} else {
					let position = response.results[0].geometry.location;
					app = new App(city, position.lng, position.lat);
					app.start();
				}
			}
		}
		xhttp.onerror = function(err) {
			document.getElementById("map").style.display = "none";
			document.getElementById("wiki").style.display = "none";
			document.getElementById("news").style.display = "none";
			document.getElementById("weather").style.display = "none";
			document.getElementById("errorMessage").innerHTML = "No internet connection :(";
			document.getElementById("errorBox").style.display = "flex";
		}
}

function initMap() {
	return 1;
}

class App  {
	constructor(city, lng, lat) {
		this.city = city;
		this.lng = lng;
		this.lat = lat;
	}

	showMap() {
		let map = new google.maps.Map(document.getElementById('map'), {
	        zoom: 4,
	        center: {lat: this.lat, lng: this.lng}
	    });
	    let marker = new google.maps.Marker({
	        position: {lat: this.lat, lng: this.lng},
	        map: map
	    });
	    document.getElementById("map").style.display = "block";
	}

	getWiki() {
		let articleQuery = `https://en.wikipedia.org/w/api.php?format=json&origin=*&action=query&prop=extracts&exlimit=max&explaintext&exintro&titles=${this.city}&redirects=`;
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", articleQuery);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				let wiki = response.query.pages;
				let pageKey = Object.keys(wiki)[0];
				let wikiData = wiki[pageKey].extract;
				document.getElementById("wikiData").innerHTML = `${wikiData.substr(0, 1369)} ..... <a href='https://wikipedia.org'>Wikipedia</a>`;
				document.getElementById("wiki").style.display = "block";
				document.getElementById("wiki").height = `${document.getElementById("wikiData").offsetHeight}px`;
			}
		}
	}

	getNews() {
		let newsQuery = `https://newsapi.org/v2/everything?q=+${this.city}&apiKey=${newsKey}&sortBy=popularity`;
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", newsQuery);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				let response = JSON.parse(this.responseText);
				document.getElementById("news").style.display = "block";
				document.getElementById("newsTitle").innerHTML = response.articles[0].title;
				document.getElementById("newsAuthor").innerHTML = response.articles[0].author;
				document.getElementById("newsData").innerHTML = response.articles[0].description;
				document.getElementById("newsUrl").href = response.articles[0].url;
				document.getElementById("newsUrl").innerHTML = "Full Article";
			}
		}
	}

	getWeather() {
		let weatherQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lng}&units=metric&APPID=${weatherKey}`;
		let xhttp = new XMLHttpRequest();
		xhttp.open("GET", weatherQuery);
		xhttp.send();
		xhttp.onreadystatechange = function() {
			if(this.readyState == 4 && this.status == 200) {
				document.getElementById("weather").style.display = "inline-grid";
				let response = JSON.parse(this.responseText);
				document.getElementById("humidity").innerHTML = response.main.humidity;
				document.getElementById("pressure").innerHTML = response.main.pressure;
				document.getElementById("temp").innerHTML = response.main.temp;
				document.getElementById("tempMin").innerHTML = response.main.temp_min;
				document.getElementById("tempMax").innerHTML = response.main.temp_max;
				document.getElementById("wind").innerHTML = response.wind.speed;
				//document.getElementById("icon").src = `http://openweathermap.org/img/w/${response.weather[0].icon}.png`;
			}
		}
	}

	start() {
		if(document.getElementById("errorBox").style.display = "flex") document.getElementById("errorBox").style.display = "none";
		this.showMap();
		this.getWiki();
		this.getNews();
		this.getWeather();
	}
}

if("serviceWorker" in navigator) {
	navigator.serviceWorker.register("service-worker.js").then(() => console.log("service-worker registered"));
}