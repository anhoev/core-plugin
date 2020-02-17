module.exports = {
  files: [
    {
      loader: {
        type: 'backend-api'
      },
      path: 'backend/process-data.js',
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