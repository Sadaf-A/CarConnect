import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Slider, message } from 'antd';

const ProductInfo = () => {
  const [car, setCar] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({});
  const [emi, setEmi] = useState(null);
  const [loanTenure, setLoanTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(10);
  const { carId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`https://global-dominion-383716.el.r.appspot.com/api/cars/get-car/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const calculateEmi = (price, rate, tenure) => {
    const principal = parseFloat(price);
    const interestRateMonthly = rate / 12 / 100;
    const months = parseInt(tenure, 10);

    if (isNaN(principal) || isNaN(interestRateMonthly) || isNaN(months) || principal <= 0) {
      return 0;
    }

    const emi = (principal * interestRateMonthly * Math.pow(1 + interestRateMonthly, months)) /
      (Math.pow(1 + interestRateMonthly, months) - 1);

    return emi.toFixed(2);
  };

  useEffect(() => {
    if (formData.price) {
      const emiAmount = calculateEmi(formData.price, interestRate, loanTenure);
      setEmi(emiAmount);
    }
  }, [loanTenure, interestRate, formData.price]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdateCar = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://global-dominion-383716.el.r.appspot.com/api/cars/update-car/${carId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      await axios.delete(`https://global-dominion-383716.el.r.appspot.com/api/cars/delete-car/${carId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
          <div className="flex gap-2">
          <button
              onClick={handleGoBack}
              className="bg-[#292929] text-[#FFFFFF] rounded-xl px-4 py-2"
            >
              Back to Cars List
            </button>
            {isEditable ? (
              <button
                onClick={handleUpdateCar}
                className="bg-[#EA2831] text-[#FFFFFF] px-4 py-2 rounded-xl font-bold"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => setIsEditable(true)}
                className="bg-[#292929] text-[#FFFFFF] px-4 py-2 rounded-xl font-bold"
              >
                Edit
              </button>
            )}
            <button
              onClick={handleDeleteCar}
              className="bg-[#FF4D4F] text-[#FFFFFF] px-4 py-2 rounded-xl font-bold"
            >
              Delete
            </button>
          </div>
        </header>

        <div className="px-40 py-5">
          <div className="flex flex-col gap-5">
            {car.imageUrls && car.imageUrls.length > 0 && (
              <img src={car.imageUrls[0]} alt={car.title} className="w-full h-auto rounded-xl" />
            )}

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="title"
                value={formData.title || ''}
                disabled={!isEditable}
                onChange={handleInputChange}
                className="form-input w-full bg-[#212121] text-[#FFFFFF] border-[#303030] rounded-xl p-3"
                placeholder="Title"
              />

              <input
                type="text"
                name="description"
                value={formData.description || ''}
                disabled={!isEditable}
                onChange={handleInputChange}
                className="form-input w-full bg-[#212121] text-[#FFFFFF] border-[#303030] rounded-xl p-3"
                placeholder="Description"
              />

              <input
                type="text"
                name="price"
                value={formData.price || ''}
                disabled={!isEditable}
                onChange={handleInputChange}
                className="form-input w-full bg-[#212121] text-[#FFFFFF] border-[#303030] rounded-xl p-3"
                placeholder="Price"
              />
            </div>

            <div className="bg-[#212121] p-5 rounded-xl">
              <h3 className="text-[#FFFFFF] font-bold mb-3">EMI Calculator</h3>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-[#FFFFFF]">Loan Tenure (Months): {loanTenure}</label>
                  <Slider
                    min={6}
                    max={60}
                    value={loanTenure}
                    onChange={(value) => setLoanTenure(value)}
                    trackStyle={{ backgroundColor: '#EA2831' }}
                    handleStyle={{ borderColor: '#EA2831' }}
                  />
                </div>

                <div>
                  <label className="text-[#FFFFFF]">Interest Rate (%): {interestRate}</label>
                  <Slider
                    min={1}
                    max={20}
                    value={interestRate}
                    onChange={(value) => setInterestRate(value)}
                    trackStyle={{ backgroundColor: '#EA2831' }}
                    handleStyle={{ borderColor: '#EA2831' }}
                  />
                </div>

                {emi && (
                  <div className="text-[#FFFFFF]">
                    <strong>Monthly EMI: ₹{emi}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
