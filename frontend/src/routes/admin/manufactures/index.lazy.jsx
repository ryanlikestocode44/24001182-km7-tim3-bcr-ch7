import {
  Container,
  Breadcrumb,
  Button,
  Col,
  Spinner,
  Table,
  Row,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { getManufactures } from "../../../services/manufactures";
import ManufactureItem from "../../../components/Admin/ManufactureItem";
import { confirmAlert } from "react-confirm-alert";
import { useQuery } from "@tanstack/react-query";
import Protected from "../../../components/Auth/Protected";

export const Route = createLazyFileRoute("/admin/manufactures/")({
  component: () => (
    <Protected roles={[1]}>
      <IndexManufacture />
    </Protected>
  ),
});

function IndexManufacture() {
  const { user, token } = useSelector((state) => state.auth);

  const [manufactures, setManufactures] = useState([]);

  const { data, isSuccess, isPending } = useQuery({
    queryKey: ["manufactures"],
    queryFn: () => getManufactures(),
    enabled: !!token,
  });

  useEffect(() => {
    if (isSuccess) {
      setManufactures(data);
    }
  }, [data, isSuccess]);

  if (!token) {
    return (
      <Row className="mt-4">
        <Col>
          <h1 className="text-center">
            Please login first to get manufacture data!
          </h1>
        </Col>
      </Row>
    );
  }

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

  return (
    <Container className="my-4">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to="/admin">Home</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Manufactures</Breadcrumb.Item>
      </Breadcrumb>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
        <h4 className="fw-bold mb-3 mb-md-0">Manufacture List</h4>
        {user?.roleId === 1 && (
          <Button
            as={Link}
            href={`/admin/manufactures/create`}
            variant="primary"
            className="rounded-0"
          >
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            <span>Create Manufacture</span>
          </Button>
        )}
      </div>

      {/* Responsive Table */}
      <div className="table-responsive mt-4">
        <Table bordered hover className="mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Country</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {manufactures.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">
                  <strong>Manufacture data not found!</strong>
                </td>
              </tr>
            ) : (
              manufactures.map((manufacture) => (
                <ManufactureItem
                  manufacture={manufacture}
                  key={manufacture?.id}
                />
              ))
            )}
          </tbody>
        </Table>
      </div>
    </Container>
  );
}
