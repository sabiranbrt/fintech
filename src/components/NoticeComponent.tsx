const NoticeComponent = () => {
  return (
    <div
      className="bg-white rounded-md px-5 py-4 lg:h-full lg:overflow-y-auto"
      style={{
        boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px"
      }}
    >
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-secondary-dark mb-4 mt-2">
          Payment Gateway Checkout (PG)
        </h1>
      </div>
      <section>
        <h2 className="text-lg font-semibold text-primary-dark mb-3">
          Important Notes:
        </h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-3 text-sm">
          <li>
            The transaction with{" "}
            <span className="font-semibold">Payment Gateway (PG)</span> may
            sometimes take time to be successful. The payment to the beneficiary
            will be done only after success has been received from the payment
            gateway.
          </li>
          <li>
            Transactions may take a few minutes to process. Please do not{" "}
            <span className="font-semibold">refresh or navigate away</span> from
            the payment page.
          </li>
          <li>
            We use a secure{" "}
            <span className="font-semibold">third-party payment gateway</span>{" "}
            to process your transaction. By proceeding, you agree to their terms
            and conditions.
          </li>
          <li>
            Successful payment does not guarantee service/product delivery if{" "}
            <span className="font-semibold">
              incorrect details are provided
            </span>
            .
          </li>
          <li>
            Your payment details are{" "}
            <span className="font-semibold">
              securely transmitted through encrypted channels
            </span>
            . However, we do not store any payment information.
          </li>
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-primary-dark mb-3 mt-4">
          महत्वपूर्ण नोट्स:
        </h2>
        <ul className="list-disc pl-5 text-gray-700 leading-relaxed space-y-3 text-md">
          <li>
            <span className="font-semibold">भुगतान गेटवे (PG)</span> के साथ
            लेन-देन सफल होने में कभी-कभी समय लग सकता है। भुगतान लाभार्थी को तभी
            किया जाएगा जब भुगतान गेटवे से सफलता प्राप्त हो जाती है।
          </li>
          <li>
            लेन-देन को संसाधित करने में कुछ मिनट लग सकते हैं। कृपया{" "}
            <span className="font-semibold">
              पेज को रिफ्रेश या भुगतान पेज से दूर न जाएं
            </span>
            ।
          </li>
          <li>
            हम आपका लेन-देन संसाधित करने के लिए एक सुरक्षित{" "}
            <span className="font-semibold">तीसरे पक्ष के भुगतान गेटवे</span> का
            उपयोग करते हैं। आगे बढ़ने पर, आप उनके नियमों और शर्तों से सहमत होते
            हैं।
          </li>
          <li>
            सफल भुगतान यह गारंटी नहीं देता कि सेवा/उत्पाद डिलीवरी{" "}
            <span className="font-semibold">गलत विवरण प्रदान किए जाने</span> पर
            होगी।
          </li>
          <li>
            आपके भुगतान विवरण{" "}
            <span className="font-semibold">
              सुरक्षित रूप से एन्क्रिप्टेड चैनलों के माध्यम से भेजे जाते हैं
            </span>
            । हालांकि, हम कोई भी भुगतान जानकारी संग्रहीत नहीं करते हैं।
          </li>
        </ul>
      </section>
    </div>
  );
};

export default NoticeComponent;
