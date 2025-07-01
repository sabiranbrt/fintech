import Loader from "@/components/LoaderComponent";
import { useDynamicQuery } from "@/hooks/dynamicQuery";
import { RootState } from "@/redux/store";
import { getDynamicRequest } from "@/utils/dynamicRequest";
import { useSelector } from "react-redux";

const ContactCard = () => {
  const { selectedService } = useSelector((state: RootState) => state.service);
  const { endpoints } = useSelector((state: RootState) => state.endPoints);

  const stepName = selectedService?.sequence?.find(
    (item) => item === "getContact"
  );

  const request = getDynamicRequest(stepName ?? "", endpoints ?? {});
  const { data: contact, isLoading } = useDynamicQuery<TODO>(
    request ?? { url: "", method: "GET" },
    {
      queryKey: [stepName],
      enabled: !!request,
    }
  );

  const contactDetail = contact?.apiResponseData?.data;
  if (isLoading) return <Loader />;

  return (
    <div className="flex justify-center flex-wrap gap-10 mt-6 ml-8 mb-4">
      {contactDetail?.map(
        ({ designation, name, region, email, phone }: TODO, index: number) => {
          // Extracting the initials from the name
          const initials = name
            .split(" ") // Split the name into first and last name
            .map((word: string) => word.charAt(0).toUpperCase()) // Get the first letter of each word
            .join(""); // Combine the initials

          return (
            <div
              key={index}
              className="bg-white py-6 w-72 rounded-2xl shadow-lg   px-10 text-center"
            >
              <h1 className="text-[#fffff] text-xl font-semibold">
                {designation}
              </h1>
              {/* Displaying initials in place of the photo */}
              <div className="w-24 h-24 rounded-full mx-auto bg-gradient-to-right mt-4 flex items-center justify-center text-white text-4xl font-semibold">
                {initials}
              </div>
              <h3 className="text-[#3A3571] text-l font-semibold mt-4">
                {name}
              </h3>
              <p className="text-[#1E6465] text-sm">{region}</p>
              <p className="text-[#3A3571] mt-2">{email}</p>
              <p className="text-[#3A3571]">{phone}</p>
              <button
                className="mt-4 px-4 py-2 bg-gradient-to-right text-white rounded-lg shadow-md"
                onClick={() => (window.location.href = `mailto:${email}`)}
              >
                Contact
              </button>
            </div>
          );
        }
      )}
    </div>
  );
};

export default ContactCard;
