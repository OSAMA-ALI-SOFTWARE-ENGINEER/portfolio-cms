import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";

import FormRow from "../../ui/FormRow";
import { Controller, useForm } from "react-hook-form";
import { useCreateBlog } from "./useCreateBlog";
import { useCurrentUser } from "../authentication/useCurrentUser";
import { toolbarOptions } from "./ToolBarOptions";
import Modal from "../../ui/Modal";
import { createPortal } from "react-dom";
// import { useSingleBlog } from "./useSingleBlog";

const module = {
  toolbar: toolbarOptions,
};

const CreateBlog = ({ onClose }) => {
  const { addBlog, isPending } = useCreateBlog();
  const { user } = useCurrentUser();
  const authorName = user?.name || user?.user_metadata?.name;
  const avatar = user?.avatar || user?.user_metadata?.avatar;
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Watch for image changes
  const watchHeroImage = watch("blogImage");
  const watchGalleryImages = watch("galleryImages");

  // Hero image preview
  useEffect(() => {
    if (watchHeroImage && watchHeroImage[0]) {
      const file = watchHeroImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setHeroImagePreview(null);
    }
  }, [watchHeroImage]);

  // Gallery images preview
  useEffect(() => {
    if (watchGalleryImages && watchGalleryImages.length > 0) {
      const files = Array.from(watchGalleryImages);
      const previews = [];
      
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setGalleryPreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      setGalleryPreviews([]);
    }
  }, [watchGalleryImages]);

  const onSubmit = (data) => {
    const image = data.blogImage[0];
    const gallery = data.galleryImages;
    addBlog(
      {
        ...data,
        blogImage: image,
        galleryImages: gallery,
        author: authorName,
        authorImage: avatar,
      },
      {
        onSuccess: () => {
          reset();
          onClose(); // Close modal after successful submission
        },
      },
    );
  };

  return createPortal(
    <Modal isLoading={isPending} onClose={onClose} size={"large"}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" mx-auto mt-6 max-w-[80%] items-start space-y-14 font-primary text-white sm:grid sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 sm:space-y-0"
      >
        <h2 className=" col-span-2 text-center text-xl font-bold capitalize text-stone-100">
          "Create Blog post"
        </h2>
        <FormRow lable={"Blog title"} error={errors?.title?.message}>
          <input
            type="text"
            placeholder="Enter Blog title"
            className={`h-12 w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.title?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
            {...register("title", {
              required: "Field is required.",
            })}
          />
        </FormRow>

        <FormRow lable={"Blog Category"} error={errors?.category?.message}>
          <input
            type="text"
            placeholder="eg programming..."
            className={`h-12 w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.category?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
            {...register("category", {
              required: "Field is required.",
            })}
          />
        </FormRow>

        <FormRow
          lable={"Linkdin Profile"}
          error={errors?.author_linkdin?.message}
        >
          <input
            type="text"
            placeholder="https://www.linkedin.com/etc..."
            className={`h-12 w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.author_linkdin?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
            {...register("author_linkdin", {
              required: "Field is required.",
            })}
          />
        </FormRow>

        <FormRow
          lable={"Linkdin Followers"}
          error={errors?.linkdin_followers?.message}
        >
          <input
            type="number"
            placeholder="1000..."
            className={`h-12 w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.linkdin_followers?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
            {...register("linkdin_followers", {
              required: "Field is required.",
            })}
          />
        </FormRow>

        <FormRow
          lable={"Blog Content"}
          extend={true}
          error={errors?.content?.message}
        >
          <Controller
            name="content" // Set the name for React Hook Form
            control={control}
            defaultValue=""
            render={({ field }) => (
              <ReactQuill
                className={` w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.content?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
                modules={module}
                value={field.value}
                onChange={(value) => field.onChange(value)}
              />
            )}
          />
        </FormRow>

        <FormRow
          extend={true}
          lable={"Blog image (Hero)"}
          error={errors?.blogImage?.message}
        >
          <div className="space-y-3">
            {/* Hero Image Preview */}
            {heroImagePreview && (
              <div className="relative overflow-hidden rounded-lg group">
                <img
                  src={heroImagePreview}
                  alt="Hero preview"
                  className="h-48 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setHeroImagePreview(null);
                    reset({ ...watch(), blogImage: null });
                  }}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 text-center">
                  <span className="text-sm font-semibold text-white">Hero Image Preview</span>
                </div>
              </div>
            )}

            <input
              type="file"
              className={` w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.blogImage?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
              {...register("blogImage", {
                required: "Field is required.",
                validate: (value) => {
                  const isBigImage = value[0].size / 1000;
                  return isBigImage < 5000 || "Image must be less than 5 MB";
                },
              })}
            />
          </div>
        </FormRow>

        <FormRow
          extend={true}
          lable={"Gallery Images (Optional)"}
          error={errors?.galleryImages?.message}
        >
          <div className="space-y-3">
            {/* Gallery Previews */}
            {galleryPreviews.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {galleryPreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded-lg border-2 border-stone-600 group"
                  >
                    <img
                      src={preview}
                      alt={`Gallery preview ${index + 1}`}
                      className="h-32 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPreviews = galleryPreviews.filter((_, i) => i !== index);
                        setGalleryPreviews(newPreviews);
                        
                        // Update the file input
                        const currentFiles = watch('galleryImages');
                        if (currentFiles) {
                          const dt = new DataTransfer();
                          Array.from(currentFiles).forEach((file, i) => {
                            if (i !== index) dt.items.add(file);
                          });
                          reset({ ...watch(), galleryImages: dt.files });
                        }
                      }}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-center">
                      <span className="text-xs text-white">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <input
              type="file"
              multiple
              className={` w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.galleryImages?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
              {...register("galleryImages", {
                validate: (value) => {
                  if (!value || value.length === 0) return true;
                  for (let i = 0; i < value.length; i++) {
                    if (value[i].size / 1000 > 5000) {
                      return "Each image must be less than 5 MB";
                    }
                  }
                  return true;
                },
              })}
            />
            <p className="text-xs text-stone-400">
              Select up to 10 images for the gallery (5MB each max)
            </p>
          </div>
        </FormRow>

        <div className=" mt-6">
          <button
            disabled={isPending}
            className="btn flex min-w-[8rem] items-center justify-center border-none bg-gradient-to-tr from-sky-600 to-cyan-400 font-semibold uppercase text-bodyColor hover:from-cyan-400 hover:to-sky-600 active:scale-95 disabled:bg-sky-500 disabled:text-bodyColor disabled:opacity-50"
            type="submit"
          >
            submit
          </button>
        </div>
      </form>
    </Modal>,
    document.body,
  );
};

export default CreateBlog;
