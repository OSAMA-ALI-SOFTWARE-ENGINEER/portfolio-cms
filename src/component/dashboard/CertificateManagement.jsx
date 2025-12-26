import React, { useState } from "react";
import { useCertificates } from "./useCertificates";
import { useDeleteCertificate } from "./useDeleteCertificate";
import DashboardLoader from "./DashboardLoader";
import Error from "../../ui/Error";
import EditSvg from "../../ui/EditSvg";
import DeleteSvg from "../../ui/DeleteSvg";
import CertificateModal from "./CertificateModal";
import { getImageUrl } from "../../helper/imageHelper";

const CertificateManagement = () => {
  const { certificates, isLoading, error } = useCertificates();
  const { deleteCertificate, isDeleting } = useDeleteCertificate();

  const [editingCertificate, setEditingCertificate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this certificate?")) {
      deleteCertificate(id);
    }
  };

  const handleEdit = (cert) => {
    setEditingCertificate(cert);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingCertificate(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <DashboardLoader />;
  if (error) return <Error />;

  return (
    <div className="text-sm text-stone-600 dark:text-white">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Certificates</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Manage your professional certifications</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New
        </button>
      </div>

      {certificates?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-20 dark:border-gray-700">
          <div className="rounded-full bg-gray-100 p-4 dark:bg-gray-800">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No certificates found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Get started by creating a new certificate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {certificates?.map((cert) => (
            <div
              key={cert.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-[#1a1f2e]"
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={getImageUrl(cert.image)}
                  alt={cert.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Overlay Actions */}
                <div className="absolute bottom-4 right-4 flex gap-2 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={() => handleEdit(cert)}
                    className="rounded-full bg-white p-2 text-gray-700 shadow-lg hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-gray-200"
                    title="Edit"
                  >
                    <EditSvg className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    disabled={isDeleting}
                    className="rounded-full bg-white p-2 text-red-500 shadow-lg hover:bg-red-500 hover:text-white dark:bg-gray-800"
                    title="Delete"
                  >
                    <DeleteSvg className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-2 truncate text-lg font-bold text-gray-800 dark:text-white" title={cert.title}>
                  {cert.title}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {cert.verificationUrl ? (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Verified
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                      No Link
                    </span>
                  )}

                  {cert.pdf && (
                    <a
                      href={getImageUrl(cert.pdf)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CertificateModal
          certificateToEdit={editingCertificate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default CertificateManagement;
