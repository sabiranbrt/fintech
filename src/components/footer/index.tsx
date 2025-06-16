/* eslint-disable @typescript-eslint/no-explicit-any */

interface IProps{
    messages:any
}

const Footer = ({ messages }:IProps) => {
  const defaultMessages = [
    'Welcome to Ik Credit Pay - Your Trusted Financial Partner',
    'Send money instantly across the globe',
    'Register today for exclusive benefits',
    '24/7 customer support available',
  ];

  const marqueeMessages = messages?.length > 0 ? messages : defaultMessages;
  const shouldDuplicate = marqueeMessages.length > 1;

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-[#dcdfec] to-[#a0ddde] text-black py-2 shadow-lg z-50">
      <div className="relative overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_50s_linear_infinite]">
          {marqueeMessages?.map((message:string, index:number) => (
            <span key={index} className="mx-4 text-sm">
              {message}
              <span className="mx-2">•</span>
            </span>
          ))}
        </div>
        {shouldDuplicate && (
          <div className="inline-block animate-[marquee_50s_linear_infinite]">
            {marqueeMessages?.map((message:string, index:number) => (
              <span key={`dup-${index}`} className="mx-4 text-sm">
                {message}
                <span className="mx-2">•</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
