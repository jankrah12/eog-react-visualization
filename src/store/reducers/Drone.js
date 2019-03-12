import * as actions from "../actions";

const initialState = {
  loading: false,
  currentMetrics: null,
  metricTimestamp: [],
  metricTemperature: [],
};


const startLoading = (state, action) => {
  return { ...state, loading: true };
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
  [actions.FETCH_DRONE]: startLoading,
  [actions.DRONE_DATA_RECEIVED]: droneDataReceived,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
