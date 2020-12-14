import Axios from "axios";
import { JSDOM } from "jsdom";
import { arguments, factorioClass } from "../types";

let baseURL = "";
const classesURL = "Classes.html";

async function parseClass(
  tableRow: HTMLTableRowElement,
): Promise<factorioClass> {
  const name = tableRow.querySelector("a")?.textContent;
  const classHREF = (<HTMLAnchorElement>tableRow.querySelector("a"))?.href;
  const classHREFArray = classHREF.split("#");
  const classURL = classHREFArray[0];
  let classRef = classHREFArray[1] || `${classURL.split(".")[0]}.brief`;
  classRef = classRef.replace(".", "\\.");
  const description = (
    tableRow.querySelector("td.description")?.textContent || ""
  ).trim();
  if (!classURL) {
    throw `Cannot find further information URL for class ${name}`;
  }
  const { document } = new JSDOM(
    await (await Axios.get(`${baseURL}${classURL}`)).data,
  ).window;
  const members: string[] = [];

  for (const tableRow of document
    .querySelector(`body > div.brief-listing > #${classRef}`)
    ?.querySelectorAll("tr") || []) {
    members.push(
      (<HTMLAnchorElement>tableRow.querySelector("a"))?.innerHTML || "",
    );
  }
  if (name) {
    return {
      name,
      description,
      url: `${baseURL}${classHREF}`,
      members,
    };
  }
  throw "Class could not be parsed!";
}

export async function parseClasses(config: arguments): Promise<any> {
  baseURL = `${config.url}${config.api_version}/`;
  const { document } = new JSDOM(
    (await Axios.get(`${baseURL}${classesURL}`)).data,
  ).window;
  const promises: Promise<factorioClass>[] = [];
  for (const tableRow of document
    .querySelector("body > div.brief-listing")
    ?.querySelectorAll("tr") || []) {
    promises.push(parseClass(tableRow));
  }
  return Promise.all(promises);
}
