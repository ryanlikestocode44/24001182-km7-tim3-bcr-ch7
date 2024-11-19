import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Breadcrumb from "react-bootstrap/Breadcrumb";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { deleteTypeCar, getDetailTypeCar } from "../../../services/types";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery, useMutation } from "@tanstack/react-query";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Protected from "../../../components/Auth/Protected";

export const Route = createLazyFileRoute("/admin/types/$id")({
  component: () => (
    <Protected roles={[1]}>
      <TypeCarDetail />
    </Protected>
  ),
});

function TypeCarDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [types, setTypeCar] = useState(null);

  // Use react query to fetch API
  const { data, isSuccess, isPending, isError } = useQuery({
    queryKey: ["types", id],
    queryFn: () => getDetailTypeCar(id),
    enabled: !!id,
  });

  const { mutate: deleting, isPending: isDeleteProcessing } = useMutation({
    mutationFn: () => deleteTypeCar(id),
    onSuccess: () => {
        navigate({ to: "/admin/types" });
    },
    onError: (error) => {
        toast.error(error?.message);
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setTypeCar(data);
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
          <h1 className="text-center">Car type is not found!</h1>
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
      confirmButtonText: "Delete",
      confirmButtonColor: "red",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const deleteResult = deleting(id);
        if (deleteResult?.success) {
          navigate({ to: "/admin/types" });
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
          <Link to="/admin/types">Types</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Detail</Breadcrumb.Item>
      </Breadcrumb>
      <h4 className="fw-bold mb-3">Type Car Detail</h4>
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header as="h5" className="text-center">
              Type Car Information
            </Card.Header>
            <Card.Body>
              <Card.Title>
                <strong>Name : </strong>
                {types?.name}
              </Card.Title>
              <Card.Text>
                <strong>Description :</strong> {types?.description}
              </Card.Text>
              <Card.Text>
                <strong>Capacity :</strong> {types?.capacity}
              </Card.Text>
            </Card.Body>
            <div className="text-center mb-3">
              {user?.roleId === 1 && (
                <Button
                  onClick={onDelete}
                  disabled={isDeleteProcessing}
                  variant="danger"
                  className="px-5 py-2 mt-2"
                >
                  <FontAwesomeIcon icon={faTrash} className="me-2" />
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
