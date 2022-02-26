import { useQuery, gql } from "@apollo/client";

const QUERY = gql`
  query tokenDayDatas($tokenAddr: String, $skip: Int) {
    tokenDayDatas(skip: 0, orderBy: date, orderDirection: asc, where: {token: "0xab7589de4c581db0fb265e25a8e7809d84ccd7e8"}) {
      id
      date
      priceUSD
      totalLiquidityToken
      totalLiquidityUSD
      totalLiquidityETH
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      __typename
    }
  }
`;
import React from 'react';
import { Bar } from 'react-chartjs-2';

const APY = () => {
  const {data} = useQuery(QUERY);
  return (
    <>
      <Bar data={
        {
          labels: data != undefined && data != null ? data.tokenDayDatas.map((item, index) => {
            if(data) {
              let d = new Date();
              d.setTime(item.date * 1000);
              return index % 5 == 0 ? d.toString().substr(4, 6) : '';
            }
            else return 0;
          }) : [],
          datasets: [
            {
              label: 'Volumn',
              data: data != undefined && data != null ? data.tokenDayDatas.map((item, index) => {
                  if(data) return item.dailyVolumeUSD;
                  else return 0;
                }) : [],
              fill: false,
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y-axis-1',
            },
          ],
        }
      } />
    </>
  );
};

export default APY;