import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { message } from 'antd';  // for message notifications

const ProductInfo = () => {
  const [car, setCar] = useState(null);
  const [isEditable, setIsEditable] = useState(false);  // Track edit mode
  const [formData, setFormData] = useState({});  // Store form data for updating
  const { carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch car details on component mount
    const fetchProductInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://global-dominion-383716.el.r.appspot.com/api/cars/get-car/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCar(response.data);
        setFormData(response.data);  // Initialize form data with the current car data
      } catch (error) {
        console.error('Error fetching car details:', error);
        message.error('Failed to fetch car details');
      }
    };

    fetchProductInfo();
  }, [carId]);

  const handleGoBack = () => {
    navigate('/product-list');
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update the car details
  const handleUpdateCar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://global-dominion-383716.el.r.appspot.com/api/cars/update-car/${carId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Car updated successfully');
      setIsEditable(false);  // Disable editing after updating
    } catch (error) {
      console.error('Error updating car:', error);
      message.error('Failed to update car');
    }
  };

  // Delete the car
  const handleDeleteCar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://global-dominion-383716.el.r.appspot.com/api/cars/delete-car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Car deleted successfully');
      navigate('/product-list');  // Redirect to the cars list after deletion
    } catch (error) {
      console.error('Error deleting car:', error);
      message.error('Failed to delete car');
    }
  };

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-black dark group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292929] px-10 py-3">
          <div className="flex items-center gap-4 text-[#FFFFFF]">
            <h2 className="text-[#FFFFFF] text-lg font-bold leading-tight tracking-[-0.015em]">Car Details</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex gap-2">
              <button
                onClick={handleGoBack}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#292929] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                Back to Cars List
              </button>
              {isEditable ? (
                <button
                  onClick={handleUpdateCar}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#EA2831] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={() => setIsEditable(true)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#292929] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDeleteCar}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#FF4D4F] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                Delete
              </button>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            {/* Car Image */}
            {car.imageUrls && car.imageUrls.length > 0 && (
              <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl">
                <img
                  src={car.imageUrls[0]}
                  alt={car.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            )}

            {/* Car Information */}
            <div className="flex flex-col gap-3 pt-5">
              <div>
                <label className="text-[#FFFFFF] text-base font-medium leading-normal">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                  className="form-input w-full text-[#FFFFFF] bg-[#212121] border-[#303030] rounded-xl p-3"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF] text-base font-medium leading-normal">Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                  className="form-input w-full text-[#FFFFFF] bg-[#212121] border-[#303030] rounded-xl p-3"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF] text-base font-medium leading-normal">Car Number</label>
                <input
                  type="text"
                  name="carNumber"
                  value={formData.carNumber || ''}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                  className="form-input w-full text-[#FFFFFF] bg-[#212121] border-[#303030] rounded-xl p-3"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF] text-base font-medium leading-normal">Year</label>
                <input
                  type="text"
                  name="year"
                  value={formData.year || ''}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                  className="form-input w-full text-[#FFFFFF] bg-[#212121] border-[#303030] rounded-xl p-3"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF] text-base font-medium leading-normal">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price || ''}
                  disabled={!isEditable}
                  onChange={handleInputChange}
                  className="form-input w-full text-[#FFFFFF] bg-[#212121] border-[#303030] rounded-xl p-3"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
