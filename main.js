const axios = require("axios");
const cheerio = require("cheerio");

function textToUrlFormat(text) {
    // Trim leading and trailing spaces
    const trimmedText = text.trim();

    // Encode the text to be URL-safe
    const urlEncodedText = encodeURIComponent(trimmedText);

    return urlEncodedText;
}

// Function to scrape the Google News search results
async function scrapeGoogleNews(topic, length) {
  try {
    // URL of the Google News search results
    const url =
      `https://news.google.com/search?q=${textToUrlFormat(topic)}%20when%3A1d%20-course%2C%20-top%2C%20-best&hl=en-IN&gl=IN&ceid=IN%3Aen`;

      console.log(url);

    // Fetch the HTML of the page
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    // Load the HTML into cheerio
    const $ = cheerio.load(data);

    // Select the article elements (Google News may have different class names)
    const articles = $("article");

    // Create an array of article objects
    const result = [];
    articles.each((index, element) => {
      const title = $(element).find("a").text().trim();
      const link = $(element).find("a").attr("href");
      const fullLink = link ? `https://news.google.com${link}` : "";

      result.push({ title, link: fullLink });
    });

    const finalResults = result.filter((data, index) => index < length);

    return finalResults;
  } catch (error) {
    console.error(`Failed to fetch Google News: ${error.message}`);
    return [];
  }
}

module.exports = scrapeGoogleNews;
