/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '@/libs/axios';
import React, { useEffect, useState } from 'react';

const ContactCard = () => {
  
  const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);

  // Function to fetch and update the data
  const fetchAndUpdateData = async () => {
    // setIsLoading(true)
    try {
      const response = await axiosInstance.get('agent/relationship-manager/get', {
        headers: {
          includeUrn: true,
          authToken: localStorage.getItem('authToken'),
        },
      }); 
      /* {
        data:{
          "apiResponseCode": "200",
          "apiResponseMessage": "Success",
          "apiResponseTime": "2025-02-20T10:13:33.658039112",
          "apiResponseFrom": "JAVA",
          "apiResponseData": {
              "responseCode": "200",
              "responseMessage": "Relationship manager details fetched successfully.",
              "data": [
                  {
                      "name": "Finkeda Architect",
                      "email": "architect@finkeda.com",
                      "contactNumber": "9999999999",
                      "contactAddress": "noida, noida, UttarPradesh",
                      "pincode": "",
                      "managerType": "Sales Employee",
                      "agentId": 9241980021198903
                  },
                  
                  
                
           
              ]
          }
      }
      } */
      // Extracting the response data
      const responseData = response?.data.apiResponseData.data;

      // Mapping the response data to match the structure of your state
      const newData = responseData?.map((item: { managerType: any; name: any; contactAddress: any; email: any; contactNumber: any; }) => ({
        designation: item.managerType, // managerType as designation
        photo: 'https://www.perkosis.com/uploads/staffs/big/9.jpg', 
        name: item.name,
        region: item.contactAddress,
        email: item.email,
        phone: item.contactNumber,
      }));

      // Set the fetched data to the state
      setData(newData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally{
      // setIsLoading(false)
    }
  };

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchAndUpdateData();
  }, []);
  return (
    <div className="flex justify-center flex-wrap gap-10 mt-6 ml-8 mb-4">
      {/* {isLoading && <Loader/>} */}
      {data?.map(({ designation, name, region, email, phone }, index) => {
  // Extracting the initials from the name
  const initials = name
    .split(' ')  // Split the name into first and last name
    .map((word: string) => word.charAt(0).toUpperCase())  // Get the first letter of each word
    .join('');  // Combine the initials
  
  return (
    <div key={index} className="bg-white py-6 w-72 rounded-2xl shadow-lg   px-10 text-center">
      <h1 className="text-[#fffff] text-xl font-semibold">{designation}</h1>
      {/* Displaying initials in place of the photo */}
      <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-right mt-4 flex items-center justify-center text-white text-4xl font-semibold">
        {initials}
      </div>
      <h3 className="text-[#3A3571] text-l font-semibold mt-4">{name}</h3>
      <p className="text-[#1E6465] text-sm">{region}</p>
      <p className="text-[#3A3571] mt-2">{email}</p>
      <p className="text-[#3A3571]">{phone}</p>
      <button 
  className="mt-4 px-4 py-2 bg-gradient-to-right text-white rounded-lg shadow-md"
  onClick={() => window.location.href = `mailto:${email}`}
>
  Contact
</button>
    </div>
  );
})}
      </div>
  );
};

export default ContactCard;
