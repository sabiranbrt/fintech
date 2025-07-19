// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

export const PDFViewer = ({ pdfUrl }: TODO) => {
  const previewUrl = `${pdfUrl}#view=FitH&toolbar=0&navpanes=0`;

  return (
    <div className="border rounded-lg bg-gray-50 p-2 min-w-full">
      <iframe
        src={previewUrl}
        title="PDF Preview"
        className="rounded min-h-[40dvh] min-w-full"
        onError={(e) => {
          const target = e.target as HTMLIFrameElement;
          const errorHtml = `
            <div class="text-red-500 text-center p-4">
              Failed to load PDF. 
              <a href="${pdfUrl}" target="_blank" class="text-blue-600 underline">Open in new tab</a>
            </div>
          `;
          const wrapper = document.createElement("div");
          wrapper.innerHTML = errorHtml;
          target.replaceWith(wrapper);
        }}
      />
      <div className="mt-2 text-center">
        {/*  <a
    href={pdfUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-blue-600 underline"
  >
    Open PDF in new tab
  </a> */}

        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:underline"
        >
          Download PDF
        </a>
        <br />
      </div>
    </div>
  );
};
