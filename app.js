const http = require('http');
const https = require('https');
const server = http.createServer((req, res) => {
  if (req.url === '/getTimeStories') {
    const url = 'https://time.com/';
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        const extractedData = [];
        const regexOuter = /<li class="most-popular-feed__item">(.*?)<\/li>/gs;
        const matchesOuter = data.match(regexOuter);
        if (matchesOuter) {
          matchesOuter.forEach((matchOuter) => {
            const regexInner = /<a[^>]*href="([^"]*)"[^>]*data-article-id="([^"]*)"[^>]*>\s*<h3[^>]*>(.*?)<\/h3>\s*<\/a>/gs;
            const matchInner = regexInner.exec(matchOuter);
            if (matchInner) {
              const href = matchInner[1];
              const h3Content = matchInner[3] ? matchInner[3].trim() : '';
              extractedData.push({
                title: h3Content,
                link: href
              });
            }
          });
        }
        res.end(JSON.stringify(extractedData));
      });
    }).on('error', (error) => {
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    });
  } else {
    res.end('Not Found');
  }
});
const port = 3000; 
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
