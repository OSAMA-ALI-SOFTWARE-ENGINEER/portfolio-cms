import React from "react";

import { certificatesData } from "./certificateData";
import Certificate from "./Certificate";

const Certificates = () => {
  return (
    <section className=" mb-12 pb-12 pt-32 sm:pt-40 md:pt-20">
      <h2 className=" flex flex-row items-center justify-center gap-2 font-semibold sm:flex-col sm:gap-3 sm:text-3xl ">
        <span className=" text-designColor">My achievements</span>
        <span>&</span>
        <span className=" text-sky-500">Certificates</span>
      </h2>
      {/* Map certificates */}
      <div className=" mt-16 grid grid-cols-1 items-start gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {certificatesData?.map((certificate, i) => (
          <Certificate
            key={certificate.id}
            id={certificate.id}
            imageMin={certificate.imageMin}
            imageWebp={certificate.imageWebp}
            verifyUrl={certificate.verifyUrl}
            pdfUrl={certificate.pdfUrl}
            summary={certificate.summary}
          />
        ))}
      </div>
    </section>
  );
};

export default Certificates;
