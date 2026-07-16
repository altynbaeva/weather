import './style.css'

const openWeatrherMapAdapter = new OpenWeatherMapAdapter();
const defaultCity = "Moscow";
const weatherState = new WeatherState(openWeatrherMapAdapter, defaultCity, )

const weatherUi = new WeatherUi(weatherState);