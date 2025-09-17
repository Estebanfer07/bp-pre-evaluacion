/**
 * Utility functions for document generation and download
 */

/**
 * Downloads a base64 encoded PDF file
 * @param base64Data - The base64 encoded PDF data
 * @param filename - The filename for the downloaded file
 */
export const downloadPdfFromBase64 = (
  base64Data: string,
  filename: string
): void => {
  try {
    // Convert base64 to binary
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    throw new Error("Failed to download PDF file");
  }
};

/**
 * Downloads a base64 encoded Excel file
 * @param base64Data - The base64 encoded Excel data
 * @param filename - The filename for the downloaded file
 */
export const downloadExcelFromBase64 = (
  base64Data: string,
  filename: string
): void => {
  try {
    // Convert base64 to binary
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create download link and trigger download
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading Excel:", error);
    throw new Error("Failed to download Excel file");
  }
};

/**
 * Generates a filename for movement reports
 * @param accountNumber - The account number (optional)
 * @param format - The file format (PDF or EXCEL)
 * @returns The generated filename
 */
export const generateMovementReportFilename = (
  accountNumber?: string,
  format: "PDF" | "EXCEL" = "PDF"
): string => {
  const date = new Date().toISOString().split("T")[0];
  const account = accountNumber || "todos";
  const extension = format === "PDF" ? "pdf" : "xlsx";
  return `movimientos-${account}-${date}.${extension}`;
};
