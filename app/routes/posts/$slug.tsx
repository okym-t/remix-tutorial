import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import invariant from "tiny-invariant";
import { getPost } from "~/post";

export let loader: LoaderFunction = async ({ params }) => {
  console.log('$slug loader')
    
  invariant(params.slug, "expected params.slug")
  return getPost(params.slug)
};

export default function PostSlug() {
  let post = useLoaderData();
  console.log(post)
  return (
    <div dangerouslySetInnerHTML={{ __html: post.html }}>
    </div>
  );
}