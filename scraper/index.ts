import { ArgumentParser } from "argparse";
import axois from "axios";
import { JSDOM } from "jsdom";
import chalk from "chalk";
const { version } = require("../package.json");

async function main() {
  const parser = new ArgumentParser({
    description: "Automatic Factorio API scraper",
  });
  parser.add_argument("--version", { action: "version", version });
  parser.add_argument("-v", "--verbose", {
    action: "count",
    default: 0,
  });
  parser.add_argument("-a", "--api-version", {
    type: String,
    default: "latest",
    help: "Version of the API to scrape",
  });
  parser.add_argument("--url", {
    type: String,
    default: "https://lua-api.factorio.com/",
    help: "URL of the website to scrape",
  });
  const config = parser.parse_args();
  try {
    // Verify parameters by making a simple request to the base URL
    await axois.get(`${config.url}/${config.api_version}`);
  } catch (err) {
    let error_messsage = "Unknown error when fetching from API";
    if (err.response) {
      if (err.response.status === 404) {
        error_messsage = "Invalid URL or version provided, 404 returned";
      } else if (err.response.status >= 500 && err.response.status < 600) {
        console.error(
          chalk.red(
            `Server failed with code ${err.response.status} and message:\n${err.response.statusText}`,
          ),
        );
        process.exit(1);
      } else {
        error_messsage = `API verification failed with code ${err.response.status} and message:\n${err.response.statusText}`;
      }
    }
    if (err.code === "ENOTFOUND") {
      error_messsage = "Invalid URL provided, please check URL.";
    }

    console.error(chalk.red(error_messsage));
    parser.print_usage();
    process.exit(1);
  }
}

main();
