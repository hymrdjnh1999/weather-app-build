import { DocumentCard, Icon, Image, PrimaryButton } from '@fluentui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import moment from 'moment';
import imageUrl from '../assets/img/right-arrow.png'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';

interface State {

}
export const Weather = () => {

    const date = new Date();
    const btnClassName = "my-1 switch-options--btn";
    useEffect(() => {
        requestData();
        requestDailyData();
    }, [])
    const defaultData: any = {};
    const [dailyData, setDailyData] = useState(defaultData);
    const [weatherData, setWeatherData] = useState(defaultData);
    const requestDailyData = () => {
        let dailyDataURL = 'https://community-open-weather-map.p.rapidapi.com/forecast/daily';
        axios.request({
            method: 'GET',
            url: dailyDataURL,
            params: {
                q: 'hanoi',
                cnt: 16,
                lat: '0',
                lon: '0',
                // callback: 'test',
                id: '2172797',
                lang: 'null',
                units: '"metric" or "imperial"',
                mode: 'xml, html'
            },
            headers: {
                'x-rapidapi-key': '64c9634279msh092ca792baec574p16f3f5jsn1abe401d3871',
                'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
            }
        }).then(function (response) {
            setDailyData(response.data);
        }).catch(function (error) {
            console.error(error);
        });
    }
    const requestData = () => {
        let weatherURL = 'https://community-open-weather-map.p.rapidapi.com/weather';
        axios.request({
            method: 'GET',
            url: weatherURL,
            params: {
                q: 'hanoi',
                // cnt: 5,
                lat: '0',
                lon: '0',
                // callback: 'test',
                id: '2172797',
                lang: 'null',
                units: '"metric" or "imperial"',
                mode: 'xml, html'
            },
            headers: {
                'x-rapidapi-key': '64c9634279msh092ca792baec574p16f3f5jsn1abe401d3871',
                'x-rapidapi-host': 'community-open-weather-map.p.rapidapi.com'
            }
        }).then(function (response) {
            setWeatherData(response.data);
        }).catch(function (error) {
            console.error(error);
        });

    }
    useEffect(() => {
        console.log('weatherData', weatherData);
        console.log('dailyData', dailyData);

        // setData(data);
    }, [weatherData, dailyData])
    const getCelsiusDegree = (kDegree: number) => {
        return Math.ceil(kDegree - 273.15) + "°";
    }
    const getWindSpeed = (speed: number) => {
        return Math.round(speed) + 'km/h';
    }
    const getVisibility = (visibility: number) => {
        return (visibility / 1000) + ' km';
    }

    const Details = () => {
        return weatherData.main && (

            <div className="daily-item">
                <span className="h5 m-0" >
                    Feels Like  {getCelsiusDegree(weatherData.main.feels_like)}
                </span>
                <span className="h5 m-0 ml-4" >
                    Wind  {getWindSpeed(weatherData.wind.speed)}
                </span>
                <span className="h5 m-0 ml-4">
                    Visibility {getVisibility(weatherData.visibility)}
                </span>
                <span className="h5 m-0 ml-4" >
                    Humidity  {weatherData.main.humidity + '%'}
                </span>
            </div>

        )
    }
    const getData = (date: number) => {
        const time = new Date(date * 1000);
        return moment(time).format('ddd') + ' ' + time.getDate();
    }
    const getImageUrl = (fileName: string) => {
        return `http://openweathermap.org/img/w/${fileName}.png`
    }
    const dailyList = () => {
        return dailyData.list && dailyData.list.map((item: any) => {
            return (<div className="daily-items d-flex flex-column align-items-center" >
                <span className="header">
                    {getData(item.dt)}
                </span>
                <Image src={getImageUrl(item.weather[0].icon)}></Image>
                <div className="d-flex">
                    <span className=" max-celsius">
                    </span>
                    <span className="min-celsius ml-4">
                        {getCelsiusDegree(item.temp.min)}
                    </span>
                </div>
                <div className="d-flex justify-content-center w-100" >
                    <span className="">
                        {item.weather[0].main}
                    </span>
                </div>
            </div>)
        })
    }
    return (weatherData &&
        <>
            <div className="weather-container">
            </div>
            <div className="weather-body d-flex align-items-center flex-column">
                <span className="h2 weather-location mt-6">
                    {weatherData.name}
                </span>
                <div className="weather-celsius d-flex align-items-center">
                    <Image src="https://openweathermap.org/img/w/04n.png"></Image>
                    <span className="ml-2" style={{ fontSize: '44px' }}>
                        {weatherData.main && getCelsiusDegree(weatherData.main.temp!)}
                    </span>
                </div>
                {weatherData.weather && weatherData.weather.map((weather: any) => {
                    return (<div className="weather-content h2 mt-0">
                        {weather.main}
                    </div>)
                })}
                <div className="update-time h3 mt-2">
                    {"Updated as of " + new Date().toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                </div>
                <div className="weather-bottom ">
                    {Details()}
                </div>
                <div className="container">
                    <span className="h1 text-light flex-start  " style={{ fontSize: '26px', fontWeight: 'normal' }}>
                        Daily
                </span>
                    <div className="position-relative daily-list d-flex justify-content-center mt-5">
                        <div className="arrow-icon" style={{ left: 0 }}>
                            <Image src={imageUrl} alt="" />

                        </div>
                        {dailyList()}
                        <div className="arrow-icon" style={{ right: 0 }}>
                            <div className="arrow arrow--next"></div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}