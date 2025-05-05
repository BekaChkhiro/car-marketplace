// Custom CSS for animations and effects
export const customStyles = `
  .car-detail-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .car-detail-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  }
  
  .spec-item {
    transition: all 0.2s ease;
  }
  
  .spec-item:hover {
    background-color: rgba(59, 130, 246, 0.05);
    transform: translateX(2px);
  }
  
  .image-gallery-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 1rem;
  }
  
  .gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1rem;
    background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .action-button {
    transition: all 0.2s ease;
  }
  
  .action-button:hover {
    transform: scale(1.05);
  }
`;
