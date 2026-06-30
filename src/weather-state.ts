import type { ForecastList, Weather } from "./common";
import type { IWeatherApi } from "./common";
import type { IWeatherState } from "./common";

export class WeatherState implements IWeatherState{
    private weather: Promise<Weather>;
    private forecast: Promise<ForecastList>;
    private iconUrl: string;
    private weatherAdapter: IWeatherApi;
    private city: string;
    private iconCode: string;
    public loading: boolean;
    public error: string | null;

    constructor(weatherAdapter: IWeatherApi, city: string, iconCode: string) {
        this.weatherAdapter = weatherAdapter;
        this.city = city;
        this.iconCode = iconCode;
        this.weather = weatherAdapter.getCurrentWeather(city);
        this.forecast = weatherAdapter.getForecast(city);
        this.iconUrl = weatherAdapter.getIconUrl(iconCode);
    }
}