import { Button, Text } from "@fluentui/react-components";
import { ArrowLeftRegular, ArrowRightRegular } from "@fluentui/react-icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const Paginacion = ({
  currentPage,
  totalPages,
  onNextPage,
  onPreviousPage,
}: PaginationProps) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "10px",
      }}
    >
      <Button
        style={{ backgroundColor: "#10a2db" }}
        icon={<ArrowLeftRegular />}
        onClick={onPreviousPage}
        disabled={currentPage === 1}
      />

      <Text>{`Página ${currentPage} de ${totalPages}`}</Text>

      <Button
        style={{ backgroundColor: "#10a2db" }}
        icon={<ArrowRightRegular />}
        onClick={onNextPage}
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

export default Paginacion;
