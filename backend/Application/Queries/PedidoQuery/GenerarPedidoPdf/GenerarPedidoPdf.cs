using backend.Application.Queries.PedidoQuery.DetallePedido;
using iText.Kernel.Colors;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout;
using iText.Layout.Borders;
using iText.Layout.Element;
using iText.Layout.Properties;

namespace backend.Application.Queries.PedidoQuery.GenerarPedidoPdf
{
    public class PdfGeneratorService : IPdfGenerador
    {
        public async Task<string> GeneratePdf(DetallePedidoDTO detallePedido)
        {
            var downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
            var pdfFilePath = Path.Combine(downloadsPath, $"DetallePedido_{detallePedido.PedidoId}.pdf");

            using (var writer = new PdfWriter(pdfFilePath))
            {
                using (var pdfDoc = new PdfDocument(writer))
                {
                    var document = new Document(pdfDoc);

                    var headerTable = new Table(UnitValue.CreatePercentArray(new float[] { 1, 3 })).UseAllAvailableWidth();
                    headerTable.AddCell(new Cell().Add(new Paragraph("SGII").SetFontSize(20).SetBold()).SetBorder(Border.NO_BORDER));
                    headerTable.AddCell(new Cell().Add(new Paragraph("SISTEMA DE GESTIÓN DE INVENTARIO INTELIGENTE").SetFontSize(12)).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));
                    headerTable.AddCell(new Cell().Add(new Paragraph("")).SetBorder(Border.NO_BORDER));
                    headerTable.AddCell(new Cell().Add(new Paragraph("Av Javier Prado Oeste 757, Magdalena del Mar 15076").SetFontSize(10)).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));
                    document.Add(headerTable);

                    document.Add(new LineSeparator(new SolidLine()));

                    document.Add(new Paragraph("").SetMarginBottom(10));

                    var clientOrderHeader = new Table(UnitValue.CreatePercentArray(new float[] { 1, 1 })).UseAllAvailableWidth().SetMarginBottom(10);
                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph("Para:").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))).SetBorder(Border.NO_BORDER));
                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph("Factura").SetFontSize(12).SetBold().SetFontColor(new DeviceRgb(60, 106, 158))).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));

                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph($"RUC: {detallePedido.Ruc}")).SetBorder(Border.NO_BORDER));
                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph($"N°: {detallePedido.SeriePedido}")).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));

                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph($"Razón Social: {detallePedido.RazonSocial}")).SetBorder(Border.NO_BORDER));
                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph("")).SetBorder(Border.NO_BORDER));

                    clientOrderHeader.AddCell(new Cell().Add(new Paragraph($"Dirección: {detallePedido.Direccion}")).SetBorder(Border.NO_BORDER));
                    document.Add(clientOrderHeader);

                    var contactInfoTable = new Table(UnitValue.CreatePercentArray(new float[] { 1, 1, 1 })).UseAllAvailableWidth().SetMarginBottom(10);

                    contactInfoTable.AddCell(new Cell().Add(new Paragraph("Contacto").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))).SetBorder(Border.NO_BORDER));
                    contactInfoTable.AddCell(new Cell().Add(new Paragraph("Fecha de Pedido").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))).SetTextAlignment(TextAlignment.CENTER).SetBorder(Border.NO_BORDER));
                    contactInfoTable.AddCell(new Cell().Add(new Paragraph("Gestionado por").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));

                    contactInfoTable.AddCell(new Cell().Add(new Paragraph($"{detallePedido.RazonSocial}")).SetBorder(Border.NO_BORDER));
                    contactInfoTable.AddCell(new Cell().Add(new Paragraph($"{detallePedido.FechaPedido:dd/MM/yyyy}")).SetTextAlignment(TextAlignment.CENTER).SetBorder(Border.NO_BORDER));
                    contactInfoTable.AddCell(new Cell().Add(new Paragraph($"{detallePedido.RegistradoPor}")).SetTextAlignment(TextAlignment.RIGHT).SetBorder(Border.NO_BORDER));

                    document.Add(contactInfoTable);
                    
                    var orderDetailsTable = new Table(UnitValue.CreatePercentArray(new float[] { 4, 2, 2 })).UseAllAvailableWidth().SetMarginBottom(15);
                    orderDetailsTable.AddHeaderCell(new Cell().Add(new Paragraph("Producto").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))));
                    orderDetailsTable.AddHeaderCell(new Cell().Add(new Paragraph("Cantidad").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))));
                    orderDetailsTable.AddHeaderCell(new Cell().Add(new Paragraph("Precio").SetBold().SetFontColor(new DeviceRgb(60, 106, 158))));

                    foreach (var producto in detallePedido.Productos)
                    {
                        orderDetailsTable.AddCell(new Cell().Add(new Paragraph(producto.NombreProducto)));
                        orderDetailsTable.AddCell(new Cell().Add(new Paragraph(producto.Cantidad.ToString())));
                        orderDetailsTable.AddCell(new Cell().Add(new Paragraph(producto.Precio.ToString("C2"))));
                    }
                    document.Add(orderDetailsTable);

                    var summaryTable = new Table(UnitValue.CreatePercentArray(new float[] { 1, 1 }))
                    .SetWidth(UnitValue.CreatePercentValue(50))
                    .SetHorizontalAlignment(HorizontalAlignment.RIGHT);

                    summaryTable.AddCell(new Cell().Add(new Paragraph("IGV").SetFontSize(9)));
                    summaryTable.AddCell(new Cell().Add(new Paragraph(detallePedido.Igv.ToString("C2")).SetFontSize(9)).SetTextAlignment(TextAlignment.RIGHT));

                    summaryTable.AddCell(new Cell().Add(new Paragraph("IVA").SetFontSize(9)));
                    summaryTable.AddCell(new Cell().Add(new Paragraph(detallePedido.Iva.ToString("C2")).SetFontSize(9)).SetTextAlignment(TextAlignment.RIGHT));

                    summaryTable.AddCell(new Cell().Add(new Paragraph("Total").SetBold()));
                    summaryTable.AddCell(new Cell().Add(new Paragraph(detallePedido.Total.ToString("C2")).SetBold()).SetTextAlignment(TextAlignment.RIGHT));

                    document.Add(summaryTable);

                    var separator = new LineSeparator(new SolidLine());
                    separator.SetFixedPosition(0, 40, pdfDoc.GetDefaultPageSize().GetWidth());
                    document.Add(separator);

                    var footerParagraph = new Paragraph("Sistema de Gestión de Inventario Inteligente")
                    .SetTextAlignment(TextAlignment.CENTER)
                    .SetFontSize(10)
                    .SetFixedPosition(0, 20, pdfDoc.GetDefaultPageSize().GetWidth());
                    document.Add(footerParagraph);


                    var creatorParagraph = new Paragraph("Creado por Giancarlo Chunga")
                        .SetTextAlignment(TextAlignment.CENTER)
                        .SetFontSize(8)
                        .SetFixedPosition(0, 10, pdfDoc.GetDefaultPageSize().GetWidth());
                    document.Add(creatorParagraph);
                    
                    document.Close();
                }
            }

            return pdfFilePath;
        }
    }

}
