import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [openModal, setOpenModal] = useState(false);
  const onClose = () => setOpenModal(false);

  return (
    <ModalContext.Provider value={{ openModal, setOpenModal, onClose }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  return useContext(ModalContext);
};
