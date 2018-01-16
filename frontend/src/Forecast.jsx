import React from 'react';
import PropTypes from 'prop-types';

const baseURL = process.env.ENDPOINT;

const getForecastFromApi = async (cityId) => {
  try {
    if (cityId !== '') {
      const response = await fetch(`${baseURL}/forecast?cityId=${cityId}`);
      return response.json();
    }
    const response = await fetch(`${baseURL}/forecast`);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return {};
};

class Forecast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      forecasts: [],
      cityId: props.cityId,
    };
  }

  async componentWillMount() {
    const forecast = await getForecastFromApi(this.props.cityId);
    this.setState({ forecasts: forecast.slice(0, 5) });
  }

  render() {
    const forecastElements = this.state.forecasts.map(i =>
        (<div className="forecastbundle" key={`${i.dt}`}>
          <img src={`/img/${i.weather[0].icon.slice(0, -1)}.svg`} alt={`${i.weather[0].main}`} />
          <p className="forecasttime">{new Date(i.dt * 1000).toLocaleTimeString()}</p>
        </div>)
      );

    return (
      <div className="forecast">
        <h2>Forecast</h2>
        <div className="forecasts">{forecastElements}</div>
      </div>
    );
  }
}

Forecast.propTypes = {
  cityId: PropTypes.string,
};

Forecast.defaultProps = {
  cityId: '',
};

export default Forecast;
