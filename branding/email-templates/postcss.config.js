module.exports = {
  plugins: [
    require('postcss-custom-properties')({
      preserve: false
    }),
    require('postcss-nested'),
    require('autoprefixer')({
      overrideBrowserslist: [
        // Email client compatibility - target rendering engines used by email clients
        'ie >= 9',           // Outlook 2007-2016 use IE rendering engine
        'ie 11',             // Outlook 2016+ 
        'edge >= 12',        // Outlook.com
        'firefox >= 3.6',    // Thunderbird
        'chrome >= 4',       // Gmail, Yahoo Mail webview
        'safari >= 4',       // Apple Mail, iOS Mail
        'ios_saf >= 7',      // iOS Mail app
        'android >= 4',      // Android email clients
        'and_chr >= 4'       // Android Chrome webview
      ]
    }),
    require('cssnano')({
      preset: ['default', {
        // Preserve important declarations for email clients
        discardComments: { removeAll: true },
        normalizeWhitespace: true,
        mergeLonghand: false, // Keep longhand for email compatibility
        mergeRules: false,    // Avoid rule merging that breaks email clients
        minifySelectors: false // Keep selectors intact for email
      }]
    })
  ]
};