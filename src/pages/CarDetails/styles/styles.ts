// Custom CSS for animations and effects
export const customStyles = `
  /* Card styling */
  .car-detail-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border-radius: 0.75rem;
    overflow: hidden;
    background-color: white;
    border: 1px solid #E8F5E9;
  }
  
  .car-detail-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(76, 175, 80, 0.1), 0 8px 10px -6px rgba(76, 175, 80, 0.08);
  }
  
  /* Specification items */
  .spec-item {
    transition: all 0.2s ease;
    border-radius: 0.5rem;
    background-color: #F5F5F5;
    padding: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .spec-item:hover {
    background-color: #E8F5E9;
    transform: translateX(2px);
  }
  
  .spec-item-icon {
    color: #4CAF50;
    width: 1.25rem;
    height: 1.25rem;
  }
  
  /* Image gallery */
  .image-gallery-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 0.75rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
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
  
  /* Action buttons */
  .action-button {
    transition: all 0.2s ease;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background-color: #E8F5E9;
    color: #4CAF50;
  }
  
  .action-button:hover {
    transform: scale(1.05);
    background-color: #C8E6C9;
  }
  
  /* Price badge */
  .price-badge {
    background-color: #4CAF50;
    color: white;
    font-weight: bold;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  /* Feature badges */
  .feature-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background-color: #F5F5F5;
    color: #333333;
    font-size: 0.875rem;
    transition: all 0.2s ease;
  }
  
  .feature-badge.active {
    background-color: #E8F5E9;
    color: #4CAF50;
  }
  
  .feature-badge:hover {
    transform: translateY(-2px);
  }
  
  /* Section headings */
  .section-heading {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333333;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #E8F5E9;
  }
  
  /* Navigation tabs */
  .tab-button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem 0.5rem 0 0;
    font-weight: 500;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
  }
  
  .tab-button.active {
    border-bottom: 2px solid #4CAF50;
    color: #4CAF50;
  }
  
  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
`;
