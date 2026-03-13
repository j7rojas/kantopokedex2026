/**
 * components/StatRadarChart.tsx
 * 
 * This component uses Chart.js to render a radar (star) diagram for a Pokemon's stats.
 */

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { PokemonStats } from '../types/pokemon';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface StatRadarChartProps {
  stats: PokemonStats;
  pokemonName: string;
}

const StatRadarChart: React.FC<StatRadarChartProps> = ({ stats, pokemonName }) => {
  // Map our internal stat names to the display labels requested
  const data = {
    labels: ['HP', 'Attack', 'Defense', 'Sp. Atk', 'Sp. Def', 'Speed'],
    datasets: [
      {
        label: `${pokemonName} Stats`,
        data: [
          stats.hp,
          stats.attack,
          stats.defense,
          stats.specialAttack,
          stats.specialDefense,
          stats.speed,
        ],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointBackgroundColor: 'rgba(255, 99, 132, 1)',
      },
    ],
  };

  const options = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 150, // Typical max base stat for Kanto Pokemon
        ticks: {
          display: false, // Keep it clean
        },
      },
    },
    plugins: {
      legend: {
        display: false, // We don't need the legend since there's only one dataset
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="h-64 w-full">
      <Radar data={data} options={options} />
    </div>
  );
};

export default StatRadarChart;
