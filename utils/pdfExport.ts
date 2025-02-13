import jsPDF from "jspdf"

export const exportToPdf = async (element: HTMLElement) => {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  // Add logos at the top
  const logoUrl = "/moe-logo.png"
  const img = new Image()
  img.src = logoUrl

  await new Promise((resolve) => {
    img.onload = resolve
  })

  // Add logos
  pdf.addImage(img, "PNG", 20, 15, 25, 25) // Left logo
  pdf.addImage(img, "PNG", 165, 15, 25, 25) // Right logo

  // Add title in both languages
  pdf.setFontSize(16)
  pdf.setTextColor(0, 0, 0)
  pdf.setFont("helvetica", "bold")
  pdf.text("FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA", 105, 20, { align: "center" })
  pdf.text("MINISTRY OF EDUCATION", 105, 27, { align: "center" })

  // Add form details
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.text(`FORM: ${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`, 170, 40)
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 170, 45)

  // Add "TO WHOM IT MAY CONCERN"
  pdf.setFontSize(14)
  pdf.setFont("helvetica", "bold")
  pdf.text("TO WHOM IT MAY CONCERN", 105, 60, { align: "center" })

  // Add certification text
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "normal")
  pdf.text("This is a digital verification result ", 105, 75, { align: "center" })

  
  // Add watermark using a very light gray color
  pdf.setDrawColor(400, 400, 400) // Very light gray color for watermark
  pdf.setFillColor(400, 400, 400)

  pdf.addImage(img, "PNG", 55, 90, 100, 100)
  pdf.setTextColor(0, 0, 0) // Reset text color to black

  // Extract and add text content
  pdf.setFontSize(12)
  let yOffset = 85
  element.querySelectorAll("div").forEach((div) => {
    const text = div.textContent?.trim()
    if (text) {
      const parts = text.split(":")
      if (parts.length === 2) {
        pdf.setFont("helvetica", "bold")
        pdf.text(parts[0].trim() + ":", 40, yOffset)
        pdf.setFont("helvetica", "normal")
        pdf.text(parts[1].trim(), 85, yOffset)
      }
      yOffset += 8
    }
  })

  // Add verification text
  yOffset += 15
  pdf.setFontSize(10)
  pdf.text("This document has been digitally verified by the Ministry of Education Graduate", 105, yOffset, {
    align: "center",
  })
  pdf.text("Verification System and is considered an official document.", 105, yOffset + 5, { align: "center" })

  // Add signature section
  yOffset += 25
  pdf.line(40, yOffset, 160, yOffset)
  pdf.setFontSize(11)
  pdf.text("Ministry of Education", 105, yOffset + 5, { align: "center" })

  // Add stamps
  // Blue stamp
  pdf.setDrawColor(0, 150, 214)
  pdf.circle(75, yOffset - 10, 15)
  pdf.setFontSize(6)
  pdf.setTextColor(0, 150, 214)
  pdf.text("MINISTRY OF", 75, yOffset - 13, { align: "center" })
  pdf.text("EDUCATION", 75, yOffset - 10, { align: "center" })
  pdf.text("ETHIOPIA", 75, yOffset - 7, { align: "center" })

  // Purple stamp
  pdf.setDrawColor(128, 0, 128)
  pdf.setTextColor(128, 0, 128)
  pdf.circle(135, yOffset - 10, 15)
  pdf.text("VERIFIED", 135, yOffset - 10, { align: "center" })
  pdf.text(new Date().toLocaleDateString(), 135, yOffset - 7, { align: "center" })

  // Reset text color
  pdf.setTextColor(0, 0, 0)

  // Add footer
  const pageHeight = pdf.internal.pageSize.height
  pdf.setFontSize(8)
  pdf.text("Graduate Verification System.", 105, pageHeight - 10, { align: "center" })

  // Save the PDF file
  pdf.save("Graduate_Verification_Result.pdf")
}

