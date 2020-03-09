module.exports = {
  files: [
    {
      loader: {
        type: 'backend-api'
      },
      path: 'backend/process-data.js',
    },
    {
      loader: {
        type: 'backend-api'
      },
      path: 'backend/getLocaleConfig.js',
    },
    {
      loader: {
        type: 'ssr'
      },
      path: 'ProcessData.vue',
    },
    {
      path: 'RatingSelect.vue',
      props: {
        field: {
          key: 'rating',
          label: 'Rating',
          length: 5
        },
        model: {
          rating: 1
        }
      }
    }
  ]
};
