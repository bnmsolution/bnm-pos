import { FilterPeriod } from '../shared/utils/filter-period';

const datasetColors = ['#3F51B5', '#E0E0E0'];

export const getDefaultDataset = (datasetIndex: number) => {
  return {
    label: '',
    data: [],
    borderColor: datasetColors[datasetIndex],
    backgroundColor: datasetColors[datasetIndex],
    borderWidth: 2,
    lineTension: 0,
    fill: false,
    pointRadius: 0,
    pointHoverRadius: 3,
  };
};

export const getDefaultOptions = () => {
  return {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 20
      }
    },
    scales: {
      yAxes: [
        {
          type: 'linear',
          position: 'left',
          ticks: {
            maxTicksLimit: 4
          }
        },
      ],
      xAxes: [
        {
          gridLines: {
            // display: false
            borderDash: [3, 3]
          },
          ticks: {
            display: true,
            maxTicksLimit: 4
          }
        }
      ]
    },
    hover: {
      intersect: false
    },
    plugins: {
      datalabels: {
        display: false
      }
    }
  };
};

export const getDateTimeFormat = (filterPeriod: FilterPeriod): string => {
  switch (filterPeriod) {
    case FilterPeriod.Today:
    case FilterPeriod.Yesterday: {
      return 'H';
    }
    case FilterPeriod.ThisWeek:
    case FilterPeriod.LastWeek:
    case FilterPeriod.OneWeek: {
      return 'EEEEE';
    }
    case FilterPeriod.ThisMonth:
    case FilterPeriod.LastMonth:
    case FilterPeriod.ThrityDays: {
      return 'MMM d';
    }
    case FilterPeriod.ThisYear:
    case FilterPeriod.LastYear:
    case FilterPeriod.OneYear: {
      return 'yy MMM';
    }
  }
};
