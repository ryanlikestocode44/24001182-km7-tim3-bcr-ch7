import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { deleteManufacture } from "../../../services/manufactures";
import { getDetailManufacture } from "../../../services/manufactures";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import { useSelector } from "react-redux";
import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Protected from "../../../components/Auth/Protected";

export const Route = createLazyFileRoute("/admin/manufactures/$id")({
  component: () => (
    <Protected roles={[1]}>
      <ManufactureDetail />
    </Protected>
  ),
});

function ManufactureDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [manufacture, setManufacture] = useState(null);

  // Use react query to fetch API
  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ["manufactures", id],
    queryFn: () => getDetailManufacture(id),
    enabled: !!id,
  });

  const { mutate: deleting, isPending: isDeleteProcessing } = useMutation({
    mutationFn: () => deleteManufacture(id),
    onSuccess: () => {
        navigate({ to: "/admin/manufactures" });
    },
    onError: (error) => {
        toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setManufacture(data);
    }
  }, [data, isSuccess]);

  if (isPending) {
    return (
      <Row className="mt-5">
        <Col className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden"></span>
          </Spinner>
        </Col>
      </Row>
    );
  }

  if (isError) {
    return (
      <Row className="mt-5">
        <Col>
          <h1 className="text-center">Manufacture is not found!</h1>
        </Col>
      </Row>
    );
  }

  const onDelete = async (event) => {
    event.preventDefault();

    Swal.fire({
      title: "Confirm to delete",
      text: "Are you sure to delete this data?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#0d6efd",
      cancelButtonText: "No",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = deleting(id);
        if (deleteResult?.success) {
          navigate({ to: "/admin/manufactures" });
        } else {
          toast.error(deleteResult?.message);
        }
      }
    });
  };

  return (
    <Container className="my-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to="/admin/manufactures">Manufactures</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Detail</Breadcrumb.Item>
      </Breadcrumb>
      <h4 className="fw-bold mb-3">Manufacture Detail</h4>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5" className="text-center">
              Manufacture Information
            </Card.Header>
            <Card.Body>
              <Card.Title>
                <strong>Name : </strong>
                {manufacture?.name}
              </Card.Title>
              <Card.Text>
                <strong>Country :</strong> {manufacture?.country}
              </Card.Text>
            </Card.Body>
            <div className="text-center mb-3">
              {user?.roleId === 1 && (
                <Button
                  onClick={onDelete}
                  variant="danger"
                  disabled={isDeleteProcessing}
                  className="px-5 py-2 mt-2"
                >
                  Delete
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
