import * as actions from "../actions";

const initialState = {
  loading: false,
  weatherId: null,
  name: "",
  temperature: "",
  weather_state_name: "",
  latitude: null,
  longitude: null,
  data: {},
  currentMetrics: null,
  metricTimestamp: [],
  metricTemperature: [],
};

const toF = c => (c * 9) / 5 + 32;

const startLoading = (state, action) => {
  return { ...state, loading: true };
};

const weatherIDReceived = (state, action) => {
  return { ...state, weatherId: action.id };
};

const weatherDataRecevied = (state, action) => {
  const { data } = action;
  if (!data["consolidated_weather"]) return state;
  const weather = data.consolidated_weather[0];
  const { weather_state_name, the_temp } = weather;
  const { latt_long, title: name } = data;
  const [latitude, longitude] = latt_long.split(",");
  
  return {
    ...state,
    loading: false,
    latitude,
    longitude,
    temperatureinCelsius: the_temp,
    temperatureinFahrenheit: toF(the_temp),
    weather_state_name,
    name,
    data: action.data,
  };
};

const droneDataReceived = (state, action) => {
  const data = action.data.data;
  const timeStamp = [];
  const temperature = [];
  const current = {
    latitude: data[data.length-1].latitude,
    longitude: data[data.length-1].longitude,
    metric: data[data.length-1].metric,
  };
  const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false };

  data.forEach((item) => {
    timeStamp.push(new Date(item.timestamp).toLocaleDateString("en-US", options));
    temperature.push(item.metric);
  })
  return { ...state, metricTimestamp: timeStamp, metricTemperature: temperature, currentMetrics: current };
};

const handlers = {
  [actions.FETCH_WEATHER]: startLoading,
  [actions.WEATHER_ID_RECEIVED]: weatherIDReceived,
  [actions.WEATHER_DATA_RECEIVED]: weatherDataRecevied,
  [actions.DRONE_DATA_RECEIVED]: droneDataReceived,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
