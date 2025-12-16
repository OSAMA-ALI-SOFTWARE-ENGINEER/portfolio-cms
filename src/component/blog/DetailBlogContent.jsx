import React from "react";

const DetailBlogContent = ({ content }) => {
  return (
    <div
      className="prose prose-stone mx-auto max-w-none dark:prose-invert md:prose-lg prose-headings:font-bold prose-a:text-sky-500 prose-img:rounded-xl prose-img:w-full"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default DetailBlogContent;
