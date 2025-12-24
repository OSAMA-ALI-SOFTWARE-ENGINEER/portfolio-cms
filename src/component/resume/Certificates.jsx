import React from "react";
import { motion } from "framer-motion";
import { useCertificates } from "../dashboard/useCertificates";
import { getImageUrl } from "../../helper/imageHelper";
import { ColorRing } from "react-loader-spinner";

const Certificates = () => {
  const { certificates, isLoading, error } = useCertificates();

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#ff014f", "#ff014f", "#ff014f", "#ff014f", "#ff014f"]}
        />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500">Error loading certificates</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.5 } }}
      className="w-full flex flex-col lgl:flex-row gap-10 lgl:gap-20"
    >
      <div className="w-full">
        <div className="py-12 font-titleFont flex flex-col gap-4">
          <p className="text-sm text-designColor tracking-[4px]">2023 - 2025</p>
          <h2 className="text-3xl md:text-4xl font-bold">Certificates</h2>
        </div>
        <div className="mt-14 w-full h-auto border-l-[6px] border-l-black border-opacity-30 flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
            {certificates?.map((cert) => (
              <div
                key={cert.id}
                className="w-full h-full bg-black bg-opacity-20 hover:bg-opacity-30 duration-300 rounded-lg p-4 lgl:px-10 shadow-shadowOne flex flex-col justify-center gap-6 group"
              >
                <div className="flex flex-col gap-4">
                  <div className="w-full h-48 overflow-hidden rounded-lg">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 duration-300 cursor-pointer"
                      src={getImageUrl(cert.image)}
                      alt={cert.title}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl md:text-2xl font-semibold group-hover:text-white duration-300">
                      {cert.title}
                    </h3>
                  </div>
                  <div className="flex gap-4 mt-2">
                    {cert.verificationUrl && (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-designColor bg-black bg-opacity-40 rounded-lg hover:bg-opacity-60 duration-300"
                      >
                        Verify
                      </a>
                    )}
                    {cert.pdf && (
                      <a
                        href={getImageUrl(cert.pdf)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm text-gray-400 bg-black bg-opacity-40 rounded-lg hover:bg-opacity-60 duration-300 hover:text-white"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Certificates;
