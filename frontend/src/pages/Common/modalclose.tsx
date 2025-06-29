import { Modal } from 'bootstrap';

const closeModal = (modalId: string) => {
  try {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = Modal.getInstance(modalElement) || new Modal(modalElement);
    modal.hide();
    modal.dispose(); // Dispose modal instance to prevent state reuse
    // console.log(`${modalId} modal closed and disposed`);

    // Delayed backdrop cleanup to ensure animation completes
    setTimeout(() => {
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      //console.log(`Removed ${backdrops.length} modal backdrops for ${modalId}`);
    }, 300); // Match Bootstrap's modal transition duration
  } else {
   // console.warn(`Modal with ID ${modalId} not found`);
  }
} catch (error) {
 // console.error(`Error closing modal ${modalId}:`, error);
}
};

// Fallback to force clear backdrops
const forceClearBackdrops = () => {
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach((backdrop) => backdrop.remove());
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
 // console.log('Force cleared backdrops');
};

export { closeModal, forceClearBackdrops };