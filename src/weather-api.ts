import axios from "axios";
import type { IWeatherApi } from "./common";
import { ForecastItem, ForecastList, Weather } from "./common";

export class OpenWeatherMapAdapter implements IWeatherApi {
    private baseUrl = "https://api.openweathermap.org"

    private validateObjResponse(data: unknown): Record <string, unknown> {
        if (data == null) throw new Error ("Ответ Api равен null!");
        if (typeof data !== "object") throw new Error ("Ответ Api не является объектом!");
        if (Array.isArray(data)) throw new Error ("Ответ Api является массивом!");
        return data as Record <string, unknown>;
    }

    private validateCurrentWeatherData(data: unknown): CurrentWeatherData {
        const obj = this.validateObjResponse(data);

        if (!obj.main || typeof obj.main !== 'object' || Array.isArray(obj.main)) {
            throw new Error("Не удалось получить погоду!")
        }

        const main = obj.main as Record<string, unknown>;

        if (typeof main.temp !== "number" || isNaN(main.temp)) {
            throw new Error("Не удалось получить погоду!")
        }

        if (typeof main.temp_min !== "number" || isNaN(main.temp_min)) {
            throw new Error("Не удалось получить погоду!")
        }

        if (typeof main.temp_max !== "number" || isNaN(main.temp_max)) {
            throw new Error("Не удалось получить погоду!")
        }

        if (!Array.isArray(obj.weather) || obj.weather.length === 0) {
            throw new Error("Не удалось получить погоду!")
        } 

        const weatherFirst = obj.weather[0];

        if (!weatherFirst || typeof weatherFirst !== "object") {
            throw new Error("Не удалось получить погоду!")
        }

        const weather = weatherFirst as Record<string, unknown>;

        if (typeof weather.description !== "string" || !weather.description) {
            throw new Error("Не удалось получить погоду!")
        }

        if (typeof weather.icon !== "string" || !weather.icon) {
            throw new Error("Не удалось получить погоду!")
        }

        if (!obj.name || typeof obj.name !== "string") {
            throw new Error("Не удалось получить погоду!")
        }

        return {
            main: {
                temp: main.temp as number,
                tempMin: main.temp_min as number,
                tempMax: main.temp_max as number
            },
            weather: [
                {
                    description: weather.description as string,
                    icon: weather.icon as string
                }
            ],
            name: obj.name as string
        }
    }

    private validateForecastData(data: unknown): ForecastData {
        const obj = this.validateObjResponse(data);

        if (!Array.isArray(obj.list) || obj.list.length === 0) {
            throw new Error("Не удалось получить прогноз!")
        } 

        const firstItem = obj.list[0];
        if (!firstItem || typeof firstItem !== 'object' || Array.isArray(firstItem)) {
            throw new Error("Не удалось получить прогноз!");
        }

        const item = firstItem as Record<string, unknown>;

        if (typeof item.dt_txt !== 'string' || !item.dt_txt) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (!item.main || typeof item.main !== 'object' || Array.isArray(item.main)) {
            throw new Error("Не удалось получить прогноз!");
        }

        const main = item.main as Record<string, unknown>;
        if (typeof main.temp !== 'number' || isNaN(main.temp)) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (typeof main.temp_min !== "number" || isNaN(main.temp_min)) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (typeof main.temp_max !== "number" || isNaN(main.temp_max)) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (!Array.isArray(item.weather) || item.weather.length === 0) {
            throw new Error("Не удалось получить прогноз!");
        }
        const weatherFirst = item.weather[0];

        if (!weatherFirst || typeof weatherFirst !== 'object') {
            throw new Error("Не удалось получить прогноз!");
        }

        const weather = weatherFirst as Record<string, unknown>;
        if (typeof weather.description !== 'string' || !weather.description) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (typeof weather.icon !== 'string' || !weather.icon) {
            throw new Error("Не удалось получить прогноз!");
        }

        if (!obj.city || typeof obj.city !== 'object' || Array.isArray(obj.city)) {
            throw new Error("Не удалось получить прогноз!");
        }
        const city = obj.city as Record<string, unknown>;

        if (!city.name || typeof city.name !== 'string') {
            throw new Error("Не удалось получить прогноз!");
        }

        return {
            list: obj.list as Array<{
            dt_txt: string;
            main: { 
                temp: number,
                tempMin: number,
                tempMax: number
             };
            weather: Array<{ description: string; icon: string }>;
            }>,
            city: {
                name: city.name as string
            }
        }
    }

    public async getCurrentWeather(city: string): Promise<Weather> {
        const url = `${this.baseUrl}/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_WEATHER_API_KEY}&units=metric&lang=ru`;
        
        try {
            const response = await axios.get(url);
            const data = this.validateCurrentWeatherData(response.data);
            const weather = new Weather(data.main.temp, data.main.tempMin, data.main.tempMax, data.weather[0].description, data.weather[0].icon, data.name);
            return weather;
        }

        catch (error) {
            throw new Error('Не удалось получить данные о погоде!');
        }
    }

    public async getForecast(city: string): Promise<ForecastList> {
        const url = `${this.baseUrl}/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${import.meta.env.VITE_WEATHER_API_KEY}`;

        try {
            const response = await axios.get(url);
            const data = this.validateForecastData(response.data);
            const items: ForecastItem[] = [];
            for (let i = 0; i < data.list.length; i++) {
                const forecastItem = new ForecastItem(data.list[i].dt_txt, data.list[i].main.temp, data.list[i].main.tempMin, data.list[i].main.tempMax, data.list[i].weather[0].description, data.list[i].weather[0].icon);
                items.push(forecastItem)
            }
            return new ForecastList(data.city.name, items);
        }

        catch (error) {
            throw new Error('Не удалось получить данные о прогнозе!');
        }
    }

    public getIconUrl (iconCode: string): string {
        return `${this.baseUrl}/payload/api/media/file/${iconCode}@2x.png`
    }
}

export interface CurrentWeatherData {
    main: {
        temp: number;
        tempMin: number;
        tempMax: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    name: string;
}

export interface ForecastData {
    list: Array<{
        dt_txt: string;
        main: {
            temp: number;
            tempMin: number;
            tempMax: number
        }
        weather: Array<{
            description: string;
            icon: string;
        }>
    }>;
    city: {
        name: string;
    }
}