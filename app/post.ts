import path from "path";
import fs from "fs/promises";
import parseFrontMatter from "front-matter";
import invariant from "tiny-invariant";
import { processMarkdown } from "@ryanflorence/md";

export type Post = {
  slug: string;
  title: string;
};

export type PostMarkdownAttributes = {
  title: string;
};

let postsPath = path.join(__dirname, "../posts");

function isValidPostAttributes(
  attributes: any
): attributes is PostMarkdownAttributes {
  return attributes?.title;
}

export async function getPosts() {
  console.log('getPosts')
  let dir = await fs.readdir(postsPath);
  return Promise.all(
    dir.map(async filename => {
      let file = await fs.readFile(
        path.join(postsPath, filename)
      );
      let { attributes } = parseFrontMatter(
        file.toString()
      );
      invariant(
        isValidPostAttributes(attributes),
        `${filename} has bad meta data!`
      );
      return {
        slug: filename.replace(/\.md$/, ""),
        title: attributes.title
      };
    })
  );
}

export async function getPost(slug: string) {
  console.log('getPost')
  const filepath = path.join(postsPath, slug + ".md");
  const file = await fs.readFile(filepath);
  const { attributes, body } = parseFrontMatter(file.toString());
  invariant(
    isValidPostAttributes(attributes),
    `Post ${filepath} is missing attributes`
  );
  const html = await processMarkdown(body)
  return { slug, html, title: attributes.title };
}