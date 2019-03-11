import React, { Component } from "react";
import { connect } from "react-redux";
import Plot from "react-plotly.js";
import * as actions from "../store/actions";
import classNames from "classnames";
import { loadCSS } from "fg-loadcss/src/loadCSS";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Icon from "@material-ui/core/Icon";

const styles = theme => ({
  grid: {
    padding: "20px"
  },
  card: {
    display: "flex",
    margin: "20px",
    padding: "20px",
  },
  cardGraph: {
    display: "flex",
    margin: "20px",
    padding: "20px",
    flexDirection: "column"
  },
  cardContent: {
    display: "flex",
    flex: 1,
    flexDirection: "row"
  },
  icon: {
    fontSize: 70,
    color: "#52E5E7"
  },
  metricGroup: {
    flex: 1,
    marginLeft: "20px"
  },
  metric: {
    fontSize: "36px",
    textAlign: "right"
  },
  metricDesc: {
    fontSize: "14px",
    opacity: 0.5,
    textAlign: "right"
  },
  graphTitle: {
    fontSize: "20px",
    textAlign: "center"
  }
});

class Dashboard extends Component {
  
  componentDidMount() {
    loadCSS(
      "https://use.fontawesome.com/releases/v5.1.0/css/all.css",
      document.querySelector("#insertion-point-jss"),
    );

    this.interval = null;
    this.props.fetchDroneData();
    this.interval = setInterval(() => this.props.fetchDroneData(), 4000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { classes } = this.props;

    return (
      <Grid className={classes.grid} container spacing={16} justify="center">
        <Grid item xs={4}>
          <Card className={classes.card}>
            <div className={classes.cardContent}>
              <div>
                <Icon className={classNames(classes.icon, "fa fa-temperature-high")} />
              </div>
              {
                this.props.currentMetrics != null &&
                <div className={classes.metricGroup}>
                  <Typography className={classes.metric}>{Number(this.props.currentMetrics.metric).toFixed(6)}</Typography>
                  <Typography className={classes.metricDesc}>TEMPERATURE</Typography>
                </div>
              }
            </div>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card}>
            <div className={classes.cardContent}>
              <div>
                <Icon className={classNames(classes.icon, "fa fa-map-marker-alt")} />
              </div>
              {
                this.props.currentMetrics != null &&
                <div className={classes.metricGroup}>
                  <Typography className={classes.metric}>{Number(this.props.currentMetrics.longitude).toFixed(6)}</Typography>
                  <Typography className={classes.metricDesc}>LONGITUDE</Typography>
                </div>
              }
            </div>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card className={classes.card}>
            <div className={classes.cardContent}>
              <div>
                <Icon className={classNames(classes.icon, "fa fa-map-marker-alt")} />
              </div>
              {
                this.props.currentMetrics != null &&
                <div className={classes.metricGroup}>
                  <Typography className={classes.metric}>{Number(this.props.currentMetrics.latitude).toFixed(6)}</Typography>
                  <Typography className={classes.metricDesc}>LATITUDE</Typography>
                </div>
              }
            </div>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card className={classes.cardGraph}>
            <Typography className={classes.graphTitle}>SAMPLE DRONE TEMPERATURE</Typography>
            <Plot
              data={[
                {
                  x: this.props.metricTimestamp,
                  y: this.props.metricTemperature,
                  type: "scatter",
                  mode: "lines",
                  line: { "shape" : "spline", "smoothing": 1 },
                  marker: { color: "#52E5E7" },
                },
              ]}
              layout={ {width: 1000, height: 600} }
            />
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    loading,
    name,
    longitude,
    latitude,
    weather_state_name,
    temperatureinFahrenheit,
    metricTimestamp,
    metricTemperature,
    currentMetrics,
  } = state.weather;
  return {
    loading,
    name,
    longitude,
    latitude,
    weather_state_name,
    temperatureinFahrenheit,
    metricTimestamp,
    metricTemperature,
    currentMetrics,
  };
};

const mapDispatch = dispatch => ({
  fetchDroneData: (() => 
    dispatch({
      type: actions.FETCH_DRONE_DATA,
    })
  )
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Dashboard));
