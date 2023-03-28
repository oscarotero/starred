import { readJSON, writeJSON } from "https://deno.land/x/flat@0.0.15/mod.ts";

const data = readJSON("./latest_entries.json");
const entries = readJSON("./entries.json");

const newEntries = [];
for (const id of data) {
  const exists = entries.find((e) => e.id === id);
  if (!exists) {
    newEntries.push(id);
  }
}

// Fetch the new entries
if (newEntries.length) {
  const response = await fetch(
    `https://api.feedbin.com/v2/entries.json?ids=${newEntries.join(",")}`,
    {
      headers: {
        Authorization: Deno.env.get("AUTHORIZATION"),
      },
    },
  );

  const data = await response.json();

  entries.push(...data.map((e) => ({
    id: e.id,
    title: e.title,
    url: e.url,
    author: e.author,
    summary: e.summary,
    published: e.published,
  })));
}

// Write the data
writeJSON("entries.json", entries);
