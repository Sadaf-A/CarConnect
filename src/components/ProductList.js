import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { message } from 'antd'; 
import { useNavigate } from 'react-router-dom'; 
import AnimatedArrow from './Arrow';

const CarConnect = () => {
  const [cars, setCars] = useState([]); 
  const [filteredCars, setFilteredCars] = useState([]); 
  const [title, setTitle] = useState(''); 
  const [description, setDescription] = useState(''); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const token = localStorage.getItem('token'); 
        if (!token) {
          navigate('/');
          return;
        }
        const response = await axios.get('test-web-site-464607@appspot.gserviceaccount.com/api/cars/get-cars', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCars(response.data); 
        setFilteredCars(response.data); 
        setLoading(false); 
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
        message.error('Failed to fetch cars. Please try again.');
      }
    };

    fetchCars();
  }, [navigate]);

  const searchCars = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    const result = cars.filter(car => 
      car.title.toLowerCase().includes(searchQuery) ||
      car.description.toLowerCase().includes(searchQuery)
    );
    setFilteredCars(result);
  };

  const handleAddCar = async () => {
    navigate('/add-car');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-black dark group/design-root overflow-x-hidden" style={{ fontFamily: 'Manrope, Noto Sans, sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#292929] px-10 py-3">
          <div className="flex items-center gap-4 text-[#FFFFFF]">
            <h2 className="text-[#FFFFFF] text-lg font-bold leading-tight tracking-[-0.015em]">Car Connect</h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="#">Home</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="https://car-connect-docs.vercel.app/docs/introduction">Documentation</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="https://global-dominion-383716.el.r.appspot.com/api-docs/">API Docs</a>
              <a className="text-[#FFFFFF] text-sm font-medium leading-normal" href="/">Login</a>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddCar}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#EA2831] text-[#FFFFFF] text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">+ Add New Car</span>
              </button>
            </div>
          </div>
        </header>

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#FFFFFF] tracking-light text-[32px] font-bold leading-tight min-w-72">Your Cars</p>
            </div>
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <div className="text-[#ABABAB] flex border-none bg-[#292929] items-center justify-center pl-4 rounded-l-xl border-r-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    id="search-input"
                    placeholder="Search cars..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#FFFFFF] focus:outline-0 focus:ring-0 border-none bg-[#292929] focus:border-none h-full placeholder:text-[#ABABAB] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    onInput={searchCars}
                  />
                </div>
              </label>
            </div>
            <div id="car-list" className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">
             {filteredCars.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4 text-center mt-20" style={{marginTop: 200}}>
                          <p className="text-[#FFFFFF] text-2xl font-bold">
                            You have no cars added yet.
                          </p>
                          <AnimatedArrow />
                        </div>
                      ) : ( <> </> )}
{filteredCars.map((car, index) => (
  <div
    key={index}
    className="flex flex-col gap-3 pb-3 cursor-pointer"
    onClick={() => navigate(`/car-details/${car._id}`)} 
  >
    {car.imageUrls && car.imageUrls.length > 0 && (
      <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl">
        <img
          src={car.imageUrls[0]} 
          className="w-full h-full object-cover rounded-xl"
        />
      </div>
    )}

    {car.imageUrls && car.imageUrls.length > 1 && (
      <div className="flex gap-2 mt-2 overflow-x-auto">
        {car.imageUrls.slice(1).map((imageUrl, i) => (
          <img
            key={i}
            src={imageUrl}
            alt={`${car.title} - additional image ${i + 1}`}
            className="w-16 h-16 object-cover rounded-md cursor-pointer"
          />
        ))}
      </div>
    )}
      
      <div className="flex flex-col gap-2">
        <p className="text-[#FFFFFF] text-base font-medium leading-normal">{car.title}</p>
        <p className="text-[#ABABAB] text-sm font-normal leading-normal">{car.description}</p>
        <p className="text-[#ABABAB] text-sm font-normal leading-normal">Car Number: {car.carNumber}</p>
        <p className="text-[#ABABAB] text-sm font-normal leading-normal">Year: {car.year}</p>
        <p className="text-[#EA2831] text-lg font-bold leading-normal">Price: ${car.price}</p>
        {car.condition && (
          <p className="text-[#ABABAB] text-sm font-normal leading-normal">Condition: {car.condition}</p>
        )}
      </div>
    </div>
  ))}
</div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CarConnect;
