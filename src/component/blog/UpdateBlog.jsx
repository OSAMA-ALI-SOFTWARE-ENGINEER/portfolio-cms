import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import { Controller, useForm } from "react-hook-form";
import FormRow from "../../ui/FormRow";
import { toolbarOptions } from "./ToolBarOptions";
import { useSingleBlog } from "./useSingleBlog";
import Modal from "../../ui/Modal";
import { useUpdateBlog } from "./useUpdateBlog";
import Button from "../../ui/Button";

const module = {
  toolbar: toolbarOptions,
};

const UpdateBlog = ({ onClose, editId }) => {
  const { Blog, isLoading } = useSingleBlog(editId);
  const { updateBlog, isUpdating } = useUpdateBlog();
  const [heroImagePreview, setHeroImagePreview] = useState(null);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGalleryImages, setExistingGalleryImages] = useState([]); // Track existing images from DB
  
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: Blog,
  });

  // Watch for hero image changes
  const watchHeroImage = watch("blogImage");
  const watchGalleryImages = watch("galleryImages");

  useEffect(() => {
    if (watchHeroImage && typeof watchHeroImage !== "string" && watchHeroImage[0]) {
      const file = watchHeroImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }, [watchHeroImage]);

  // Watch for gallery images changes
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

  // Helper to get image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("https")) return path;
    const cleanPath = path.replace(/^backend[\\/]/, "").replace(/\\/g, "/");
    return `http://localhost:5000/${cleanPath}`;
  };

  // Get current hero image filename
  const getCurrentImageName = () => {
    if (!Blog?.blogImage) return "No image";
    const path = Blog.blogImage;
    return path.split(/[\\/]/).pop() || "Unknown";
  };

  function onSubmit(data) {
    const heroImage =
      typeof data.blogImage === "string" ? null : data?.blogImage?.[0];
    const galleryImages = data.galleryImages;

    updateBlog(
      { 
        newBlog: { 
          ...data, 
          blogImage: heroImage,
          galleryImages: galleryImages 
        }, 
        id: editId 
      },
      {
        onSuccess: onClose,
      },
    );
  }

  useEffect(() => {
    if (!isLoading && Blog) {
      reset(Blog);
      
      // Set initial hero image preview
      if (Blog.blogImage) {
        const imageUrl = getImageUrl(Blog.blogImage);
        setHeroImagePreview(imageUrl);
      } else {
        setHeroImagePreview(null);
      }
      
      // Store existing gallery images from database
      if (Blog.gallery && Blog.gallery.length > 0) {
        const existingImages = Blog.gallery.map(imagePath => ({
          path: imagePath,
          url: getImageUrl(imagePath)
        }));
        setExistingGalleryImages(existingImages);
      } else {
        setExistingGalleryImages([]);
      }
      
      // Clear new gallery previews when opening modal
      setGalleryPreviews([]);
    }
  }, [isLoading, Blog, reset, editId]);

  return (
    <Modal size="large" onClose={onClose}>
      {isLoading ? (
        <div className="mx-auto mt-6 flex max-w-[80%] flex-col gap-6">
          <div className="h-8 w-48 animate-pulse rounded-md bg-stone-300/70 dark:bg-stone-800" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {[...Array(6)].map((_, idx) => (
              <div
                key={idx}
                className="h-14 animate-pulse rounded-lg bg-stone-300/70 shadow-sm dark:bg-stone-800"
              />
            ))}
            <div className="col-span-2 flex flex-col gap-3">
              <div className="h-6 w-32 animate-pulse rounded-md bg-stone-300/70 dark:bg-stone-800" />
              <div className="h-40 animate-pulse rounded-lg bg-stone-300/70 shadow-sm dark:bg-stone-800 sm:h-52" />
            </div>
            <div className="col-span-2 flex justify-end">
              <div className="h-12 w-32 animate-pulse rounded-md bg-gradient-to-r from-sky-500/60 to-cyan-400/60 dark:from-sky-700/60 dark:to-cyan-500/60" />
            </div>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" mx-auto mt-6 max-w-[80%] items-start space-y-14 font-primary text-white sm:grid sm:grid-cols-2 sm:gap-x-7 sm:gap-y-12 sm:space-y-0"
        >
          <h2 className=" col-span-2 text-center text-xl font-bold capitalize text-stone-100">
            update Blog post
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
              name="content"
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
            lable={"Blog Image (Hero)"}
            error={errors?.blogImage?.message}
          >
            <div className="space-y-3">
              {/* Current Image Info */}
              <div className="rounded-lg bg-stone-700/50 p-3">
                <p className="text-sm text-stone-300">
                  <span className="font-semibold">Current image:</span> {getCurrentImageName()}
                </p>
              </div>

              {/* Image Preview */}
              {heroImagePreview && (
                <div className="relative overflow-hidden rounded-lg group">
                  <img
                    src={heroImagePreview}
                    alt="Hero preview"
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      console.error('Failed to load hero image:', heroImagePreview);
                      e.target.onerror = null;
                      // Show placeholder instead
                      e.target.src = `https://placehold.co/800x400/1e293b/cbd5e1?text=${encodeURIComponent('Image Not Found')}`;
                    }}
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
                  <div className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-1 text-xs text-white">
                    Current Image
                  </div>
                </div>
              )}

              {/* File Input */}
              <input
                type="file"
                className={` w-full rounded-lg border-transparent bg-transparent p-4 shadow-xl outline-none  placeholder:text-[16px] placeholder:text-stone-400 ${errors?.blogImage?.message ? " border-2 focus-visible:border-designColor" : " border-none shadow-xl"} `}
                {...register("blogImage", {
                  validate: (value) => {
                    if (!value || value.length === 0 || typeof value === "string") return true;
                    const file = value[0];
                    if (file.size / 1000 > 5000) {
                      return "Image must be less than 5 MB";
                    }
                    return true;
                  },
                })}
              />
              <p className="text-xs text-stone-400">
                Leave empty to keep current image
              </p>
            </div>
          </FormRow>

          <FormRow
            extend={true}
            lable={"Gallery Images (Optional)"}
            error={errors?.galleryImages?.message}
          >
            <div className="space-y-3">
              {/* Existing Gallery Images */}
              {existingGalleryImages.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-stone-400">Current Gallery Images:</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {existingGalleryImages.map((image, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative overflow-hidden rounded-lg border-2 border-green-600 group"
                      >
                        <img
                          src={image.url}
                          alt={`Existing gallery ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newExisting = existingGalleryImages.filter((_, i) => i !== index);
                            setExistingGalleryImages(newExisting);
                          }}
                          className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-green-600/80 px-2 py-1 text-center">
                          <span className="text-xs text-white">Existing {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Gallery Image Previews */}
              {galleryPreviews.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-stone-400">New Images to Upload:</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {galleryPreviews.map((preview, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative overflow-hidden rounded-lg border-2 border-sky-600 group"
                      >
                        <img
                          src={preview}
                          alt={`New gallery ${index + 1}`}
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
                        <div className="absolute bottom-0 left-0 right-0 bg-sky-600/80 px-2 py-1 text-center">
                          <span className="text-xs text-white">New {index + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Input */}
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
                Upload new images to add to gallery (max 10 images, 5MB each)
              </p>
            </div>
          </FormRow>

          <div className=" mt-6">
            <Button
              disable={isUpdating}
              className="btn flex min-w-[8rem] items-center justify-center border-none bg-gradient-to-tr from-sky-600 to-cyan-400 font-semibold uppercase text-bodyColor hover:from-cyan-400 hover:to-sky-600 active:scale-95 disabled:bg-sky-500 disabled:text-bodyColor disabled:opacity-50"
              type="submit"
            >
              update
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default UpdateBlog;
