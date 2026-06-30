export interface IWeatherApi {
    getCurrentWeather(city: string): Promise<Weather>;
    getForecast(city: string): Promise<ForecastList>;
    getIconUrl (iconCode: string): string;
}

export class Weather {
    temp: number = 0;
    description: string = "";
    icon: string = "";
    city: string = "";

    constructor(temp: number, description: string, icon: string, city: string) {
        this.temp = temp;
        this.description = description;
        this.icon = icon;
        this.city = city;
    }
}

export class ForecastItem {
    date: string = "";
    temp: number = 0;
    description: string = "";
    icon: string = "";

    constructor(date: string, temp: number, description: string, icon: string) {
        this.date = date;
        this.temp = temp;
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
    
}