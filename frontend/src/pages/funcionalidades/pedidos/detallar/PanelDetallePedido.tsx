import {
  Drawer,
  DrawerHeader,
  DrawerHeaderTitle,
  DrawerBody,
  useRestoreFocusSource,
  Button,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";
import React, { useEffect, useState } from "react";
import { IDetallePedido } from "../../../interfaces/IPedidos";
import PedidosServices from "../../../services/pedidos/PedidosServices";

interface PanelDetalleVentaProps {
  isOpen: boolean;
  isClose: () => void;
  pedidoId: string;
}

const PanelDetallePedido: React.FC<PanelDetalleVentaProps> = ({
  isOpen,
  isClose,
  pedidoId,
}) => {
  const restoreFocusSourceAttributes = useRestoreFocusSource();
  const [dataDetalle, setDataDetalle] = useState<IDetallePedido>(null!);

  function detallePedidoById() {
    PedidosServices.detallePedido(pedidoId).then((res) => {
      if (res.status == 200) {
        setDataDetalle(res.data);
      }
    });
  }

  useEffect(() => {
    detallePedidoById();
  }, [pedidoId]);

  return (
    <div>
      <Drawer
        position="end"
        size="medium"
        {...restoreFocusSourceAttributes}
        separator
        open={isOpen}
      >
        <DrawerHeader>
          <DrawerHeaderTitle
            action={
              <Button
                appearance="subtle"
                aria-label="Close"
                icon={<Dismiss24Regular />}
                onClick={isClose}
              />
            }
          >
            Detalle de Pedido {dataDetalle?.seriePedido}
          </DrawerHeaderTitle>
        </DrawerHeader>
        <br />
        <DrawerBody>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "10px",
              width: "100%",
            }}
          >
            <div>
              <h3>Creado Por</h3>
              {dataDetalle?.registradoPor}
            </div>

            <div>
              <h3>Fecha de pedido</h3>
              {dataDetalle?.fechaPedido} {dataDetalle?.horaPedido}
            </div>

            <div>
              <h3>Estado de pedido</h3>
              {dataDetalle?.estado}
            </div>

            <div>
              <h3>Ruc</h3>
              {dataDetalle?.ruc}
            </div>

            <div>
              <h3>Razón Social</h3>
              {dataDetalle?.razonSocial}
            </div>

            <div>
              <h3>Dirección</h3>
              {dataDetalle?.direccion}
            </div>

            <div>
              <h3>I.G.V.</h3>
              S/ {dataDetalle?.igv}
            </div>

            <div>
              <h3>I.V.A.</h3>
              S/ {dataDetalle?.iva}
            </div>

            <div>
              <h3>Total Pedido</h3>
              S/ {dataDetalle?.total}
            </div>
          </div>
          <br />
          {dataDetalle?.productos && dataDetalle.productos.length > 0 ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#3b3b3b" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Cantidad
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Producto
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Precio
                  </th>
                </tr>
              </thead>
              <tbody>
                {dataDetalle.productos.map((producto, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {producto.cantidad}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {producto.nombreProducto}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      S/ {producto.precio.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay productos en esta venta.</p>
          )}
        </DrawerBody>
      </Drawer>
    </div>
  );
};

export default PanelDetallePedido;
