import type { ForecastList, Weather } from "./common";
import type { IWeatherApi } from "./common";
import type { IWeatherState } from "./common";

export class WeatherState implements IWeatherState{
    public weather: Promise<Weather>;
    public forecast: Promise<ForecastList>;
    private weatherAdapter: IWeatherApi;
    private city: string;
    public loading: boolean;
    public error: string | null;

    constructor(weatherAdapter: IWeatherApi, city: string, iconCode: string) {
        this.weatherAdapter = weatherAdapter;
        this.city = city;
        this.loading = true;
        this.error = null;
        this.weather = weatherAdapter.getCurrentWeather(city);
        this.forecast = weatherAdapter.getForecast(city);
    }

    getIconUrl(iconCode: string): string {
        return this.weatherAdapter.getIconUrl(iconCode);
    }

    setLoading(loading: boolean): void {
        this.loading = loading;
    }

    setError(error: string | null): void {
        this.error = error;
    }
}