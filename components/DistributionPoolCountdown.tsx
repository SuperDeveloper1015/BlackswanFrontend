import React from "react";
import { useEffect, useRef, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { DISTRIBUTION_POOL_COUNTDOWN_DATE } from "../constants";

const useReactCountdown = (date) => {
  //COUNTDOWN
  const [timerDays, setTimerDays] = useState(0);
  const [timerHours, setTimerHours] = useState(0);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);

  let interval: any = useRef();

  const startTimer = () => {
    const countdownDate = new Date(date).getTime();

    interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        // Stop
        clearInterval(interval.current);
      } else {
        // Update
        setTimerDays(days);
        setTimerHours(hours);
        setTimerMinutes(minutes);
        setTimerSeconds(seconds);
      }
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(interval.current);
    };
  });
  // Logic
  return {
    days: timerDays,
    hours: timerHours,
    minutes: timerMinutes,
    seconds: timerSeconds,
  };
};
const DistributionPoolCountdown = () => {
  const { days, hours, minutes, seconds } = useReactCountdown(
    DISTRIBUTION_POOL_COUNTDOWN_DATE
  );

  return (
    <>
      <div>
        <Card
          style={{
            backgroundColor: "white",
            borderRadius: "40px",
            padding: 50,
          }}
        >
          <CardHeader
            title={
              <Typography
                style={{
                  fontFamily: "Roboto Mono",
                  fontWeight: 700,
                  fontSize: "2.5vw",
                }}
              >
                Countdown to Distribute Rewards
              </Typography>
            }
            style={{
              textAlign: "center",
              padding: 25,
            }}
          />
          <CardContent style={{ width: "100%", padding: "0 12px" }}>
            <Grid
              container
              alignContent="center"
              alignItems="center"
              justify="space-around"
              style={{
                textAlign: "center",
                fontFamily: "sans-serif",
              }}
            >
              <Grid item xs={3} sm={3} md={3} lg={3} xl={3} style={{}}>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  {days}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  DAYS
                </Typography>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  {hours}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  HOURS
                </Typography>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  {minutes}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  MINUTES
                </Typography>
              </Grid>

              <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  {seconds}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "2.5vw",
                  }}
                >
                  SECONDS
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default DistributionPoolCountdown;
