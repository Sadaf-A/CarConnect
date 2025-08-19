import React, { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const AddCar = () => {
  const [title, setTitle] = useState('');
  const [carNumber, setCarNumber] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const files = event.target.files;
    setImages(Array.from(files)); 
  };

  const uploadImages = async (imageFiles) => {
    try {
      const formData = new FormData();
      imageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await axios.post('https://test-web-site-464607.df.r.appspot.com/api/cars/add-car', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.imageUrls;
    } catch (error) {
      console.error('Error uploading images:', error);
      message.error('Failed to upload images. Please try again.');
      throw new Error('Image upload failed');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    if (!title || !carNumber || !year || !price || !description) {
      message.error('All fields must be filled!');
      setLoading(false);
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('You must be logged in to add a car!');
        navigate('/');
        return;
      }
  
      const formData = new FormData();
      
      formData.append('title', title);
      formData.append('carNumber', carNumber);
      formData.append('year', year);
      formData.append('price', price);
      formData.append('description', description);
  
      images.forEach((file) => {
        formData.append('images', file);
      });
  
      const response = await axios.post('https://test-web-site-464607.df.r.appspot.com/api/cars/add-car', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data) {
        message.success('Car added successfully!');
        navigate('/product-list');
      }
    } catch (error) {
      console.error('Error adding car:', error);
      message.error('Failed to add car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-black dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292929] px-10 py-3">
          <div className="flex items-center gap-4 text-[#FFFFFF]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor"></path>
              </svg>
            </div>
            <h2 className="text-[#FFFFFF] text-lg font-bold leading-tight tracking-[-0.015em]">Car Connect</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="product-list.html">Home</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="https://car-connect-docs.vercel.app/docs/introduction">Documentation</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="https://global-dominion-383716.el.r.appspot.com/api-docs/">API Docs</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="login.html">Login</a>
            </div>
            <div className="flex gap-2">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#EA2831] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">+Add New Car</span>
              </button>
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#292929] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">FAQ</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-between py-5">
          {/* Left Side: Form */}
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#FFFFFF] tracking-light text-[32px] font-bold leading-tight min-w-72">Add a new car</p>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit}>
              {/* Title Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-base font-medium leading-normal pb-2">Title</p>
                  <input
                    placeholder="Enter a title"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border border-[#303030] bg-[#212121] focus:border-[#303030] h-14 placeholder:text-[#ABABAB] p-[15px] text-base font-normal leading-normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </label>
              </div>

              {/* Car Number Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-base font-medium leading-normal pb-2">Car Number</p>
                  <input
                    placeholder="Enter car number"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border border-[#303030] bg-[#212121] focus:border-[#303030] h-14 placeholder:text-[#ABABAB] p-[15px] text-base font-normal leading-normal"
                    value={carNumber}
                    onChange={(e) => setCarNumber(e.target.value)}
                  />
                </label>
              </div>

              {/* Year Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-base font-medium leading-normal pb-2">Year</p>
                  <input
                    placeholder="Enter year"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border border-[#303030] bg-[#212121] focus:border-[#303030] h-14 placeholder:text-[#ABABAB] p-[15px] text-base font-normal leading-normal"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </label>
              </div>

              {/* Price Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-base font-medium leading-normal pb-2">Price</p>
                  <input
                    placeholder="Enter price"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border border-[#303030] bg-[#212121] focus:border-[#303030] h-14 placeholder:text-[#ABABAB] p-[15px] text-base font-normal leading-normal"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </label>
              </div>

              {/* Description Field */}
              <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#FFFFFF] text-base font-medium leading-normal pb-2">Description</p>
                  <textarea
                    placeholder="Write a description"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border border-[#303030] bg-[#212121] focus:border-[#303030] h-auto placeholder:text-[#ABABAB] p-[15px] text-base font-normal leading-normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
              </div>

              {/* Image Upload */}
              <div className="flex flex-col w-[400px] max-w-[400px] p-5 rounded-xl">
                <p className="text-[#FFFFFF] text-lg font-bold mb-5">Upload Images</p>

                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex items-center justify-center h-14 bg-[#EA2831] text-[#FFFFFF] rounded-xl text-base font-bold leading-normal tracking-[0.015em]"
                >
                  Click to Upload Images
                </label>

                <div id="imagePreviewContainer" className="mt-4 flex flex-wrap gap-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="w-[100px] h-[100px] object-cover rounded-xl"
                    />
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex px-4 py-3">
                <button
                  type="submit"
                  className={`flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-5 flex-1 bg-[#EA2831] text-[#FFFFFF] text-base font-bold leading-normal tracking-[0.015em] ${loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                >
                  <span className="truncate">{loading ? 'Submitting...' : 'Submit'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCar;
