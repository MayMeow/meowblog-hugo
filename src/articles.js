import fetch from "node-fetch";
import path from "path";
import fs from "fs";
import { sanitizeUrl } from "./utils.js";

let headers = {
    "Content-Type": "application/json"
}

export function getArticles(url)
{
    fetch(sanitizeUrl(url) + "api/v1/articles/all.json", { headers: headers })
    .then(response => response.json())
    .then(json => {
        json.forEach(element => {
            console.log(element.title);
            let contentPath = path.join('content', element.type_name);
            let date = new Date(element.created_timestamp * 1000);

            let content = `---
                title: "${element.title}"
                date: "${date.toISOString()}"
                draft: false
                toc: false
                tags: ${JSON.stringify(getTags(element.tag_string))}
                ---

                ${element.body}
            `;

            let articleFolder = createFolder(path.join(contentPath, element.slug.toLowerCase()));

            let file = path.join(articleFolder, "index.md");
            fs.writeFileSync(file, content.replace(/^[ \t]+/gm, ''));
        });
    })
    .catch(err => console.log(err));
}

function getTags(tagString)
{
    let tags = [];

    if (tagString != null && tagString != "") {
        tags = tagString.split(",");
    }

    return tags;
}

function createFolder(path)
{
    if (!fs.existsSync(path))
    {
        fs.mkdirSync(path, { recursive: true });
    }

    return path;
}
