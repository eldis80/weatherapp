import React from 'react';
import ReactDOM from 'react-dom';
import Forecast from './Forecast';

const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async (position) => {
  try {
    if (position !== undefined) {
      const response = await fetch(`${baseURL}/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}`);
      return response.json();
    }
    const response = await fetch(`${baseURL}/weather`);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      main: '',
      position: '',
      locationStatus: 'locating',
      city: '',
      cityId: '',
    };
  }

  async componentWillMount() {
    if ('geolocation' in navigator) {
      /* geolocation is available */
      navigator.geolocation.getCurrentPosition(async (positionGeo) => {
        this.setState({
          position: positionGeo,
          locationStatus: 'success',
        });
        const weather = await getWeatherFromApi(positionGeo);
        this.setState({
          icon: weather[0].icon.slice(0, -1),
          main: weather[0].main,
          city: weather[1].city,
          cityId: weather.id });
      }, () => {
        this.setState({ locationStatus: 'error' });
      });
    } else {
      this.setState({ locationStatus: 'not available' });
    }
    // const weather = await getWeatherFromApi();
    // this.setState({ icon: weather.icon.slice(0, -1), main: weather.main });
  }

  render() {
    const { icon, main, locationStatus, city, cityId } = this.state;
    if (locationStatus === 'locating') {
      return (
        <div className="locationStatus">
          <p>Locating...</p>
        </div>
      );
    } else if (locationStatus === 'error') {
      return (
        <div className="locationStatus">
          <p>Error retrieving location.</p>
        </div>
      );
    } else if (locationStatus === 'not available') {
      return (
        <div className="locationStatus">
          <p>Geolocation is not supported by your browser.</p>
        </div>
      );
    }
    return (
      <div className="icon">
        <h2>Weather in {city}</h2>
        { icon && <img src={`/img/${icon}.svg`} alt={`${main}`} /> }
        <Forecast cityId={cityId} />
      </div>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app')
);
