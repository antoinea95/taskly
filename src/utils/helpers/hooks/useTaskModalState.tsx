import { useEffect, useState } from "react";

/**
 * Custom hook to listen for task modal state changes via the "modalChange" event.
 *
 * @returns {boolean} - The current modal state (`true` if a modal is open, `false` otherwise).
 */
export const useTaskModalState = (): boolean => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleModalChange = (evt: Event) => {
      const customEvent = evt as CustomEvent<{ isOpen: boolean }>;
      setIsModalOpen(customEvent.detail.isOpen);
    };

    window.addEventListener("modalChange", handleModalChange);

    return () => {
      window.removeEventListener("modalChange", handleModalChange);
    };
  }, []);

  return isModalOpen;
};
