import type { IWeatherState, Weather, ForecastList } from "./common";

export class WeatherUi {
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
        }   finally {
                mainWeather.innerHTML = "";
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

        const weatherDate = new Date(weather.dt * 1000);

        timeElem.dateTime = weatherDate.toISOString().split('.')[0];
        timeElem.textContent = weatherDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        });

        dateElem.dateTime =  weatherDate.toISOString().split('T')[0];
        dateElem.textContent = weatherDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric"
        });

        cityP.textContent = weather.city;

        let startIndex = 0;
        const now = new Date();

        for (let i = 0; i < forecast.items.length; i++) {
            const itemTime = new Date(forecast.items[i].date.replace(" ","T"));

            if (itemTime > now) {
                break;
            }
            startIndex = i;
        }

        for (let i = startIndex; i < startIndex + 2; i++) {
            if (!forecast.items[i]) break;
            const interval = forecast.items[i];
            const startHour = parseInt(interval.date.split(" ")[1].split(":")[0]);

            for (let j = 0; j < 3; j++) {
                const hour = startHour + j;
                const time = String(hour).padStart(2, "0") + ":00";
                const li = document.createElement("li");
                const spanForTime = document.createElement("span");
                spanForTime.className="span-for-time";
                spanForTime.textContent = time;
                const image = document.createElement("img");
                image.src = this.state.getIconUrl(interval.icon);
                const spanForTemp = document.createElement("span");
                spanForTemp.className = "span-for-temp";
                spanForTemp.textContent = Math.round(interval.temp) + "°";
                li.append(spanForTime, image, spanForTemp);
                hourlyList.appendChild(li);
            }
        }
        
        
    }
}