import { format, fromUnixTime } from 'date-fns';
import { enUS } from 'date-fns/locale';
import type { IWeatherState, Weather, ForecastList } from "./common";

class WeatherUi {
    private state: IWeatherState;

    constructor(state: IWeatherState) {
        this.state = state;
    }

    async render(): Promise<void> {
        const mainWeather = document.getElementById("main-weather") as HTMLElement;
        const loadingIndicator = document.getElementById("loading-indicator");
        if (!mainWeather || !loadingIndicator) return;

        loadingIndicator.hidden = false;
        loadingIndicator.textContent = "Загрузка...";

        try {
            const [weatherData, forecastData] = await Promise.all([this.state.weather, this.state.forecast]);

            this.state.setLoading(false);
            this.state.setError(null);
            loadingIndicator.hidden = true;

            this.renderWeatherContent(mainWeather, weatherData, forecastData);
        }   catch(error: any) {
                this.state.setLoading(false);
                this.state.setError(error.message || 'Ошибка загрузки данных');
                loadingIndicator.textContent = `Ошибка: ${this.state.error}`;
        }
    }

    private renderWeatherContent(container: HTMLElement, weather: Weather, forecast: ForecastList):void {
        const mainTempBlock = container.querySelector(".main-temp-block");
        const mainTimeBlock = container.querySelector(".main-time-block");
        const dailyList = container.querySelector(".daily-list");
        const hourlyList = container.querySelector(".hourly-list");
        if (!mainTempBlock || !mainTimeBlock || !dailyList || !hourlyList) return;

        const tempP = mainTempBlock.querySelector(".main-temp") as HTMLElement;
        const extendedP = mainTempBlock.querySelector(".extended-temp") as HTMLElement;

        let iconImg = mainTempBlock.querySelector(".weather-icon") as HTMLImageElement;
        if (!iconImg) {
            iconImg = document.createElement("img");
            iconImg.className = "weather-icon";
            mainTempBlock.insertBefore(iconImg, tempP);
        }
        iconImg.src = this.state.getIconUrl(weather.icon);
        iconImg.alt = weather.description;

        tempP.textContent = `${Math.round(weather.temp)}°C`;

        let extendedText = weather.description || "";
        if (weather.tempMin !== undefined && weather.tempMax !== undefined) {
            extendedText += ` ${Math.round(weather.tempMin)}°/${Math.round(weather.tempMax)}°`;
        }
        extendedP.textContent = extendedText;

        const timeElem = mainTimeBlock.querySelector(".time") as HTMLTimeElement;
        const dateElem = mainTimeBlock.querySelector(".date") as HTMLTimeElement;
        const cityP = mainTimeBlock.querySelector(".city-name") as HTMLElement;

        let weatherDate: Date;
        weatherDate = fromUnixTime(weather.dt);

        timeElem.dateTime = format(weatherDate, "yyyy-MM-dd'T'HH:mm:ss");
        timeElem.textContent = format(weatherDate, 'HH:mm');

        dateElem.dateTime = format(weatherDate, 'yyyy-MM-dd');
        dateElem.textContent = format(weatherDate, 'EEE, d MMM', { locale: enUS });

        cityP.textContent = weather.city;

        
    }
}