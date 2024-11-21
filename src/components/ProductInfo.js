import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Slider, message } from 'antd';

const ProductInfo = () => {
  const [car, setCar] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const { carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://global-dominion-383716.el.r.appspot.com/api/cars/get-car/${carId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCar(response.data);
        setFormData(response.data);
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

  const handleInputChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleUpdateCar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `https://global-dominion-383716.el.r.appspot.com/api/cars/update-car/${carId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Car updated successfully');
      setIsEditable(false);
    } catch (error) {
      console.error('Error updating car:', error);
      message.error('Failed to update car');
    }
  };

  const handleDeleteCar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://global-dominion-383716.el.r.appspot.com/api/cars/delete-car/${carId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success('Car deleted successfully');
      navigate('/product-list');
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
        <header className="flex items-center justify-between border-b border-solid border-b-[#292929] px-10 py-3">
          <h2 className="text-[#FFFFFF] text-lg font-bold">Car Details</h2>
          <div className="flex gap-4">
            <button
              onClick={handleGoBack}
              className="bg-[#292929] text-[#FFFFFF] rounded-xl px-4 py-2"
            >
              Back to Cars List
            </button>
            {isEditable ? (
              <button
                onClick={handleUpdateCar}
                className="bg-[#EA2831] text-[#FFFFFF] rounded-xl px-4 py-2"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditable(true)}
                className="bg-[#292929] text-[#FFFFFF] rounded-xl px-4 py-2"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDeleteCar}
              className="bg-[#FF4D4F] text-[#FFFFFF] rounded-xl px-4 py-2"
            >
              Delete
            </button>
          </div>
        </header>

        <div className="px-40 py-5 flex justify-center">
          <div className="max-w-[960px] flex flex-col">
            {car.imageUrls && car.imageUrls.length > 0 && (
              <img
                src={car.imageUrls[0]}
                alt={car.title}
                className="w-full rounded-xl"
              />
            )}

            <div className="flex flex-col gap-4 pt-5">
              <div>
                <label className="text-[#FFFFFF]">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  disabled={!isEditable}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#212121] text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF]">Description</label>
                <input
                  type="text"
                  value={formData.description || ''}
                  disabled={!isEditable}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                  className="w-full p-3 rounded-xl bg-[#212121] text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF]">Car Number</label>
                <input
                  type="text"
                  value={formData.carNumber || ''}
                  disabled={!isEditable}
                  onChange={(e) =>
                    handleInputChange('carNumber', e.target.value)
                  }
                  className="w-full p-3 rounded-xl bg-[#212121] text-[#FFFFFF]"
                />
              </div>

              <div>
                <label className="text-[#FFFFFF]">Year</label>
                <Slider
                  min={2000}
                  max={2023}
                  value={formData.year || 2000}
                  onChange={(value) => handleInputChange('year', value)}
                  disabled={!isEditable}
                />
                <div className="text-[#FFFFFF]">{formData.year || 2000}</div>
              </div>

              <div>
                <label className="text-[#FFFFFF]">Price (₹)</label>
                <Slider
                  min={100000}
                  max={5000000}
                  step={10000}
                  value={formData.price || 100000}
                  onChange={(value) => handleInputChange('price', value)}
                  disabled={!isEditable}
                />
                <div className="text-[#FFFFFF]">₹{formData.price || 100000}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
