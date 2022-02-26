import React, { useContext } from "react";
import { useEffect, useRef, useState } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { ToggleThemeContext } from "../theme/ThemeProvider";

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
const RebalancelCountdown = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, -15, 0, 0);
  let dateToEndCountdownAt = Date.UTC(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate(),
    tomorrow.getHours(),
    tomorrow.getMinutes(),
    tomorrow.getSeconds(),
    tomorrow.getMilliseconds()
  );
  const { toggleTheme, isDark } = useContext(ToggleThemeContext);
  const { days, hours, minutes, seconds } =
    useReactCountdown(dateToEndCountdownAt);

  return (
    <>
      <div>
        <Card
          style={{
            backgroundColor: isDark ? "rgb(11, 23, 29)" : "white",
            color: isDark ? "white" : "black",
            borderColor: "black",
            borderRadius: "40px",
            padding: "0 50px 50px 50px",
          }}
        >
          <CardHeader
            title={
              <Typography
                style={{
                  fontFamily: "Roboto Mono",
                  fontWeight: 700,
                  fontSize: "1.5vw",
                }}
              >
                Countdown to Rebalance
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
                    fontSize: "1vw",
                  }}
                >
                  {days}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "1vw",
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
                    fontSize: "1vw",
                  }}
                >
                  {hours}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "1vw",
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
                    fontSize: "1vw",
                  }}
                >
                  {minutes}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "1vw",
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
                    fontSize: "1vw",
                  }}
                >
                  {seconds}
                </Typography>
                <Typography
                  style={{
                    fontFamily: "Roboto Mono",
                    fontWeight: 700,
                    fontSize: "1vw",
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

export default RebalancelCountdown;
