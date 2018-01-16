const Koa = require('koa');
const router = require('koa-router')();
const fetch = require('node-fetch');
const cors = require('kcors');

const appId = process.env.APPID || '68242a0df67bbe234ffe21a2571c78b0';
const mapURI = process.env.MAP_ENDPOINT || 'http://api.openweathermap.org/data/2.5';
const targetCity = process.env.TARGET_CITY || 'Helsinki,fi';

const port = process.env.PORT || 9000;

const app = new Koa();

app.use(cors());

const fetchWeather = async (query) => {
  if (query.lat && query.lon) {
    const endpoint = `${mapURI}/weather?lat=${query.lat}&lon=${query.lon}&appid=${appId}&`;
    const response = await fetch(endpoint);

    return response ? response.json() : {};
  }
  const endpoint = `${mapURI}/weather?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

const fetchForecast = async (query) => {
  if (query.cityId) {
    const endpoint = `${mapURI}/forecast?id=${query.cityId}&appid=${appId}&`;
    const response = await fetch(endpoint);
    return response ? response.json() : {};
  }
  const endpoint = `${mapURI}/forecast?q=${targetCity}&appid=${appId}&`;
  const response = await fetch(endpoint);

  return response ? response.json() : {};
};

router.get('/api/weather', async ctx => {
  const weatherData = await fetchWeather(ctx.request.query);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = weatherData.weather[0] ? [ weatherData.weather[0], { city: weatherData.name, cityId: weatherData.id, }, ] : {};
});

router.get('/api/forecast', async ctx => {
  const forecastData = await fetchForecast(ctx.request.query);

  ctx.type = 'application/json; charset=utf-8';
  ctx.body = forecastData.list ? forecastData.list : {};
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port);

console.log(`App listening on port ${port}`);
