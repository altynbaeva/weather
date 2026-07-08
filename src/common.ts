export interface IWeatherApi {
    getCurrentWeather(city: string): Promise<Weather>;
    getForecast(city: string): Promise<ForecastList>;
    getIconUrl (iconCode: string): string;
}

export class Weather {
    temp: number = 0;
    tempMin: number = 0;
    tempMax: number = 0;
    description: string = "";
    icon: string = "";
    dt: number = 0;
    city: string = "";

    constructor(temp: number, tempMin: number, tempMax: number, description: string, icon: string, dt: number, city: string) {
        this.temp = temp;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.description = description;
        this.icon = icon;
        this.dt = dt;
        this.city = city;
    }
}

export class ForecastItem {
    date: string = "";
    temp: number = 0;
    tempMin: number = 0;
    tempMax: number = 0;
    description: string = "";
    icon: string = "";

    constructor(date: string, temp: number, tempMin: number, tempMax: number, description: string, icon: string) {
        this.date = date;
        this.temp = temp;
        this.tempMin = tempMin;
        this.tempMax = tempMax;
        this.description = description;
        this.icon = icon;
    }
}

export class ForecastList {
    city: string = "";
    items: ForecastItem[] = [];

    constructor(city: string, items: ForecastItem[]) {
        this.city = city;
        this.items = items;
    }
}

export interface IWeatherState {
    weather: Promise<Weather>;
    forecast: Promise<ForecastList>;
    loading: boolean;
    error: string | null;
    getIconUrl(iconCode: string): string;
    setLoading(loading: boolean): void;
    setError(error: string | null): void;
}