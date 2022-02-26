import React, { useState, useEffect } from 'react'
import { Chart } from 'react-charts'
import { useQuery, gql } from "@apollo/client";

const QUERY = gql`
    query uniswapDayDatas($startTime: Int, $skip: Int) {
      uniswapDayDatas(first: 500, skip: 0, where: {date_gt: 1621641598}, orderBy: date, orderDirection: asc) {
        id
        date
        totalVolumeUSD
        dailyVolumeUSD
        dailyVolumeETH
        totalLiquidityUSD
        totalLiquidityETH
        __typename
      }
    }

`;

function MyChart() {
    const [chartdata, setChartData] = useState([
        {
            label: 'Series 1',
            data: []
        },
    ]);
    const [axes, setAxes] = useState([
        { primary: true, type: 'linear', position: 'bottom' },
        { type: 'linear', position: 'left' }
    ]);

    const { data } = useQuery(QUERY);
    
    return (
      <div
        style={{
          width: '500px',
          height: '275px',
          margin: "auto",
        }}
      >
        <Chart data={[
            {
                label: 'Series 1',
                data: data != undefined && data != null ? data.uniswapDayDatas.map((item, index) => {
                  if(data) return [ index, item.dailyVolumeUSD ];
                  else return 0;
                }) : []
            },
        ]} axes={axes} />
      </div>
    )
}

export default MyChart;