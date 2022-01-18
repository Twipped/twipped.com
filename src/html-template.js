
const IGNORES = [
  'privacy',
];

export default function ({ attributes, bundle, meta, files, publicPath, ...rest }) {
  // console.log({ attributes, meta, files, publicPath, rest }, files.xml, files.png);

  const links = (files.css || [])
    .map(({ fileName }) => {
      const attrs = makeHtmlAttributes(attributes.link);
      return `<link href="${publicPath}${fileName}" rel="stylesheet"${attrs}>`;
    });

  const scripts = [];
  for (const file of (files.js || [])) {
    const originalName = bundle[file.fileName].name;
    if (IGNORES.includes(originalName)) continue;

    const attrs = makeHtmlAttributes(attributes.script);
    if (file.isEntry) {
      scripts.push(`<script src="${publicPath}${file.fileName}"${attrs}></script>`);
    } else {
      links.push(`<link rel="modulepreload" href="${publicPath}${file.fileName}"${attrs}>`);
    }
  }

  const metas = meta
    .map((input) => {
      const attrs = makeHtmlAttributes(input);
      return `<meta${attrs}>`;
    });

  return `
<!DOCTYPE html>
<html${makeHtmlAttributes(attributes.html)}>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta charset="UTF-8">
    <meta name="author" content="Jocelyn Badgley">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta property="og:site_name" content="Twipped Media">
    <meta property="og:title" content="Twipped Media">
    <meta property="og:description" content="Personal profile for Jocelyn Badgley">
    <meta property="og:image" content="https://twipped.com/images/twipped.png">
    <meta property="og:url" content="https://twipped.com/">
    <meta name="twitter:site" content="TwippedTech">
    <meta name="twitter:creator" content="Jocelyn Badgley">
    <meta name="twitter:title" content="Twipped Media">
    <meta name="twitter:description" content="Personal profile for Jocelyn Badgley">
    <meta name="twitter:card" content="summary">
    <meta name="twitter:image" content="https://twipped.com/images/twipped.png">
    <link rel="canonical" href="https://twipped.com/">

    <title>Jocelyn Badgley - Twipped Media</title>
    <!-- generics -->
    <link rel="icon" href="/favicon.png">
    <link rel="icon" type="image/png"    href="/favicon-32x32.png" sizes="32x32">
    <link rel="icon" type="image/png"    href="/apple-touch-icon-57x57.png" sizes="57x57">
    <link rel="icon" type="image/png"    href="/android-chrome-72x72.png" sizes="76x76">
    <link rel="icon" type="image/png"    href="/android-chrome-96x96.png" sizes="96x96">
    <link rel="icon" type="image/png"    href="/firefox_app_128x128.png" sizes="128x128">
    <link rel="icon" type="image/png"    href="/android-chrome-192x192.png" sizes="192x192">

    <!-- Android -->
    <link rel="shortcut icon" sizes="196x196" href="/favicon.png?width=196">

    <!-- iOS -->
    <link rel="apple-touch-icon"             type="image/png" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon"             type="image/png" sizes="152x152" href="/apple-touch-icon-152x152.png">
    <link rel="apple-touch-icon"             type="image/png" sizes="180x180" href="/apple-touch-icon-180x180.png">
    <link rel="apple-touch-icon-precomposed" type="image/png" sizes="57x57"   href="/apple-touch-icon-57x57.png">
    <link rel="apple-touch-icon-precomposed" type="image/png" sizes="72x72"   href="/android-chrome-72x72.png">
    <link rel="apple-touch-icon-precomposed" type="image/png" sizes="120x120" href="/apple-touch-icon-120x120.png">
    <link rel="apple-touch-icon-precomposed" type="image/png" sizes="144x144" href="/android-chrome-144x144.png">

    <!-- Windows 8 IE 10 -->
    <meta name="msapplication-TileColor" content="#FFFFFF">
    <meta name="msapplication-TileImage" content="/android-chrome-144x144.png">

    <!-- Windows 8.1 + IE11 and above -->
    <meta name="msapplication-config" content="/browserconfig.xml" />

    <link rel="preconnect" href="//fonts.gstatic.com/" crossorigin>
    <link rel="preconnect" href="//fonts.googleapis.com">

    <link href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;600&family=Cousine:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Roboto+Condensed&family=Roboto:wght@500&display=swap" rel="stylesheet">
    ${links.join('\n')}
  </head>
  <body>
    ${scripts.join('\n')}

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-4767790-12"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag () { window.dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', 'UA-4767790-12');
    </script>
  </body>
</html>
  `;
}

function makeHtmlAttributes (attributes) {
  if (!attributes) {
    return '';
  }

  const keys = Object.keys(attributes);
  return keys.reduce((result, key) => (result += ` ${key}="${attributes[key]}"`), '');
}
