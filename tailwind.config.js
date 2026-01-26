/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html",
    "./suburbs/*.html",
    "./**/*.html"
  ],
  theme: {
    extend: {
      maskImage: {
        'squircle': 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100,0 C44.77,0 0,44.77 0,100 C0,155.23 44.77,200 100,200 C155.23,200 200,155.23 200,100 C200,44.77 155.23,0 100,0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.mask-squircle': {
          'mask-image': 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100,0 C44.77,0 0,44.77 0,100 C0,155.23 44.77,200 100,200 C155.23,200 200,155.23 200,100 C200,44.77 155.23,0 100,0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
          '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100,0 C44.77,0 0,44.77 0,100 C0,155.23 44.77,200 100,200 C155.23,200 200,155.23 200,100 C200,44.77 155.23,0 100,0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
          'mask-size': '100% 100%',
          '-webkit-mask-size': '100% 100%',
          'mask-repeat': 'no-repeat',
          '-webkit-mask-repeat': 'no-repeat',
          'mask-position': 'center',
          '-webkit-mask-position': 'center',
          'mask-composite': 'intersect',
          '-webkit-mask-composite': 'source-in',
        },
        '.size-25': {
          'mask-image': 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100,0 C77.5,0 50,27.5 50,50 C50,72.5 77.5,100 100,100 C122.5,100 150,72.5 150,50 C150,27.5 122.5,0 100,0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
          '-webkit-mask-image': 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M100,0 C77.5,0 50,27.5 50,50 C50,72.5 77.5,100 100,100 C122.5,100 150,72.5 150,50 C150,27.5 122.5,0 100,0 Z\' fill=\'black\'/%3E%3C/svg%3E")',
          'mask-size': '100% 100%',
          '-webkit-mask-size': '100% 100%',
          'mask-repeat': 'no-repeat',
          '-webkit-mask-repeat': 'no-repeat',
          'mask-position': 'center',
          '-webkit-mask-position': 'center',
          'mask-composite': 'intersect',
          '-webkit-mask-composite': 'source-in',
        },
      })
    },
  ],
}
