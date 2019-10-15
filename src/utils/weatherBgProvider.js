import Colors from "./Colors";

export const weatherBgProvider = {
  Empty: {
    gradient: {
      start: { x: 1, y: 1 },
      end: { x: 0, y: 0 },
      colors: [Colors.appBlue, Colors.appPurple]
    }
  },
  Rain: {
    gradient: {
      start: { x: 0, y: 0},
      end: { x: 0, y: 1},
      colors: ['#30cfd0', '#330867']
    },
    icon: 'weather-rainy'
  },
  Clear: {
    gradient: {
      useAngle: true,
      angle: 120,
      colors: ['#a1c4fd', '#c2e9fb'],
    },
    icon: 'weather-sunny'
  },
  Thunderstorm: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#09203f', '#537895']
    },
    icon: 'weather-lightning'
  },
  Clouds: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#5393B2', '#A6BDCA']
    },
    icon: 'weather-cloudy'
  },
  Snow: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#777B86', '#ADB7BE']
    },
    icon: 'weather-snowy'
  },
  Drizzle: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#6a85b6', '#bac8e0'],
    },
    icon: 'weather-hail'
  },
  Haze: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#33323A', '#B3957F'],
    },
    icon: 'weather-hail'
  },
  Mist: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#BC8DB8', '#5D5E90'],
    },
    icon: 'weather-fog'
  },
  Fog: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#c4c5c7', '#dcdddf', '#ebebeb'],
      locations: [0, 0.52, 1],
    },
    icon: 'weather-fog'
  },
  Smoke: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#c4c5c7', '#dcdddf', '#ebebeb'],
      locations: [0, 0.52, 1],
    },
    icon: 'weather-fog'
  },
  Sand: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#B17139', '#DBA660'],
    },
    icon: 'weather-fog'
  },
  Dust: {
    gradient: {
      useAngle: true,
      angle: 120,
      colors: ['#fdfcfb', '#e2d1c3'],
    },
    icon: 'weather-fog'
  },
  Ash: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#c4c5c7', '#dcdddf', '#ebebeb'],
      locations: [0, 0.52, 1],
    },
    icon: 'weather-fog'
  },
  Squall: {
    gradient: {
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
      colors: ['#c4c5c7', '#dcdddf', '#ebebeb'],
      locations: [0, 0.52, 1],
    },
    icon: 'weather-fog'
  }
}