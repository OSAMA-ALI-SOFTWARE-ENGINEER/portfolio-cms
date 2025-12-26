import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateCertificate } from "./useCreateCertificate";
import { useUpdateCertificate } from "./useUpdateCertificate";

import { ColorRing } from "react-loader-spinner";

const CertificateModal = ({ certificateToEdit, onClose }) => {
  const { createCertificate, isCreating } = useCreateCertificate();
  const { updateCertificate, isUpdating } = useUpdateCertificate();
  const isWorking = isCreating || isUpdating;

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: "",
      verificationUrl: "",
    },
  });

  useEffect(() => {
    if (certificateToEdit) {
      reset({
        title: certificateToEdit.title,
        verificationUrl: certificateToEdit.verificationUrl,
      });
    }
  }, [certificateToEdit, reset]);

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.verificationUrl) formData.append("verificationUrl", data.verificationUrl);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }
    if (data.pdf && data.pdf[0]) {
      formData.append("pdf", data.pdf[0]);
    }

    if (certificateToEdit) {
      updateCertificate(
        { id: certificateToEdit.id, data: formData },
        { onSuccess: onClose }
      );
    } else {
      createCertificate(formData, { onSuccess: onClose });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 shadow-2xl transition-all dark:bg-[#1a1f2e] dark:border dark:border-gray-700">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {certificateToEdit ? "Edit Certificate" : "Add New Certificate"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Certificate Title
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
              placeholder="e.g. React Native Developer"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Verification URL
            </label>
            <input
              type="url"
              className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-primary"
              placeholder="https://..."
              {...register("verificationUrl")}
            />
            {errors.verificationUrl && <p className="text-xs text-red-500">{errors.verificationUrl.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary hover:file:bg-primary/20 dark:text-gray-400"
                  {...register("image", { required: !certificateToEdit && "Image is required" })}
                />
              </div>
              {errors.image && <p className="text-xs text-red-500">{errors.image.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                PDF Document
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  className="w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-secondary/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-secondary hover:file:bg-secondary/20 dark:text-gray-400"
                  {...register("pdf")}
                />
              </div>
              {errors.pdf && <p className="text-xs text-red-500">{errors.pdf.message}</p>}
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              disabled={isWorking}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl disabled:opacity-70"
              disabled={isWorking}
            >
              {isWorking ? (
                <div className="flex items-center gap-2">
                  <ColorRing
                    visible={true}
                    height="20"
                    width="20"
                    ariaLabel="blocks-loading"
                    colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                  />
                  <span>Processing...</span>
                </div>
              ) : (
                certificateToEdit ? "Update Certificate" : "Create Certificate"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CertificateModal;
