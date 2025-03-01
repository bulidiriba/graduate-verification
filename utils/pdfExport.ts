import jsPDF from "jspdf"

export const exportToPdf = async (element: HTMLElement) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Create canvas for watermark effect
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  // Add logo at the top
  const logoUrl = "/moe-logo.png"
  const stampUrl = "/stamp.png"

  // Load both images
  const [img, stampImg] = await Promise.all([loadImage(logoUrl), loadImage(stampUrl)])

  // Create watermark version of the logo
  canvas.width = img.width
  canvas.height = img.height
  ctx.globalAlpha = 0.1 // Set very low opacity for watermark
  ctx.drawImage(img, 0, 0)
  const watermarkDataUrl = canvas.toDataURL("image/png")

  // Add main logo at top
  pdf.addImage(img, "PNG", 85, 15, 30, 30)

  // Add title
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text("FDRE", 100, 50, { align: "center" })

  // Add title
  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text("MINISTRY OF EDUCATION", 100, 58, { align: "center" })
  // Add title
  // Add Amharic title
  pdf.setFontSize(14)
  pdf.setFont("helvetica", "normal")
  //pdf.text("ትምህርት ሚኒስቴር", 105, 65, { align: "center" })

  // Add watermark
  pdf.addImage(watermarkDataUrl, "PNG", 35, 90, 140, 140)

  // Add "TO WHOM IT MAY CONCERN"
  pdf.setFontSize(14)
  pdf.setFont("helvetica", "bold")
  pdf.text("TO WHOM IT MAY CONCERN", 100, 80, { align: "center" })

  // Add subtitle
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text("This is a digital verification result", 100, 90, { align: "center" })

  // Extract and add text content
  pdf.setFontSize(12)
  let yOffset = 110
  const labelX = 40
  const valueX = 120
  const maxWidth = 80 // Maximum width for the value text

  const contentDivs = Array.from(element.querySelectorAll("div"))
  for (const div of contentDivs) {
    const text = div.textContent?.trim()
    if (text) {
      const parts = text.split(":")
      if (parts.length === 2) {
        const label = parts[0].trim() + ":"
        const value = parts[1].trim()

        pdf.setFont("helvetica", "bold")
        pdf.text(label, labelX, yOffset)

        pdf.setFont("helvetica", "normal")
        const lines = pdf.splitTextToSize(value, maxWidth)
        pdf.text(lines, valueX, yOffset)

        // Increase yOffset based on the number of lines
        yOffset += 10 * Math.max(1, lines.length)

        // Check if we need to add a new page
        if (yOffset > 270) {
          pdf.addPage()
          yOffset = 20 // Reset yOffset for the new page
        }
      }
    }
  }

  // Add verification text at bottom with stamp on the right
  yOffset = Math.max(yOffset, 250) // Ensure we don't overlap with content
  pdf.setFontSize(10)

  // Calculate text width for proper stamp positioning
  const verificationText1 =
    "This printout document shows that the graduate has been digitally verified by the Ministry of Education"
  const verificationText2 = "But its not valid for official use, you can verify online at gvs.ethernet.edu.et."

  // Add verification text (aligned left for better stamp placement)
  pdf.text(verificationText1, 40, yOffset)
  pdf.text(verificationText2, 40, yOffset + 5)

  // Add verification stamp to the right of the text
  pdf.addImage(stampImg, "PNG", 130, yOffset - 20, 50, 50)

  // Add ministry name at bottom
  yOffset += 20
  pdf.setFont("helvetica", "bold")
  pdf.text("Ministry of Education", 105, yOffset, { align: "center" })

  // Add current date and time at the bottom of the page
  const now = new Date()
  const dateTimeString = now.toISOString() // This gives full precision including microseconds
  pdf.setFontSize(6) // Very small font size
  pdf.setFont("helvetica", "normal")
  pdf.text(`Generated on: ${dateTimeString}`, 105, 297 - 5, { align: "center" }) // 5mm from bottom of A4 page

  // Save the PDF file
  pdf.save("Graduate_Verification_Result.pdf")
}


// Helper function to load images
const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

